import { useParams, Link, useLocation } from "wouter";
import { useListing, useCreateChat, useMe } from "@/hooks/api"; // Updated hook imports
import { isLoggedIn } from "@/lib/auth-utils";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, User, MessageSquare, ArrowLeft, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { timeAgo } from "@/lib/time-ago";

export default function ListingDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // API Hooks
  const { data: listing, isLoading, error } = useListing(Number(id));
  const { data: currentUser } = useMe();
  const { mutate: createChat, isPending: isCreatingChat } = useCreateChat();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Listing URL copied to clipboard" });
  };

  const handleStartChat = () => {
    if (!isLoggedIn()) {
      setLocation("/login");
      return;
    }
    if (!listing) return;

    createChat({ listingId: listing.id }, {
      onSuccess: (chat) => {
        setLocation(`/chat/${chat.id}`);
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  // Loading and Error states
  if (isLoading) { /* ... skeleton UI ... */ }
  if (error || !listing) { /* ... not found UI ... */ }

  const isOwnListing = currentUser?.id === listing.userId;
  const mainImage = listing.images?.[0] || "/placeholder.svg";

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
              <img src={mainImage} alt={listing.title} className="w-full aspect-video object-cover" />
              {/* ... share/heart buttons ... */}
            </div>

            {/* Details */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                  {listing.category?.name}
                </Badge>
                <Badge variant="outline" className="text-gray-500">
                  Posted {timeAgo(new Date(listing.createdAt))}
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
              <h2 className="text-4xl font-extrabold text-primary mb-1">{listing.price} ₸</h2>
              <p className="text-gray-500 text-sm mb-6">{listing.isNegotiable ? "Price is negotiable" : "Price is firm"}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Seller</p>
                    <p className="font-semibold">{listing.user?.name || "FTC Member"}</p>
                  </div>
                </div>
                {/* ... location ... */}
              </div>

              {!isOwnListing && (
                <Button onClick={handleStartChat} disabled={isCreatingChat} className="w-full h-12 text-lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {isCreatingChat ? "Starting Chat..." : "Chat with Seller"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
