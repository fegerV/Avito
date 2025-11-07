import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Listing } from './listing.entity';

export enum ReportStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RESOLVED = 'resolved',
}

export enum ReportReason {
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SPAM = 'spam',
  FRAUD = 'fraud',
  PROHIBITED_GOODS = 'prohibited_goods',
  CONTACT_INFO = 'contact_info',
  DUPLICATE = 'duplicate',
  OTHER = 'other',
}

@Entity('moderation_reports')
export class ModerationReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReportReason,
  })
  reason: ReportReason;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  reporter: User;

  @Column({ nullable: true })
  reporterId: string;

  @ManyToOne(() => Listing, { nullable: true, onDelete: 'CASCADE' })
  listing: Listing;

  @Column({ nullable: true })
  listingId: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ nullable: true })
  moderatorNotes: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  reviewedBy: User;

  @Column({ nullable: true })
  reviewedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
