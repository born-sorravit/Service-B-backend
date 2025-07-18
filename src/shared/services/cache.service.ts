import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheGroup, CachePrefix } from 'src/constants/cache-prefix.constant';

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(private readonly cacheManager: Redis) {}

  onModuleDestroy() {
    this.cacheManager.disconnect();
  }

  async get(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
  ): Promise<string | null> {
    return this.cacheManager.get(`${prefix}:${group}:${key}`);
  }

  async set(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    value: string,
  ): Promise<void> {
    await this.cacheManager.set(`${prefix}:${group}:${key}`, value);
  }

  async delete(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
  ): Promise<void> {
    await this.cacheManager.del(`${prefix}:${group}:${key}`);
  }

  async setWithExpiry(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.cacheManager.set(
      `${prefix}:${group}:${key}`,
      value,
      'EX',
      expiry,
    );
  }

  // Hash operations
  async hSet(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    data: Record<string, string>,
    expiry?: number,
  ): Promise<void> {
    const hashKey = `${prefix}:${group}:${key}`;
    await this.cacheManager.hset(hashKey, data);
    if (expiry) {
      await this.cacheManager.expire(hashKey, expiry);
    }
  }

  async hGet(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    field: string,
  ): Promise<string | null> {
    return this.cacheManager.hget(`${prefix}:${group}:${key}`, field);
  }

  async hGetAll(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
  ): Promise<Record<string, string>> {
    return this.cacheManager.hgetall(`${prefix}:${group}:${key}`);
  }

  async hDel(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    field: string,
  ): Promise<void> {
    await this.cacheManager.hdel(`${prefix}:${group}:${key}`, field);
  }

  // List operations
  async lPush(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    value: string,
    expiry?: number,
  ): Promise<void> {
    const listKey = `${prefix}:${group}:${key}`;
    await this.cacheManager.lpush(listKey, value);
    if (expiry) {
      await this.cacheManager.expire(listKey, expiry);
    }
  }

  async rPush(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    value: string,
    expiry?: number,
  ): Promise<void> {
    const listKey = `${prefix}:${group}:${key}`;
    await this.cacheManager.rpush(listKey, value);
    if (expiry) {
      await this.cacheManager.expire(listKey, expiry);
    }
  }

  async lPop(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
  ): Promise<string | null> {
    return this.cacheManager.lpop(`${prefix}:${group}:${key}`);
  }

  async rPop(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
  ): Promise<string | null> {
    return this.cacheManager.rpop(`${prefix}:${group}:${key}`);
  }

  async lRange(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string,
    start: number,
    stop: number,
  ): Promise<string[]> {
    return this.cacheManager.lrange(`${prefix}:${group}:${key}`, start, stop);
  }

  async getKeys(
    prefix: CachePrefix,
    group: CacheGroup,
    key: string = '*',
  ): Promise<string[]> {
    return this.cacheManager.keys(`${prefix}:${group}:${key}`);
  }
}
