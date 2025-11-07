import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { ListingImage } from './listing-image.entity';
import { Review } from './review.entity';

export enum ListingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  SOLD = 'sold',
  ARCHIVED = 'archived',
  REJECTED = 'rejected',
}

export enum PricingModel {
  FREE = 'free',
  PREMIUM = 'premium',
  VIP = 'vip',
}

@Entity('listings')
@Index(['categoryId', 'status', 'createdAt'])
@Index(['userId', 'status'])
@Index(['region'])
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.listings, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Category, (category) => category.listings)
  category: Category;

  @Column()
  categoryId: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  pricePerUnit: string;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.PENDING,
  })
  status: ListingStatus;

  @Column({
    type: 'enum',
    enum: PricingModel,
    default: PricingModel.FREE,
  })
  pricingModel: PricingModel;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  customData: Record<string, any>;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  responses: number;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  rejectionReason: string;

  @OneToMany(() => ListingImage, (image) => image.listing, {
    cascade: true,
    eager: true,
  })
  images: ListingImage[];

  @OneToMany(() => Review, (review) => review.listing)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
