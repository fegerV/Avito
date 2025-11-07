import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from '@/database/entities/listing.entity';
import { ListingImage } from '@/database/entities/listing-image.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(ListingImage)
    private listingImagesRepository: Repository<ListingImage>,
  ) {}

  async create(userId: string, createListingDto: CreateListingDto): Promise<Listing> {
    const listing = this.listingsRepository.create({
      ...createListingDto,
      userId,
      status: ListingStatus.PENDING,
    });

    return this.listingsRepository.save(listing);
  }

  async addImages(listingId: string, images: Express.Multer.File[]): Promise<ListingImage[]> {
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const savedImages: ListingImage[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = this.listingImagesRepository.create({
        listingId,
        url: `/uploads/listings/${listingId}/${images[i].filename}`,
        thumbnailUrl: `/uploads/listings/${listingId}/thumb_${images[i].filename}`,
        displayOrder: i,
      });

      savedImages.push(await this.listingImagesRepository.save(image));
    }

    return savedImages;
  }

  async search(searchDto: SearchListingsDto) {
    const {
      query,
      categoryId,
      region,
      city,
      minPrice,
      maxPrice,
      status = ListingStatus.ACTIVE,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = searchDto;

    let queryBuilder = this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.images', 'images')
      .leftJoinAndSelect('listing.user', 'user');

    queryBuilder = queryBuilder.where('listing.status = :status', { status });

    if (query) {
      queryBuilder = queryBuilder.andWhere(
        '(listing.title ILIKE :query OR listing.description ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (categoryId) {
      queryBuilder = queryBuilder.andWhere('listing.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (region) {
      queryBuilder = queryBuilder.andWhere('listing.region = :region', { region });
    }

    if (city) {
      queryBuilder = queryBuilder.andWhere('listing.city = :city', { city });
    }

    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('listing.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('listing.price <= :maxPrice', { maxPrice });
    }

    queryBuilder = queryBuilder.orderBy(
      `listing.${sortBy}`,
      sortOrder as 'ASC' | 'DESC',
    );

    const skip = (page - 1) * limit;
    queryBuilder = queryBuilder.skip(skip).take(limit);

    const [listings, total] = await queryBuilder.getManyAndCount();

    return {
      listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['user', 'images', 'category'],
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Increment views
    await this.listingsRepository.update(id, { views: listing.views + 1 });

    return listing;
  }

  async findByUser(userId: string, status?: ListingStatus) {
    const query = this.listingsRepository.find({
      where: status ? { userId, status } : { userId },
      relations: ['images', 'category'],
      order: { createdAt: 'DESC' },
    });

    return query;
  }

  async update(id: string, userId: string, updateListingDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new BadRequestException('You can only update your own listings');
    }

    Object.assign(listing, updateListingDto);
    return this.listingsRepository.save(listing);
  }

  async updateStatus(id: string, status: ListingStatus, rejectionReason?: string) {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.status = status;
    if (rejectionReason) {
      listing.rejectionReason = rejectionReason;
    }

    return this.listingsRepository.save(listing);
  }

  async delete(id: string, userId: string): Promise<void> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new BadRequestException('You can only delete your own listings');
    }

    await this.listingsRepository.remove(listing);
  }

  async getPendingListings(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [listings, total] = await this.listingsRepository.findAndCount({
      where: { status: ListingStatus.PENDING },
      relations: ['user', 'images', 'category'],
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    return {
      listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
