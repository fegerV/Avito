import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageStatus } from '@/database/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(senderId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    if (senderId === createMessageDto.recipientId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    const message = this.messagesRepository.create({
      ...createMessageDto,
      senderId,
    });

    return this.messagesRepository.save(message);
  }

  async getConversation(userId: string, otherUserId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [messages, total] = await this.messagesRepository.findAndCount({
      where: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      messages: messages.reverse(),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getConversations(userId: string) {
    const conversations = await this.messagesRepository.query(`
      SELECT DISTINCT
        CASE WHEN "senderId" = $1 THEN "recipientId" ELSE "senderId" END as "userId",
        MAX("createdAt") as "lastMessageAt",
        (SELECT COUNT(*) FROM messages m2 WHERE 
          (m2."senderId" = $1 AND m2."recipientId" = CASE WHEN m."senderId" = $1 THEN m."recipientId" ELSE m."senderId" END AND m2."isRead" = false)
        ) as "unreadCount"
      FROM messages m
      WHERE "senderId" = $1 OR "recipientId" = $1
      GROUP BY CASE WHEN "senderId" = $1 THEN "recipientId" ELSE "senderId" END
      ORDER BY "lastMessageAt" DESC
    `, [userId]);

    return conversations;
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({ where: { id: messageId } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.recipientId !== userId) {
      throw new BadRequestException('You can only mark your own messages as read');
    }

    message.isRead = true;
    message.readAt = new Date();
    message.status = MessageStatus.READ;

    return this.messagesRepository.save(message);
  }

  async markConversationAsRead(userId: string, otherUserId: string) {
    await this.messagesRepository.update(
      {
        senderId: otherUserId,
        recipientId: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
        status: MessageStatus.READ,
      },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messagesRepository.count({
      where: { recipientId: userId, isRead: false },
    });
  }
}
