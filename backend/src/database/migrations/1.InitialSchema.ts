import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1699000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE,
        "passwordHash" VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(100),
        "lastName" VARCHAR(100),
        "profileImageUrl" TEXT,
        role VARCHAR(20) DEFAULT 'user',
        "isEmailVerified" BOOLEAN DEFAULT false,
        "isPhoneVerified" BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true,
        preferences JSONB,
        bio TEXT,
        "telegramId" VARCHAR(50),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
    await queryRunner.query(`CREATE INDEX idx_users_role ON users(role)`);

    // Categories table
    await queryRunner.query(`
      CREATE TABLE categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        "iconUrl" TEXT,
        "customFields" JSONB,
        "isActive" BOOLEAN DEFAULT true,
        "displayOrder" INTEGER DEFAULT 0,
        "parentId" UUID,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_categories_parent FOREIGN KEY ("parentId") REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_categories_slug ON categories(slug)`);
    await queryRunner.query(`CREATE INDEX idx_categories_parent ON categories("parentId")`);

    // Listings table
    await queryRunner.query(`
      CREATE TABLE listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        "userId" UUID NOT NULL,
        "categoryId" UUID NOT NULL,
        price NUMERIC(10, 2),
        "pricePerUnit" VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        "pricingModel" VARCHAR(20) DEFAULT 'free',
        region VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        latitude NUMERIC(10, 8),
        longitude NUMERIC(11, 8),
        "customData" JSONB,
        views INTEGER DEFAULT 0,
        responses INTEGER DEFAULT 0,
        "expiresAt" TIMESTAMP,
        "isActive" BOOLEAN DEFAULT true,
        "rejectionReason" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_listings_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_listings_category FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_listings_user ON listings("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_listings_category ON listings("categoryId")`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_listings_status ON listings(status)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_listings_category_status_date ON listings("categoryId", status, "createdAt")`,
    );
    await queryRunner.query(`CREATE INDEX idx_listings_region ON listings(region)`);

    // Listing images table
    await queryRunner.query(`
      CREATE TABLE listing_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        url TEXT NOT NULL,
        "thumbnailUrl" TEXT,
        "displayOrder" INTEGER DEFAULT 0,
        "listingId" UUID NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_listing_images_listing FOREIGN KEY ("listingId") REFERENCES listings(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_listing_images_listing ON listing_images("listingId")`,
    );

    // Messages table
    await queryRunner.query(`
      CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text TEXT NOT NULL,
        "senderId" UUID NOT NULL,
        "recipientId" UUID NOT NULL,
        "listingId" UUID,
        status VARCHAR(20) DEFAULT 'sent',
        "isRead" BOOLEAN DEFAULT false,
        "readAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_messages_sender FOREIGN KEY ("senderId") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_messages_recipient FOREIGN KEY ("recipientId") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_messages_listing FOREIGN KEY ("listingId") REFERENCES listings(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_messages_sender_recipient ON messages("senderId", "recipientId")`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_messages_listing ON messages("listingId")`,
    );

    // Reviews table
    await queryRunner.query(`
      CREATE TABLE reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        "authorId" UUID NOT NULL,
        "listingId" UUID NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_reviews_author FOREIGN KEY ("authorId") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_reviews_listing FOREIGN KEY ("listingId") REFERENCES listings(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_reviews_listing ON reviews("listingId")`);
    await queryRunner.query(`CREATE INDEX idx_reviews_author ON reviews("authorId")`);

    // Moderation reports table
    await queryRunner.query(`
      CREATE TABLE moderation_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reason VARCHAR(50) NOT NULL,
        description TEXT,
        "reporterId" UUID,
        "listingId" UUID,
        status VARCHAR(20) DEFAULT 'pending',
        "moderatorNotes" TEXT,
        "reviewedById" UUID,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_moderation_reports_reporter FOREIGN KEY ("reporterId") REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT fk_moderation_reports_listing FOREIGN KEY ("listingId") REFERENCES listings(id) ON DELETE CASCADE,
        CONSTRAINT fk_moderation_reports_reviewed_by FOREIGN KEY ("reviewedById") REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_moderation_reports_status ON moderation_reports(status)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_moderation_reports_listing ON moderation_reports("listingId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS moderation_reports`);
    await queryRunner.query(`DROP TABLE IF EXISTS reviews`);
    await queryRunner.query(`DROP TABLE IF EXISTS messages`);
    await queryRunner.query(`DROP TABLE IF EXISTS listing_images`);
    await queryRunner.query(`DROP TABLE IF EXISTS listings`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
