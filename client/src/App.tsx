import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import CreateListing from "@/pages/CreateListing";
import Profile from "@/pages/Profile";
import Chat from "@/pages/Chat";
import ListingDetails from "@/pages/ListingDetails";
import LoginPage from "@/pages/Login"; // Import Login page
import RegisterPage from "@/pages/Register"; // Import Register page

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/create" component={CreateListing} />
      <Route path="/profile" component={Profile} />
      <Route path="/chat" component={Chat} />
      <Route path="/listing/:id" component={ListingDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
