import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get('PORT', 3001);
  }

  get corsOrigin(): string {
    return this.configService.get('CORS_ORIGIN', 'http://localhost:3000');
  }

  // Database
  get dbHost(): string {
    return this.configService.get('DB_HOST', 'localhost');
  }

  get dbPort(): number {
    return this.configService.get('DB_PORT', 5432);
  }

  get dbUser(): string {
    return this.configService.get('DB_USER', 'postgres');
  }

  get dbPassword(): string {
    return this.configService.get('DB_PASSWORD', 'postgres');
  }

  get dbName(): string {
    return this.configService.get('DB_NAME', 'avito_clone');
  }

  // JWT
  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', 'your-secret-key');
  }

  get jwtExpiration(): string {
    return this.configService.get('JWT_EXPIRATION', '24h');
  }

  // Redis
  get redisHost(): string {
    return this.configService.get('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return this.configService.get('REDIS_PORT', 6379);
  }

  get redisPassword(): string {
    return this.configService.get('REDIS_PASSWORD', '');
  }

  // Files
  get fileUploadPath(): string {
    return this.configService.get('FILE_UPLOAD_PATH', './uploads');
  }

  get maxFileSize(): number {
    return this.configService.get('MAX_FILE_SIZE', 10485760); // 10MB
  }

  // Telegram
  get telegramBotToken(): string {
    return this.configService.get('TELEGRAM_BOT_TOKEN', '');
  }

  get telegramApiUrl(): string {
    return this.configService.get('TELEGRAM_API_URL', 'https://api.telegram.org');
  }

  // Email
  get mailHost(): string {
    return this.configService.get('MAIL_HOST', '');
  }

  get mailPort(): number {
    return this.configService.get('MAIL_PORT', 587);
  }

  get mailUser(): string {
    return this.configService.get('MAIL_USER', '');
  }

  get mailPassword(): string {
    return this.configService.get('MAIL_PASSWORD', '');
  }

  get mailFrom(): string {
    return this.configService.get('MAIL_FROM', 'noreply@avito-clone.app');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
