import { useState } from 'react';
import { useChats, useChatMessages, useSendMessage, useMe } from '../hooks/api.ts';
import { Navbar } from '../components/Navbar.tsx';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar.tsx';
import { Loader2, Send } from 'lucide-react';
import { timeAgo } from '../lib/time-ago.ts';
import { cn } from '../lib/utils.ts';

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const { data: chats, isLoading: chatsLoading } = useChats();
  const { data: messages, isLoading: messagesLoading } = useChatMessages(activeChatId!, { refetchInterval: 2000 });
  const { mutate: sendMessage } = useSendMessage(activeChatId!);
  const { data: currentUser } = useMe();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;
    sendMessage({ content: newMessage });
    setNewMessage('');
  };

  const activeChat = chats?.find(c => c.id === activeChatId);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 border-t overflow-hidden">
        {/* Chat List */}
        <aside className="border-r bg-white overflow-y-auto">
          {chatsLoading ? (
            <div className="p-4"><Loader2 className="animate-spin mx-auto"/></div>
          ) : (
            chats?.map(chat => (
              <div key={chat.id} onClick={() => setActiveChatId(chat.id)} className={cn('p-4 border-b cursor-pointer hover:bg-gray-100', { 'bg-gray-100': activeChatId === chat.id })}>
                <p className="font-semibold">{chat.listing.title}</p>
                <p className="text-sm text-gray-500">{chat.participants.find(p => p.id !== currentUser?.id)?.name}</p>
              </div>
            ))
          )}
        </aside>

        {/* Message View */}
        <main className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b bg-white flex items-center gap-4">
                  <Avatar>
                      <AvatarImage src={activeChat.listing.images?.[0]} />
                      <AvatarFallback>{activeChat.listing.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                      <p className="font-bold">{activeChat.listing.title}</p>
                      <p className="text-sm text-gray-500">Chat with {activeChat.participants.find(p => p.id !== currentUser?.id)?.name}</p>
                  </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messagesLoading ? (
                  <Loader2 className="animate-spin mx-auto"/>
                ) : (
                  messages?.map(msg => (
                    <div key={msg.id} className={cn('flex', { 'justify-end': msg.senderId === currentUser?.id })}>
                      <div className={cn('p-3 rounded-lg max-w-lg', { 'bg-primary text-white': msg.senderId === currentUser?.id, 'bg-white border': msg.senderId !== currentUser?.id })}>
                        <p>{msg.content}</p>
                        <p className={cn('text-xs mt-1', { 'text-gray-200': msg.senderId === currentUser?.id, 'text-gray-500': msg.senderId !== currentUser?.id })}>{timeAgo(new Date(msg.createdAt))}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1" />
                  <Button type="submit"><Send className="w-4 h-4" /></Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
