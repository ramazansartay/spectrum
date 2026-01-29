import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListingSchema } from "@shared/schema";
import { useCreateListing } from "@/hooks/use-listings";
import { useUser } from "@/hooks/use-user";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";

// Extend schema to accept files for UI, but convert to string array for API
const formSchema = insertListingSchema.extend({
  price: z.string().min(1, "Price is required"),
  // Additional frontend-only validation if needed
});

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const createListing = useCreateListing();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      location: "",
      contactInfo: "",
      images: [],
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [user, isUserLoading]);

  // Pre-fill contact info if user exists
  useEffect(() => {
    if (user) {
      if (user.location) form.setValue("location", user.location);
      if (user.contact) form.setValue("contactInfo", user.contact);
    }
  }, [user, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createListing.mutate(values, {
      onSuccess: () => setLocation("/"),
    });
  }

  if (isUserLoading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />

      <div className="container-custom mx-auto py-12 max-w-3xl">
        <Card className="border-none shadow-xl shadow-black/5">
          <CardHeader className="bg-primary/5 pb-8 pt-10 px-8 rounded-t-xl border-b">
            <CardTitle className="text-3xl font-bold text-gray-900">Post a New Ad</CardTitle>
            <CardDescription className="text-lg">Fill in the details to sell your robotics parts.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. GoBilda Strafer Chassis Kit" className="h-12 text-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Hubs & Electronics">Hubs & Electronics</SelectItem>
                            <SelectItem value="Motors">Motors</SelectItem>
                            <SelectItem value="Servos">Servos</SelectItem>
                            <SelectItem value="Structure">Structure</SelectItem>
                            <SelectItem value="Wheels">Wheels</SelectItem>
                            <SelectItem value="Sensors">Sensors</SelectItem>
                            <SelectItem value="Wires">Wires</SelectItem>
                            <SelectItem value="Tools">Tools</SelectItem>
                            <SelectItem value="Kits">Kits</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₸)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 15000" type="text" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the condition, specs, and included items..." 
                          className="min-h-[120px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-primary">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Upload Photos</h4>
                  <p className="text-sm text-gray-500 mb-4">Click to browse or drag & drop</p>
                  <Button type="button" variant="outline" size="sm">Select Files</Button>
                  {/* Note: File upload implementation omitted for brevity, would handle onChange here */}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || user?.location || ""}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Almaty">Almaty</SelectItem>
                            <SelectItem value="Astana">Astana</SelectItem>
                            <SelectItem value="Shymkent">Shymkent</SelectItem>
                            <SelectItem value="Karaganda">Karaganda</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone / WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="+7 (777) 123 45 67" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <Button type="button" variant="outline" className="h-12 px-6" onClick={() => setLocation("/")}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                    disabled={createListing.isPending}
                  >
                    {createListing.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Listing"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
