export interface Listing {
  id: string;
  title: string;
  description: string;
  price?: number;
  status: string;
  region: string;
  city: string;
  categoryId: string;
  userId: string;
  views: number;
  responses: number;
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
  user?: User;
  category?: Category;
  customFields?: Record<string, any>;
}

export interface ListingImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  displayOrder: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  children?: Category[];
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  bio?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}
