import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_images')
export class ListingImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  displayOrder: number;

  @ManyToOne(() => Listing, (listing) => listing.images, { onDelete: 'CASCADE' })
  listing: Listing;

  @Column()
  listingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
