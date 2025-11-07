import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User, UserRole } from '@/database/entities/user.entity';
import { Roles } from '@/common/decorators/roles.decorator';
import { ListingStatus } from '@/database/entities/listing.entity';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @CurrentUser() user: User,
    @Body(ValidationPipe) createListingDto: CreateListingDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const listing = await this.listingsService.create(user.id, createListingDto);

    if (files && files.length > 0) {
      listing.images = await this.listingsService.addImages(listing.id, files);
    }

    return listing;
  }

  @Get('search')
  async search(@Query(ValidationPipe) searchDto: SearchListingsDto) {
    return this.listingsService.search(searchDto);
  }

  @Get('my-listings')
  @UseGuards(JwtAuthGuard)
  async getMyListings(
    @CurrentUser() user: User,
    @Query('status') status?: ListingStatus,
  ) {
    return this.listingsService.findByUser(user.id, status);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async getPendingListings(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.listingsService.getPendingListings(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body(ValidationPipe) updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, user.id, updateListingDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ListingStatus; rejectionReason?: string },
  ) {
    return this.listingsService.updateStatus(id, body.status, body.rejectionReason);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.listingsService.delete(id, user.id);
    return { message: 'Listing deleted successfully' };
  }
}
