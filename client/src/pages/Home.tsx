import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Zap, Move, Box, Disc, Radio, Link as LinkIcon, Wrench, Package, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/CategoryCard";
import { ListingCard } from "@/components/ListingCard";
import { useListings } from "@/hooks/use-listings";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { data: listings, isLoading } = useListings();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { label: "Hubs & Electronics", icon: Zap, color: "bg-amber-50 text-amber-600" },
    { label: "Motors", icon: Cpu, color: "bg-red-50 text-red-600" },
    { label: "Servos", icon: Move, color: "bg-blue-50 text-blue-600" },
    { label: "Structure", icon: Box, color: "bg-slate-50 text-slate-600" },
    { label: "Wheels", icon: Disc, color: "bg-emerald-50 text-emerald-600" },
    { label: "Sensors", icon: Radio, color: "bg-purple-50 text-purple-600" },
    { label: "Wires", icon: LinkIcon, color: "bg-pink-50 text-pink-600" },
    { label: "Tools", icon: Wrench, color: "bg-orange-50 text-orange-600" },
    { label: "Kits", icon: Package, color: "bg-teal-50 text-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />

      {/* Search Section */}
      <section className="bg-white text-gray-900 py-16 px-4 -mt-1 relative overflow-hidden border-b">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
        </div>

        <div className="container-custom mx-auto text-center relative z-10">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex shadow-xl shadow-black/5 rounded-full overflow-hidden border border-gray-200">
              <div className="bg-white pl-6 pr-4 flex items-center justify-center">
                <Search className="text-gray-400 w-5 h-5" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for motors, servos, modules..." 
                className="h-14 border-0 rounded-none focus-visible:ring-0 text-gray-900 placeholder:text-gray-400 text-lg bg-white"
              />
              <Button type="submit" className="h-14 px-8 rounded-full rounded-l-none bg-primary hover:bg-primary/90 text-white font-bold text-lg">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container-custom mx-auto py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              href={`/search?category=${encodeURIComponent(cat.label)}`}
              color={cat.color}
            />
          ))}
          <CategoryCard 
            icon={Search} 
            label="All Categories" 
            href="/search" 
            color="bg-gray-100 text-gray-600" 
          />
        </div>
      </section>

      {/* Recent Listings */}
      <section className="container-custom mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-primary rounded-full"></span>
            Fresh Listings
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No listings yet</h3>
            <p className="text-gray-500 mb-6">Be the first to post something for sale!</p>
            <Link href="/create">
              <Button>Post an Ad</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
