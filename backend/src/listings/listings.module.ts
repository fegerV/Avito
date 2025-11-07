import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { Listing } from '@/database/entities/listing.entity';
import { ListingImage } from '@/database/entities/listing-image.entity';
import { Category } from '@/database/entities/category.entity';
import { CategoriesModule } from '@/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, ListingImage, Category]),
    CategoriesModule,
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
