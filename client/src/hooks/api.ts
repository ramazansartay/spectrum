import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api as apiSchemas } from '../../../shared/routes.ts';
import { api } from '../lib/api.ts';
import { Listing, Category, User, Chat, Message } from '../../../shared/schema.ts';

// Custom type for the creation hook, because `images` is a FileList, not string[]
export type CreateListingInput = {
    title: string;
    description: string;
    price: string;
    location: string;
    categoryId: number;
    images?: FileList;
};


// Auth & User
export const useMe = () => useQuery<User>({ queryKey: ['me'], queryFn: () => api.get(apiSchemas.users.me.path) });

// Listings
export const useListings = (filters: {}) => 
    useQuery<Listing[]>({ 
        queryKey: ['listings', filters], 
        queryFn: () => api.get(`${apiSchemas.listings.list.path}?${new URLSearchParams(filters as any)}`) 
    });

export const useListing = (id: number) => 
    useQuery<Listing>({ 
        queryKey: ['listing', id], 
        queryFn: () => api.get(apiSchemas.listings.get.path.replace(':id', String(id))) 
    });

export const useCreateListing = () => {
    const queryClient = useQueryClient();
    return useMutation<Listing, Error, CreateListingInput>({ 
        mutationFn: (newListing) => {
            const formData = new FormData();
            
            // Append all fields to the form data
            Object.entries(newListing).forEach(([key, value]) => {
                if (key === 'images') {
                    if (value) {
                        for (let i = 0; i < (value as FileList).length; i++) {
                            formData.append('images', (value as FileList)[i]);
                        }
                    }
                } else {
                    formData.append(key, String(value));
                }
            });

            return api.post(apiSchemas.listings.create.path, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
        }
    });
}

// Categories
export const useCategories = () => 
    useQuery<Category[]>({ 
        queryKey: ['categories'], 
        queryFn: () => api.get(apiSchemas.categories.list.path) 
    });

// Chats
export const useChats = () => 
    useQuery<Chat[]>({ 
        queryKey: ['chats'], 
        queryFn: () => api.get(apiSchemas.chats.list.path) 
    });

export const useChat = (id: number) => 
    useQuery<Chat>({ 
        queryKey: ['chat', id], 
        queryFn: () => api.get(apiSchemas.chats.get.path.replace(':id', String(id))) 
    });

export const useChatMessages = (chatId: number) => 
    useQuery<Message[]>({ 
        queryKey: ['messages', chatId], 
        queryFn: () => api.get(apiSchemas.chats.messages.path.replace(':id', String(chatId))),
        enabled: !!chatId,
    });

export const useSendMessage = (chatId: number) => {
    const queryClient = useQueryClient();
    return useMutation<Message, Error, { content: string }>({ 
        mutationFn: (newMessage) => api.post(apiSchemas.chats.sendMessage.path.replace(':id', String(chatId)), newMessage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        }
    });
}

export const useCreateChat = () => {
    const queryClient = useQueryClient();
    return useMutation<Chat, Error, { listingId: number }>({ 
        mutationFn: (data) => api.post(apiSchemas.chats.create.path, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        }
    });
}