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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Upload, X } from "lucide-react";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';

const formSchema = insertListingSchema.extend({
  price: z.string().min(1, "Price is required"),
  images: z.array(z.instanceof(File)).min(1, 'At least one image is required').max(8, 'You can upload a maximum of 8 images'),
});

export default function PostAdd() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const createListing = useCreateListing();
  const [previewOpen, setPreviewOpen] = useState(false);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = [...form.getValues('images'), ...acceptedFiles].slice(0, 8);
    form.setValue('images', newImages);
  }, [form]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const newImages = [...form.getValues('images')];
    newImages.splice(index, 1);
    form.setValue('images', newImages);
  };

  useEffect(() => {
    if (!isUserLoading && !user) {
      setLocation("/login");
    }
  }, [user, isUserLoading, setLocation]);

  useEffect(() => {
    if (user) {
      if (user.location) form.setValue("location", user.location);
      if (user.contact) form.setValue("contactInfo", user.contact);
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Note: In a real app, you would upload files to a server here.
    // This is a mock implementation.
    const uploadedImageUrls = values.images.map(file => URL.createObjectURL(file));
    
    createListing.mutate({
      ...values,
      images: uploadedImageUrls,
    }, {
      onSuccess: (data) => setLocation(`/listing/${data.id}`),
    });
  }

  if (isUserLoading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  const watchedValues = form.watch();

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />
      <div className="container-custom mx-auto py-12 max-w-3xl">
        <Card className="border-none shadow-xl shadow-black/5">
          <CardHeader className="bg-primary/5 pb-8 pt-10 px-8 rounded-t-xl border-b">
            <CardTitle className="text-3xl font-bold text-gray-900">Post a New Ad</CardTitle>
            <CardDescription className="text-lg">Fill in the details to sell your items.</CardDescription>
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
                            <SelectTrigger className="h-12"><SelectValue placeholder="Select Category" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Motors">Motors</SelectItem>
                            <SelectItem value="Structure">Structure</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
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
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 150.00" type="text" className="h-12" {...field} />
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
                        <Textarea placeholder="Describe the item..." className="min-h-[120px] resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel>Photos (up to 8)</FormLabel>
                      <div {...getRootProps()} className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <input {...getInputProps()} />
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-primary">
                          <Upload className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Upload Photos</h4>
                        <p className="text-sm text-gray-500 mb-4">Click to browse or drag & drop</p>
                        <Button type="button" variant="outline" size="sm">Select Files</Button>
                      </div>
                      <FormMessage />
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {form.getValues('images').map((file, index) => (
                          <div key={index} className="relative aspect-square">
                            <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
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
                            <SelectItem value="New York">New York</SelectItem>
                            <SelectItem value="San Francisco">San Francisco</SelectItem>
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
                        <FormLabel>Contact Info</FormLabel>
                        <FormControl>
                          <Input placeholder="Your contact info" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-4 flex justify-end gap-4">
                  <Button type="button" variant="outline" className="h-12 px-6" onClick={() => setLocation("/")}>Cancel</Button>
                  <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="h-12 px-6">Preview</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{watchedValues.title || 'Your Listing Title'}</DialogTitle>
                        <DialogDescription>
                          This is a preview of how your listing will appear to others.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="col-span-1">
                           <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                                {watchedValues.images.length > 0 && (
                                    <img src={URL.createObjectURL(watchedValues.images[0])} alt="Preview" className="w-full h-full object-cover"/>
                                )}
                            </div>
                        </div>
                        <div className="col-span-1 space-y-4">
                            <h1 className="text-2xl font-bold">{watchedValues.title}</h1>
                            <p className="text-2xl font-bold text-primary">${watchedValues.price}</p>
                            <p className="text-sm text-gray-500">Category: {watchedValues.category}</p>
                            <p className="text-sm text-gray-500">Location: {watchedValues.location}</p>
                            <p className="text-base mt-4 whitespace-pre-wrap">{watchedValues.description}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
