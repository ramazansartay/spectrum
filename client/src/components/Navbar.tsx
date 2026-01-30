import { Link } from "wouter";
import { Button } from "../components/ui/button.tsx";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet.tsx";
import { Menu, MessageSquare, User, LogOut } from "lucide-react";
import { isLoggedIn, logout } from "../lib/auth-utils.ts";
import { useMe } from "../hooks/api.ts";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const { t } = useTranslation();
  const loggedIn = isLoggedIn();
  const { data: user } = useMe();

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b">
      <div className="container-custom mx-auto flex items-center justify-between h-16">
        <Link href="/">
          <a className="text-xl font-bold">{t('ftcMarketplace')}</a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {loggedIn && user ? (
            <div className="flex items-center gap-4">
              <Link href="/create">
                  <Button variant="outline">{t('postAd')}</Button>
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
                <Button variant="ghost">{t('login')}</Button>
              </Link>
              <Link href="/register">
                <Button>{t('signUp')}</Button>
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
                  <Link href="/chat"><a className="flex items-center gap-2"><MessageSquare />{t('messages')}</a></Link>
                  <button onClick={logout} className="flex items-center gap-2"><LogOut />{t('logout')}</button>
                </>
              ) : (
                <>
                  <Link href="/login"><a>{t('login')}</a></Link>
                  <Link href="/register"><a>{t('signUp')}</a></Link>
                </>
              )}
               <hr/>
               <Link href="/create"><Button>{t('postAd')}</Button></Link>
            </nav>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}
