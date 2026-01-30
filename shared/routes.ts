import { z } from "zod";

const listings = {
  list: {
    path: "/api/listings",
    input: z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      location: z.string().optional(),
      sort: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    }),
  },
  get: {
    path: "/api/listings/:id",
  },
  create: {
    path: "/api/listings",
    input: z.object({
      title: z.string(),
      description: z.string(),
      price: z.string(),
      location: z.string(),
      categoryId: z.number(),
      images: z.array(z.string()),
      isNegotiable: z.boolean().optional(),
    }),
  },
  update: {
    path: "/api/listings/:id",
  },
  delete: {
    path: "/api/listings/:id",
  }
};

const categories = {
  list: {
    path: "/api/categories",
  },
};

const auth = {
  register: {
    path: "/api/auth/register",
    input: z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    })
  },
  login: {
    path: "/api/auth/login",
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    })
  }
};

const users = {
  me: {
    path: "/api/users/me",
  },
  get: {
    path: "/api/users/:id",
  },
  update: {
    path: "/api/users/me",
    input: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
    })
  }
};

const chats = {
  list: {
    path: "/api/chats",
  },
  create: {
    path: "/api/chats",
    input: z.object({
      listingId: z.number(),
    }),
  },
  get: {
    path: "/api/chats/:id",
  },
  messages: {
    path: "/api/chats/:id/messages",
  },
  sendMessage: {
    path: "/api/chats/:id/messages",
    input: z.object({
      content: z.string(),
    })
  }
};

export const api = {
  listings,
  categories,
  auth,
  users,
  chats,
};
