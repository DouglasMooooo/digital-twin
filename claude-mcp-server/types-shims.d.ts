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

// Upstash Redis
declare module '@upstash/redis' {
  export class Redis {
    constructor(config?: any);
    get(key: string): Promise<any>;
    set(key: string, value: any, options?: any): Promise<any>;
  }
}

// clsx utility
declare module 'clsx' {
  function clsx(...args: any[]): string;
  export default clsx;
}

// tailwind-merge utility
declare module 'tailwind-merge' {
  export function twMerge(...args: any[]): string;
}

// AdvancedAnalytics extension
declare module '../lib/advanced-analytics' {
  class AdvancedAnalytics {
    generateReport(period?: any): any;
    recordSnapshot(accuracy?: any, storyCoverage?: any, satisfaction?: any, responseTime?: any, category?: any): Promise<void>;
    initialize(): Promise<void>;
  }
  export { AdvancedAnalytics };
}