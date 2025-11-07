import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Listing } from './listing.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column()
  authorId: string;

  @ManyToOne(() => Listing, (listing) => listing.reviews, { onDelete: 'CASCADE' })
  listing: Listing;

  @Column()
  listingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
