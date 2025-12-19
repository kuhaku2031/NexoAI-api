import * as bcrypt from 'bcrypt';

export class HashUtil {
  private readonly saltRounds = 10;

  async hashing(data: string): Promise<string> {
    return await bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    return await bcrypt.compare(data, hashedData);
  }
}
