import { init } from '@paralleldrive/cuid2';

export class IdGenerator {
  // Configurar longitud personalizada
  private static readonly createCustomId = init({
    length: 12,
    random: Math.random,
  });
  // Con prefijos
  static generateCompanyId(): string {
    return `COMP_${this.createCustomId().toUpperCase()}`;
  }

  static generateUserId(name: string): string {
    name = name.replace(/\s+/g, '').toUpperCase();
    return `${name}_${this.createCustomId().toUpperCase()}`;
  }
}
