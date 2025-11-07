import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/database/entities/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body(ValidationPipe) createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(user.id, createMessageDto);
  }

  @Get('conversations')
  async getConversations(@CurrentUser() user: User) {
    return this.messagesService.getConversations(user.id);
  }

  @Get('conversation/:userId')
  async getConversation(
    @CurrentUser() user: User,
    @Param('userId') otherUserId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.messagesService.getConversation(
      user.id,
      otherUserId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Post(':messageId/read')
  async markAsRead(@Param('messageId') messageId: string, @CurrentUser() user: User) {
    return this.messagesService.markAsRead(messageId, user.id);
  }

  @Post('conversation/:userId/read')
  async markConversationAsRead(
    @Param('userId') otherUserId: string,
    @CurrentUser() user: User,
  ) {
    await this.messagesService.markConversationAsRead(user.id, otherUserId);
    return { message: 'Conversation marked as read' };
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: User) {
    const count = await this.messagesService.getUnreadCount(user.id);
    return { count };
  }
}
