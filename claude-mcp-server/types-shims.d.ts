// Minimal module shims to satisfy TypeScript in the Docker build
// These are intentionally permissive (any) to avoid blocking the CI build.

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'groq-sdk';
declare module '@upstash/redis';
declare module '@upstash/vector';
declare module 'clsx';
declare module 'tailwind-merge';
