import { Link } from "wouter";
import { MapPin, Tag } from "lucide-react";
import type { Listing } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  // Parse images if stored as JSON string, otherwise use empty array
  const images = Array.isArray(listing.images) ? listing.images : [];
  // Use first image or fallback placeholder
  const mainImage = images[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"; // Generic tech background

  return (
    <Link href={`/listing/${listing.id}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          <img 
            src={mainImage} 
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary shadow-sm">
              {listing.category}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs font-medium truncate">View Details</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>
          
          <p className="text-xl font-bold text-primary mb-3">
            {listing.price} ₸
          </p>

          <div className="mt-auto space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
