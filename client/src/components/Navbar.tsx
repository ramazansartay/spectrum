import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, MessageSquare, User, LogOut } from "lucide-react";
import { isLoggedIn, logout } from "@/lib/auth-utils";
import { useMe } from "@/hooks/api";

export function Navbar() {
  const loggedIn = isLoggedIn();
  const { data: user } = useMe();

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b">
      <div className="container-custom mx-auto flex items-center justify-between h-16">
        <Link href="/">
          <a className="text-xl font-bold">FTC Marketplace</a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {loggedIn && user ? (
            <div className="flex items-center gap-4">
              <Link href="/create">
                  <Button variant="outline">Post Ad</Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              <span className="font-semibold">{user.name}</span>
              <Button onClick={logout} variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              {loggedIn && user ? (
                <>
                  <Link href="/profile"><a className="flex items-center gap-2"><User />{user.name}</a></Link>
                  <Link href="/chat"><a className="flex items-center gap-2"><MessageSquare />Messages</a></Link>
                  <button onClick={logout} className="flex items-center gap-2"><LogOut />Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login"><a>Login</a></Link>
                  <Link href="/register"><a>Sign Up</a></Link>
                </>
              )}
               <hr/>
               <Link href="/create"><Button>Post Ad</Button></Link>
            </nav>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}
