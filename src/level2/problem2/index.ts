export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  const allLogs = args.flat();
  
  if (allLogs.length === 0) return [];
  
  const sortedLogs = allLogs.sort((a, b) => a[0].getTime() - b[0].getTime());
  
  const merged: DowntimeLogs = [];
  let current = sortedLogs[0];
  
  for (let i = 1; i < sortedLogs.length; i++) {
    const next = sortedLogs[i];
    
    if (current[1].getTime() >= next[0].getTime()) {
      current = [current[0], new Date(Math.max(current[1].getTime(), next[1].getTime()))];
    } else {
      merged.push(current);
      current = next;
    }
  }
  
  merged.push(current);
  
  return merged;
}