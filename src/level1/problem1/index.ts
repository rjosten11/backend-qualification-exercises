export type Value = string | number | boolean | null | undefined |
  Date | Buffer | Map<unknown, unknown> | Set<unknown> |
  Array<Value> | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */

export function serialize(value: Value): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return {
      __t: 'Date',
      __v: value.getTime()
    };
  }

  if (value instanceof Buffer) {
    return {
      __t: 'Buffer',
      __v: Array.from(value)
    };
  }

  if (value instanceof Set) {
    return {
      __t: 'Set',
      __v: Array.from(value).map(item => serialize(item as Value))
    };
  }

  if (value instanceof Map) {
    return {
      __t: 'Map',
      __v: Array.from(value.entries()).map(([k, v]) => [
        serialize(k as Value),
        serialize(v as Value)
      ])
    };
  }

  if (Array.isArray(value)) {
    return value.map(item => serialize(item));
  }

  const result: { [key: string]: unknown } = {};
  for (const [key, val] of Object.entries(value)) {
    result[key] = serialize(val);
  }
  return result;
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  if (value === null || value === undefined) {
    return value as T;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value as T;
  }

  if (Array.isArray(value)) {
    return value.map(item => deserialize(item)) as unknown as T;
  }

  if (typeof value === 'object') {
    const obj = value as { __t?: string; __v?: unknown };
    
    if (obj.__t && obj.__v !== undefined) {
      switch (obj.__t) {
        case 'Date':
          return new Date(obj.__v as number) as unknown as T;
        
        case 'Buffer':
          return Buffer.from(obj.__v as number[]) as unknown as T;
        
        case 'Set':
          return new Set(
            (obj.__v as unknown[]).map(item => deserialize(item))
          ) as unknown as T;
        
        case 'Map':
          return new Map(
            (obj.__v as [unknown, unknown][]).map(([k, v]) => [
              deserialize(k),
              deserialize(v)
            ])
          ) as unknown as T;
      }
    }

    const result: { [key: string]: unknown } = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deserialize(val);
    }
    return result as T;
  }
  return value as T;
}