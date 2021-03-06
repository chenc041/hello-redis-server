import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';
import { SetValueByKey } from '../interface/redis.interface';

@Injectable()
export class RedisService {
	redis: IORedis.Redis;

	async login(options: IORedis.RedisOptions): Promise<boolean> {
		let result: false | IORedis.Redis;
		try {
			result = await this.connect(options);
			if (result) {
				this.redis = result;
			}
			return true;
		} catch (e) {
			return false;
		}
	}

	async keys(partten: string): Promise<string[]> {
		return await this.redis.keys(partten);
	}

	async getValueByKey(key: IORedis.KeyType): Promise<string> {
		return await this.redis.get(key);
	}

	async deleteKey(...key: IORedis.KeyType[]): Promise<number> {
		return await this.redis.del(...key);
	}

	async setValueByKey({ key, value, expiryMode = 'EX', time = 300, setMode = 'NX' }: SetValueByKey): Promise<string> {
		const result = await this.redis.set(key, value, expiryMode, time, setMode);
		return result;
	}

	async getKeyOfTtl(key: IORedis.KeyType): Promise<number> {
		return await this.redis.ttl(key);
	}

	async setExpireOfKey(key: IORedis.KeyType, expireTime: number): Promise<1 | 0> {
		return await this.redis.expire(key, expireTime);
	}

	async renameKey(key: IORedis.KeyType, newKey: IORedis.KeyType): Promise<string> {
		return await this.redis.rename(key, newKey);
	}

	async checKeyExist(key: IORedis.KeyType): Promise<number> {
		return await this.redis.exists(key);
	}

	// connect redis
	private async connect(param: IORedis.RedisOptions): Promise<false | IORedis.Redis> {
		const redis = new Promise<false | IORedis.Redis>((resolve, reject) => {
			const redis = new IORedis(param);
			redis.on('ready', () => resolve(redis));
			redis.on('error', e => {
				redis.quit();
				return reject(e);
			});
		});
		return redis;
	}
}
