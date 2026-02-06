import { Link, useLocation } from "wouter";
import { Menu, X, Plus, User, Search, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const getInitials = () => {
    if (user?.name) {
      return user.name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U"; // Default to 'U' for User
  };

  return (
    <nav className="bg-[#101827] text-white sticky top-0 z-50 shadow-md">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="font-bold text-xl tracking-tight">FTC Spectrum</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors text-sm font-medium">
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link href="/chat" className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors text-sm font-medium">
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
            
            <div className="h-6 w-px bg-gray-700 mx-2"></div>

            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary text-sm font-bold">
                    {getInitials()}
                  </div>
                </Link>
                <Button size="sm" variant="outline" onClick={() => logout()} className="text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="outline" className="text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="outline" className="text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <Link href="/add">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-1.5" />
                Post Ad
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#101827] border-t border-white/10"
          >
            <div className="container-custom py-4 space-y-2">
              <Link href="/search" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300">
                  <Search className="w-5 h-5" />
                  <span>Search Listings</span>
                </div>
              </Link>
              <Link href="/chat" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300">
                  <MessageSquare className="w-5 h-5" />
                  <span>Messages</span>
                </div>
              </Link>
              {isAuthenticated &&
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </div>
                </Link>
              }
              <div className="pt-2">
                <Link href="/add" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-white">Post an Ad</Button>
                </Link>
              </div>
              <div className="pt-2">
                {isAuthenticated ? (
                  <Button className="w-full" variant="outline" onClick={() => { logout(); setIsOpen(false); }}>Logout</Button>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" variant="outline">Log In</Button>
                    </Link>
                    <Link href="/signup" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" variant="outline">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
