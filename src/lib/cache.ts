/**
 * Redis caching layer for performance optimization
 * Handles caching of repository data, search results, and skill normalizations
 */

import { Redis } from '@upstash/redis';

interface CacheConfig {
  defaultTTL: number;
  repositoryTTL: number;
  searchTTL: number;
  skillTTL: number;
  trendingTTL: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
}

class CacheManager {
  private redis: Redis;
  private config: CacheConfig;
  private stats: CacheStats;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    this.config = {
      defaultTTL: 3600,      // 1 hour
      repositoryTTL: 7200,   // 2 hours
      searchTTL: 1800,       // 30 minutes
      skillTTL: 86400,       // 24 hours
      trendingTTL: 3600,     // 1 hour
    };

    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
  }

  /**
   * Generate cache key for repository data
   */
  private getRepositoryKey(owner: string, repo: string): string {
    return `repo:${owner.toLowerCase()}:${repo.toLowerCase()}`;
  }

  /**
   * Generate cache key for search results
   */
  private getSearchKey(skills: string[], options: any): string {
    const skillsHash = skills.sort().join(',');
    const optionsHash = JSON.stringify(options);
    return `search:${Buffer.from(skillsHash + optionsHash).toString('base64')}`;
  }

  /**
   * Generate cache key for skill normalization
   */
  private getSkillKey(skills: string[]): string {
    const skillsHash = skills.sort().join(',');
    return `skills:${Buffer.from(skillsHash).toString('base64')}`;
  }

  /**
   * Generate cache key for trending repositories
   */
  private getTrendingKey(language: string, since: string): string {
    return `trending:${language}:${since}`;
  }

  /**
   * Get cached repository data
   */
  async getRepository(owner: string, repo: string): Promise<any | null> {
    try {
      const key = this.getRepositoryKey(owner, repo);
      const data = await this.redis.get(key);
      
      if (data) {
        this.stats.hits++;
        return data;
      }
      
      this.stats.misses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Cache repository data
   */
  async setRepository(owner: string, repo: string, data: any): Promise<void> {
    try {
      const key = this.getRepositoryKey(owner, repo);
      await this.redis.setex(key, this.config.repositoryTTL, JSON.stringify(data));
      this.stats.sets++;
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Get cached search results
   */
  async getSearchResults(skills: string[], options: any): Promise<any | null> {
    try {
      const key = this.getSearchKey(skills, options);
      const data = await this.redis.get(key);
      
      if (data) {
        this.stats.hits++;
        return JSON.parse(data as string);
      }
      
      this.stats.misses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Cache search results
   */
  async setSearchResults(skills: string[], options: any, data: any): Promise<void> {
    try {
      const key = this.getSearchKey(skills, options);
      await this.redis.setex(key, this.config.searchTTL, JSON.stringify(data));
      this.stats.sets++;
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Get cached skill normalization
   */
  async getSkillNormalization(skills: string[]): Promise<any | null> {
    try {
      const key = this.getSkillKey(skills);
      const data = await this.redis.get(key);
      
      if (data) {
        this.stats.hits++;
        return JSON.parse(data as string);
      }
      
      this.stats.misses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Cache skill normalization
   */
  async setSkillNormalization(skills: string[], data: any): Promise<void> {
    try {
      const key = this.getSkillKey(skills);
      await this.redis.setex(key, this.config.skillTTL, JSON.stringify(data));
      this.stats.sets++;
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Get cached trending repositories
   */
  async getTrendingRepositories(language: string, since: string): Promise<any | null> {
    try {
      const key = this.getTrendingKey(language, since);
      const data = await this.redis.get(key);
      
      if (data) {
        this.stats.hits++;
        return JSON.parse(data as string);
      }
      
      this.stats.misses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Cache trending repositories
   */
  async setTrendingRepositories(language: string, since: string, data: any): Promise<void> {
    try {
      const key = this.getTrendingKey(language, since);
      await this.redis.setex(key, this.config.trendingTTL, JSON.stringify(data));
      this.stats.sets++;
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Invalidate repository cache
   */
  async invalidateRepository(owner: string, repo: string): Promise<void> {
    try {
      const key = this.getRepositoryKey(owner, repo);
      await this.redis.del(key);
      this.stats.deletes++;
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Invalidate search cache for specific skills
   */
  async invalidateSearchCache(skills: string[]): Promise<void> {
    try {
      // Get all search keys and delete matching ones
      const pattern = `search:*`;
      const keys = await this.redis.keys(pattern);
      
      for (const key of keys) {
        const keyData = await this.redis.get(key);
        if (keyData) {
          const searchData = JSON.parse(keyData as string);
          if (searchData.skills && this.arraysEqual(searchData.skills.sort(), skills.sort())) {
            await this.redis.del(key);
            this.stats.deletes++;
          }
        }
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    try {
      await this.redis.flushall();
      this.stats.deletes++;
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Get cache health status
   */
  async getHealth(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number }> {
    const start = Date.now();
    
    try {
      await this.redis.ping();
      const latency = Date.now() - start;
      
      return {
        status: 'healthy',
        latency
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start
      };
    }
  }

  /**
   * Get cache memory usage
   */
  async getMemoryUsage(): Promise<{ used: number; peak: number }> {
    try {
      const info = await this.redis.info('memory');
      const lines = info.split('\r\n');
      
      let used = 0;
      let peak = 0;
      
      for (const line of lines) {
        if (line.startsWith('used_memory:')) {
          used = parseInt(line.split(':')[1]);
        } else if (line.startsWith('used_memory_peak:')) {
          peak = parseInt(line.split(':')[1]);
        }
      }
      
      return { used, peak };
    } catch (error) {
      console.error('Memory usage error:', error);
      return { used: 0, peak: 0 };
    }
  }

  /**
   * Warm up cache with popular searches
   */
  async warmupCache(): Promise<void> {
    const popularSearches = [
      ['javascript', 'react'],
      ['python', 'machine learning'],
      ['typescript', 'nodejs'],
      ['java', 'spring'],
      ['go', 'microservices']
    ];

    console.log('Warming up cache with popular searches...');
    
    for (const search of popularSearches) {
      try {
        // This would typically trigger a search to populate cache
        // For now, we'll just log the warmup
        console.log(`Warming up: ${search.join(', ')}`);
      } catch (error) {
        console.error(`Warmup error for ${search.join(', ')}:`, error);
      }
    }
  }

  /**
   * Helper function to compare arrays
   */
  private arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  /**
   * Set custom TTL for a specific cache type
   */
  setTTL(type: keyof CacheConfig, ttl: number): void {
    this.config[type] = ttl;
  }

  /**
   * Get current TTL configuration
   */
  getTTLConfig(): CacheConfig {
    return { ...this.config };
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

export default cacheManager;
export type { CacheConfig, CacheStats };
