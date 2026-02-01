import { useParams, Link } from "wouter";
import { useListing } from "@/hooks/use-listings";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, User, MessageSquare, Phone, ArrowLeft, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ListingDetails() {
  const { id } = useParams();
  const { data: listing, isLoading, error } = useListing(Number(id));
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Listing URL copied to clipboard" });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />
      <div className="container-custom py-8">
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !listing) return (
    <div className="min-h-screen bg-[#f6f9fb] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );

  const images = Array.isArray(listing.images) ? listing.images : [];
  const mainImage = images[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />
      
      <div className="container-custom mx-auto py-8">
        <Link href="/search" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
              <img 
                src={mainImage} 
                alt={listing.title} 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-red-500">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                  {listing.category}
                </Badge>
                <Badge variant="outline" className="text-gray-500">
                  Posted recently
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="prose max-w-none text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="whitespace-pre-line">{listing.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-primary/10 sticky top-24">
              <h2 className="text-4xl font-extrabold text-primary mb-1">
                {listing.price} ₸
              </h2>
              <p className="text-gray-500 text-sm mb-6">Price is negotiable</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Seller</p>
                    <p className="font-semibold">FTC Member</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{listing.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with Seller
                </Button>
                {listing.contactInfo && (
                  <Button variant="outline" className="w-full h-12 text-lg border-primary text-primary hover:bg-primary/5">
                    <Phone className="w-5 h-5 mr-2" />
                    Show Number
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
