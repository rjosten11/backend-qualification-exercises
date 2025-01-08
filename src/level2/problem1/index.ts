export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  private cache: Map<string, Promise<TOutput>> = new Map();

  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}
  
  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const executionPromise = this.handler(...args);
    
    this.cache.set(key, executionPromise);

    try {
      const result = await executionPromise;
      return result;
    } catch (error) {
      this.cache.delete(key);
      throw error;
    }
  }
}