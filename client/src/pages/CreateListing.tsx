import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertListingSchema, Category } from '@shared/schema';
import { useCreateListing, useMe, useCategories } from '@/hooks/api';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { z } from 'zod';

const formSchema = insertListingSchema.omit({ userId: true, createdAt: true, id: true, category: true }).extend({
  price: z.coerce.number().positive(),
  categoryId: z.coerce.number(),
});

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading: isUserLoading, isError } = useMe();
  const { data: categories, isLoading: areCategoriesLoading } = useCategories();
  const { mutate: createListing, isPending } = useCreateListing();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && isError) {
      setLocation('/login');
    }
    if (user) {
      if (user.location) form.setValue('location', user.location);
    }
  }, [user, isUserLoading, isError, setLocation, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createListing(values, {
      onSuccess: (newListing) => {
        toast({ title: 'Success!', description: 'Your listing has been published.' });
        setLocation(`/listing/${newListing.id}`);
      },
      onError: (error) => {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      },
    });
  }

  if (isUserLoading || areCategoriesLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />
      <div className="container-custom mx-auto py-12 max-w-3xl">
        <Card className="border-none shadow-xl shadow-black/5">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Post a New Ad</CardTitle>
            <CardDescription>Fill in the details to sell your robotics parts.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField name="title" control={form.control} render={({ field }) => <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder='e.g. GoBilda Strafer Chassis Kit' {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name="categoryId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl><SelectTrigger><SelectValue placeholder='Select Category' /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories?.map((cat: Category) => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField name="price" control={form.control} render={({ field }) => <FormItem><FormLabel>Price (₸)</FormLabel><FormControl><Input type='number' {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name="description" control={form.control} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder='Describe the condition, specs, etc.' {...field} /></FormControl><FormMessage /></FormItem>} />
                 <FormField name="location" control={form.control} render={({ field }) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder='e.g. Almaty' {...field} /></FormControl><FormMessage /></FormItem>} />
                <div className="flex justify-end gap-4">
                  <Button type='button' variant='outline' onClick={() => setLocation('/')}>Cancel</Button>
                  <Button type='submit' disabled={isPending}>{isPending ? 'Publishing...' : 'Publish Listing'}</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
