/**
 * 性能监控和缓存系统
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;

  // 测量函数执行时间
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.addMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, success: true },
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.addMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata: { 
          ...metadata, 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        },
      });
      
      throw error;
    }
  }

  // 添加性能指标
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // 保持指标数量在限制内
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
    
    // 输出慢操作警告
    if (metric.duration > 5000) {
      console.warn(`🐌 慢操作警告: ${metric.name} 耗时 ${metric.duration.toFixed(2)}ms`, metric.metadata);
    }
  }

  // 获取性能统计
  getStats(filter?: { name?: string; timeRange?: number }): {
    total: number;
    average: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
    recentMetrics: PerformanceMetric[];
  } {
    let filteredMetrics = this.metrics;

    // 按名称过滤
    if (filter?.name) {
      filteredMetrics = filteredMetrics.filter(m => m.name.includes(filter.name!));
    }

    // 按时间范围过滤
    if (filter?.timeRange) {
      const cutoff = Date.now() - filter.timeRange;
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= cutoff);
    }

    if (filteredMetrics.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        p95: 0,
        p99: 0,
        recentMetrics: [],
      };
    }

    const durations = filteredMetrics.map(m => m.duration).sort((a, b) => a - b);
    const total = durations.length;
    const sum = durations.reduce((acc, d) => acc + d, 0);

    return {
      total,
      average: sum / total,
      min: durations[0],
      max: durations[total - 1],
      p95: durations[Math.floor(total * 0.95)] || 0,
      p99: durations[Math.floor(total * 0.99)] || 0,
      recentMetrics: filteredMetrics.slice(-10),
    };
  }

  // 清理旧指标
  cleanup(olderThan: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - olderThan;
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoff);
  }
}

class MemoryCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize = 1000;

  // 设置缓存项
  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // 清理过期项
    this.cleanup();
    
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  // 获取缓存项
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    // 增加命中计数
    item.hits++;
    
    return item.data;
  }

  // 删除缓存项
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // 清空缓存
  clear(): void {
    this.cache.clear();
  }

  // 获取缓存统计
  getStats(): {
    size: number;
    totalHits: number;
    items: Array<{ key: string; hits: number; age: number; size: string }>;
  } {
    const now = Date.now();
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      hits: item.hits,
      age: now - item.timestamp,
      size: JSON.stringify(item.data).length + ' bytes',
    }));

    return {
      size: this.cache.size,
      totalHits: items.reduce((sum, item) => sum + item.hits, 0),
      items: items.sort((a, b) => b.hits - a.hits), // 按命中次数排序
    };
  }

  // 清理过期项
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // 获取最旧的缓存键
  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}

// 单例实例
export const performanceMonitor = new PerformanceMonitor();
export const memoryCache = new MemoryCache();

// 缓存装饰器
export function cached<T extends any[], R>(
  ttl: number = 5 * 60 * 1000,
  keyGenerator?: (...args: T) => string
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: T): Promise<R> {
      const key = keyGenerator 
        ? keyGenerator(...args)
        : `${propertyName}_${JSON.stringify(args)}`;

      // 尝试从缓存获取
      const cached = memoryCache.get(key);
      if (cached !== null) {
        console.log(`🎯 缓存命中: ${key}`);
        return cached;
      }

      // 执行原方法
      console.log(`🔄 缓存未命中，执行方法: ${key}`);
      const result = await method.apply(this, args);
      
      // 缓存结果
      memoryCache.set(key, result, ttl);
      
      return result;
    };
  };
}

// 性能监控装饰器
export function monitored(name?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const methodName = name || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]): Promise<any> {
      return await performanceMonitor.measure(
        methodName,
        () => method.apply(this, args),
        { args: args.length }
      );
    };
  };
}

// 批处理执行器
export class BatchProcessor<T, R> {
  private queue: Array<{
    item: T;
    resolve: (result: R) => void;
    reject: (error: Error) => void;
  }> = [];
  
  private processing = false;
  private batchSize: number;
  private delayMs: number;

  constructor(
    private processor: (items: T[]) => Promise<R[]>,
    batchSize: number = 10,
    delayMs: number = 100
  ) {
    this.batchSize = batchSize;
    this.delayMs = delayMs;
  }

  // 添加项目到批处理队列
  async add(item: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      
      if (!this.processing) {
        this.scheduleProcessing();
      }
    });
  }

  // 调度批处理
  private scheduleProcessing(): void {
    this.processing = true;
    
    setTimeout(async () => {
      await this.processBatch();
      this.processing = false;
      
      // 如果还有队列项，继续处理
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }, this.delayMs);
  }

  // 处理一批项目
  private async processBatch(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    const items = batch.map(b => b.item);

    try {
      const results = await this.processor(items);
      
      // 返回结果给相应的Promise
      batch.forEach((item, index) => {
        if (results[index] !== undefined) {
          item.resolve(results[index]);
        } else {
          item.reject(new Error(`批处理结果缺失，索引: ${index}`));
        }
      });
    } catch (error) {
      // 批处理失败，拒绝所有Promise
      batch.forEach(item => {
        item.reject(error instanceof Error ? error : new Error(String(error)));
      });
    }
  }
}

// 工具函数
export const utils = {
  // 延迟执行
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // 超时包装
  timeout: <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error(`操作超时: ${ms}ms`)), ms)
      ),
    ]);
  },
  
  // 格式化时间
  formatDuration: (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  },
  
  // 生成缓存键
  generateCacheKey: (...parts: any[]): string => {
    return parts.map(part => 
      typeof part === 'object' ? JSON.stringify(part) : String(part)
    ).join('|');
  },
}; 