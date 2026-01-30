import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import NotFound from "./pages/not-found.tsx";
import Home from "./pages/Home.tsx";
import SearchPage from "./pages/Search.tsx";
import CreateListing from "./pages/CreateListing.tsx";
import Profile from "./pages/Profile.tsx";
import Chat from "./pages/Chat.tsx";
import ListingDetails from "./pages/ListingDetails.tsx";
import LoginPage from "./pages/Login.tsx"; // Import Login page
import RegisterPage from "./pages/Register.tsx"; // Import Register page

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
