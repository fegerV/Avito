import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from '@/database/entities/user.entity';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private botToken: string;
  private apiUrl: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN', '');
    this.apiUrl = this.configService.get<string>(
      'TELEGRAM_API_URL',
      'https://api.telegram.org',
    );
  }

  async sendMessage(chatId: number, text: string, keyboard?: any): Promise<void> {
    if (!this.botToken) {
      this.logger.warn('Telegram bot token not configured');
      return;
    }

    try {
      const payload: any = {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      };

      if (keyboard) {
        payload.reply_markup = keyboard;
      }

      await axios.post(`${this.apiUrl}/bot${this.botToken}/sendMessage`, payload);
    } catch (error) {
      this.logger.error(`Failed to send Telegram message: ${error}`);
    }
  }

  async notifyUserAboutNewListing(userId: string, listingTitle: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.telegramId) {
      return;
    }

    const message = `
✅ <b>Your listing is active!</b>

<b>${listingTitle}</b>

Check it out and manage your listings: https://avito-clone.app/my-listings
    `.trim();

    await this.sendMessage(parseInt(user.telegramId), message);
  }

  async notifyUserAboutNewMessage(userId: string, senderName: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.telegramId) {
      return;
    }

    const message = `
💬 <b>New Message</b>

You have a new message from <b>${senderName}</b>

Check your messages: https://avito-clone.app/messages
    `.trim();

    await this.sendMessage(parseInt(user.telegramId), message);
  }

  async linkTelegramAccount(userId: string, telegramId: string): Promise<void> {
    await this.userRepository.update({ id: userId }, { telegramId });
  }

  async handleWebhook(data: any): Promise<void> {
    try {
      if (data.message) {
        this.logger.log(`Received message from Telegram: ${data.message.text}`);
        // Handle incoming Telegram messages here
      }

      if (data.callback_query) {
        this.logger.log(`Received callback from Telegram: ${data.callback_query.data}`);
        // Handle button callbacks here
      }
    } catch (error) {
      this.logger.error(`Error handling Telegram webhook: ${error}`);
    }
  }
}
