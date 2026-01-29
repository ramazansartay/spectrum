import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, User } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const chats = [
    { id: 1, name: "RoboTeam 1523", lastMessage: "Is the motor still available?", time: "2m ago", unread: 1 },
    { id: 2, name: "TechBuilders", lastMessage: "Thanks for the quick delivery!", time: "1d ago", unread: 0 },
    { id: 3, name: "GearHeads", lastMessage: "Can you meet at the competition?", time: "2d ago", unread: 0 },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#f6f9fb]">
      <Navbar />
      
      <div className="flex-1 container-custom mx-auto py-6 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          
          {/* Chat List */}
          <Card className="h-full flex flex-col border-none shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search messages..." className="pl-9 bg-gray-50 border-none" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b last:border-0 ${selectedChat === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{chat.name}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="hidden md:flex md:col-span-2 h-full flex-col border-none shadow-lg overflow-hidden">
            {selectedChat ? (
              <>
                <div className="p-4 border-b flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      RB
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">RoboTeam 1523</h3>
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-4">
                  {/* Mock Messages */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
                      <p className="text-sm">Hi! I saw your listing for the GoBilda motor.</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border">
                      <p className="text-sm">Yes, it's still available! Are you interested?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
                      <p className="text-sm">Is the motor still available?</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border-t">
                  <form className="flex gap-2">
                    <Input placeholder="Type a message..." className="flex-1" />
                    <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
                <p className="text-gray-500 max-w-sm">Select a conversation from the left to start chatting with buyers and sellers.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
