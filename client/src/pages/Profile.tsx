import { useUser, useUpdateUser } from "@/hooks/use-user";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Settings, LogOut, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

const profileSchema = insertUserSchema.pick({
  displayName: true,
  location: true,
  contact: true,
  team: true
});

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const updateUser = useUpdateUser();
  const { logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      location: "",
      contact: "",
      team: ""
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || "",
        location: user.location || "",
        contact: user.contact || "",
        team: user.team || ""
      });
    } else if (!isLoading) {
      // If not loading and no user, redirect
      window.location.href = "/api/login";
    }
  }, [user, isLoading, form]);

  const onUpdate = (data: z.infer<typeof profileSchema>) => {
    updateUser.mutate(data, {
      onSuccess: () => setIsEditOpen(false)
    });
  };

  if (isLoading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />

      <div className="container-custom mx-auto py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-32 bg-gradient-to-r from-primary to-cyan-400"></div>
              <CardContent className="pt-0 relative">
                <div className="absolute -top-16 left-6 border-4 border-white rounded-full">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.displayName || user.username}&background=random`} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="mt-20">
                  <h2 className="text-2xl font-bold text-gray-900">{user.displayName || user.username}</h2>
                  <p className="text-gray-500">@{user.username}</p>
                  
                  <div className="mt-6 space-y-3">
                    {user.team && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold w-16">Team:</span>
                        <span>{user.team}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold w-16">Location:</span>
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.contact && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold w-16">Contact:</span>
                        <span>{user.contact}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex-1" variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="displayName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Display Name</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="team"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>FTC Team Number/Name</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="contact"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone / Contact</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-primary" disabled={updateUser.isPending}>
                              {updateUser.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="destructive" className="flex-1" onClick={() => logout()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Tabs */}
          <div className="md:col-span-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>My Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="listings" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-6 h-auto">
                    <TabsTrigger value="listings" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent">
                      My Listings
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent">
                      Favorites
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="listings" className="min-h-[300px]">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Package className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No active listings</h3>
                      <p className="text-gray-500 mb-6">You haven't posted any ads yet.</p>
                      <Button onClick={() => window.location.href='/create'}>Create Listing</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="favorites" className="min-h-[300px]">
                    <p className="text-gray-500 text-center py-12">No favorite items yet.</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
