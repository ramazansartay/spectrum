export type Category = {
  id: number;
  name: string;
};

export type User = {
  id: string;
  name?: string | null;
  email: string;
  passwordHash: string;
  createdAt?: Date | null;
};

export type Listing = {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  contactInfo?: string | null;
  images?: string[] | null;
  isNegotiable?: boolean | null;
  userId: string;
  categoryId: number;
  createdAt?: Date | null;
};

export type Chat = {
  id: number;
  listingId?: number | null;
  buyerId?: string | null;
  sellerId?: string | null;
  createdAt?: Date | null;
};

export type Message = {
  id: number;
  chatId: number;
  senderId: string;
  content: string;
  createdAt?: Date | null;
  isRead?: boolean | null;
};
