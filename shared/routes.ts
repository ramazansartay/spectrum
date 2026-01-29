import { z } from "zod";

const a = <T extends z.ZodRawShape>(o: T) => o;

const schemas = a({
  listings: {
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
      }),
    },
    update: {
      path: "/api/listings/:id",
    },
    delete: {
      path: "/api/listings/:id",
    }
  },
  categories: {
    list: {
      path: "/api/categories",
    },
  },
  auth: {
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
  },
  users: {
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
  },
  chats: {
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
  }
});

export { schemas as api };
