import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Filter, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ListingCard } from "@/components/ListingCard";
import { useListings } from "@/hooks/use-listings";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    category: searchParams.get("category") || "all",
    city: "all",
    sort: "recent",
    priceRange: [0, 500000]
  });

  const { data: listings, isLoading } = useListings({
    search: filters.search,
    category: filters.category === "all" ? undefined : filters.category,
    city: filters.city === "all" ? undefined : filters.city,
    sort: filters.sort,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1]
  });

  // Update filters when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters(prev => ({
      ...prev,
      search: params.get("q") || prev.search,
      category: params.get("category") || prev.category
    }));
  }, [location]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
        <Select 
          value={filters.category} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, category: val }))}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
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
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">City</h3>
        <Select 
          value={filters.city} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, city: val }))}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="Almaty">Almaty</SelectItem>
            <SelectItem value="Astana">Astana</SelectItem>
            <SelectItem value="Shymkent">Shymkent</SelectItem>
            <SelectItem value="Karaganda">Karaganda</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
          <span className="text-xs text-gray-500">
            {filters.priceRange[0]} - {filters.priceRange[1]} ₸
          </span>
        </div>
        <Slider
          defaultValue={[0, 500000]}
          max={500000}
          step={1000}
          value={filters.priceRange}
          onValueChange={(val) => setFilters(prev => ({ ...prev, priceRange: val }))}
          className="my-4"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
        <Select 
          value={filters.sort} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, sort: val }))}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => setFilters({
          search: "",
          category: "all",
          city: "all",
          sort: "recent",
          priceRange: [0, 500000]
        })}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />

      <div className="container-custom mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Input 
              placeholder="Search listings..." 
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 h-12 text-lg bg-white shadow-sm border-gray-200"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Filter className="w-5 h-5" />
            </div>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden h-12 px-6">
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterPanel />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {isLoading ? "Loading..." : `${listings?.length || 0} Results Found`}
              </h2>
              {filters.category !== "all" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {filters.category}
                  <X 
                    className="w-4 h-4 cursor-pointer hover:text-primary/70" 
                    onClick={() => setFilters(prev => ({ ...prev, category: "all" }))}
                  />
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-xl" />
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-lg text-gray-500 mb-4">No listings match your search.</p>
                <Button variant="outline" onClick={() => setFilters(prev => ({ ...prev, category: "all", search: "" }))}>
                  Clear Search
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
