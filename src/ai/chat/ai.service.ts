import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface ServiceAccountPayload {
  company_id: string;
  service: 'ai_assistant';
  permissions: string[];
  type: 'service_account';
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'default_secret';

  constructor(private readonly jwtService: JwtService) {}

  async generateServiceAccountToken(companyId: string): Promise<string> {
    const payload: ServiceAccountPayload = {
      company_id: companyId,
      service: 'ai_assistant',
      permissions: [
        'chat:read',
        'chat:write',
        'chat:stream',
        'sales:read',
        'inventory:read',
        'analytics:read',
      ],
      type: 'service_account',
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_SECRET,
      expiresIn: '24h',
    });

    this.logger.log(`Service account token generated for company: ${companyId}`);
    return token;
  }

  async generateStreamingResponse(
    messages: { role: string; content: string }[],
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    const fullResponse: string[] = [];

    const simulatedStreaming = [
      'Entendido. Déjame analizar ',
      'tus datos de ventas... ',
      'Hoy has tenido 15 transacciones ',
      'por un total de $1,250.00. ',
      'El producto más vendido fue ',
      '"Café Premium" con 8 unidades.',
    ];

    for (const chunk of simulatedStreaming) {
      await this.delay(100);
      onChunk(chunk);
      fullResponse.push(chunk);
    }

    return fullResponse.join('');
  }

  async verifyServiceAccount(token: string): Promise<ServiceAccountPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<ServiceAccountPayload>(token, {
        secret: this.JWT_SECRET,
      });

      if (payload.type !== 'service_account') {
        return null;
      }

      if (payload.service !== 'ai_assistant') {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}