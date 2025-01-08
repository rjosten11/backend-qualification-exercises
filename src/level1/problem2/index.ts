export class ObjectId {
  private static random: Uint8Array = crypto.getRandomValues(new Uint8Array(4));
  private static counter: number = Math.floor(Math.random() * 0xFFFFFF);
  private data: Buffer;

  constructor(type: number, timestamp: number) {
    this.data = Buffer.alloc(14);

    this.data[0] = type;

    for (let i = 0; i < 6; i++) {
      this.data[1 + i] = (timestamp >> ((5 - i) * 8)) & 0xFF;
    }

    for (let i = 0; i < 4; i++) {
      this.data[7 + i] = ObjectId.random[i];
    }

    ObjectId.counter = (ObjectId.counter + 1) % 0xFFFFFF;
    for (let i = 0; i < 3; i++) {
      this.data[11 + i] = (ObjectId.counter >> ((2 - i) * 8)) & 0xFF;
    }
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }
  
  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}