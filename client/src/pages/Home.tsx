
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Zap, Move, Box, Disc, Radio, Link as LinkIcon, Wrench, Package, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/CategoryCard";
import { ListingCard } from "@/components/ListingCard";
import { useListings, useCategories } from "@/hooks/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@shared/types";
import { useTranslation } from "react-i18next";

const categoryStyleMap: { [key: string]: { icon: React.ElementType, color: string } } = {
  "hubsAndElectronics": { icon: Zap, color: "bg-amber-50 text-amber-600" },
  "motors": { icon: Cpu, color: "bg-red-50 text-red-600" },
  "servos": { icon: Move, color: "bg-blue-50 text-blue-600" },
  "structure": { icon: Box, color: "bg-slate-50 text-slate-600" },
  "wheels": { icon: Disc, color: "bg-emerald-50 text-emerald-600" },
  "sensors": { icon: Radio, color: "bg-purple-50 text-purple-600" },
  "wires": { icon: LinkIcon, color: "bg-pink-50 text-pink-600" },
  "tools": { icon: Wrench, color: "bg-orange-50 text-orange-600" },
  "kits": { icon: Package, color: "bg-teal-50 text-teal-600" },
};

export default function Home() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { data: listings, isLoading: listingsLoading } = useListings({});
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const getCategoryStyle = (categoryName: string) => {
    const key = categoryName.replace(/ & /g, "And").replace(/ /g, "").charAt(0).toLowerCase() + categoryName.slice(1).replace(/ & /g, "And").replace(/ /g, "");
    return categoryStyleMap[key] || { icon: Package, color: "bg-gray-100 text-gray-600" };
  };

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <Navbar />

      {/* Search Section */}
      <section className="bg-white text-gray-900 py-16 px-4 -mt-1 relative overflow-hidden border-b">
         {/* ... search form ... */}
      </section>

      {/* Categories Grid */}
      <section className="container-custom mx-auto py-12 -mt-8 relative z-20">
        {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories?.map((cat: Category) => (
                <CategoryCard 
                key={cat.id}
                icon={getCategoryStyle(cat.name).icon}
                label={t(cat.name.replace(/ & /g, "And").replace(/ /g, "").charAt(0).toLowerCase() + cat.name.slice(1).replace(/ & /g, "And").replace(/ /g, ""))}
                href={`/search?category=${encodeURIComponent(cat.name)}`}
                color={getCategoryStyle(cat.name).color}
                />
            ))}
            <CategoryCard 
                icon={Search} 
                label={t("allCategories")}
                href="/search" 
                color="bg-gray-100 text-gray-600" 
            />
            </div>
        )}
      </section>

      {/* Recent Listings */}
      <section className="container-custom mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-primary rounded-full"></span>
            {t("freshListings")}
          </h2>
        </div>

        {listingsLoading ? (
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
            <h3 className="text-lg font-semibold text-gray-900">{t("noListingsYet")}</h3>
            <p className="text-gray-500 mb-6">{t("beTheFirstToPost")}</p>
            <Link href="/create">
              <Button>{t("postAnAd")}</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
