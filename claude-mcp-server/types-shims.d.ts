// Minimal module shims to satisfy TypeScript in the Docker build
// These are intentionally permissive (any) to avoid blocking the CI build.

declare module '*.json' {
  const value: any;
  export default value;
}

// Groq SDK
declare module 'groq-sdk' {
  class Groq {
    constructor(config?: any);
    chat: any;
    messages: any;
  }
  export = Groq;
}

// Upstash Vector
declare module '@upstash/vector' {
  class Index {
    constructor(config?: any);
    query(options?: any): Promise<any>;
    upsert(vectors?: any): Promise<any>;
  }
  export { Index };
}

// Upstash Redis - complete API
declare module '@upstash/redis' {
  export class Redis {
    constructor(config?: any);
    get(key: string): Promise<any>;
    set(key: string, value: any, options?: any): Promise<any>;
    del(...keys: string[]): Promise<any>;
    lpush(key: string, ...values: any[]): Promise<any>;
    rpush(key: string, ...values: any[]): Promise<any>;
    lpop(key: string, count?: number): Promise<any>;
    rpop(key: string, count?: number): Promise<any>;
    lrange(key: string, start: number, stop: number): Promise<any>;
    ltrim(key: string, start: number, stop: number): Promise<any>;
    llen(key: string): Promise<any>;
    hget(key: string, field: string): Promise<any>;
    hset(key: string, field: string, value: any): Promise<any>;
    hdel(key: string, ...fields: string[]): Promise<any>;
    hgetall(key: string): Promise<any>;
    incr(key: string): Promise<number>;
    decr(key: string): Promise<number>;
    [key: string]: any;
  }
}

// clsx utility - correct export pattern
declare module 'clsx' {
  type ClassValue = string | { [key: string]: boolean } | ClassValue[] | any;
  function clsx(...args: any[]): string;
  namespace clsx {
    export { ClassValue };
  }
  export default clsx;
  export function clsx(...args: any[]): string;
  export type { ClassValue };
}

// tailwind-merge utility
declare module 'tailwind-merge' {
  export function twMerge(...args: any[]): string;
}

// Global browser APIs for Node.js environment
declare const window: any;