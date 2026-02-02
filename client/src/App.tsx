import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import PostAdd from "@/pages/PostAdd";
import Profile from "@/pages/Profile";
import Chat from "@/pages/Chat";
import ListingDetails from "@/pages/ListingDetails";
import { LoginPage } from "@/pages/Login";
import { SignupPage } from "@/pages/Signup";
import { useAuth } from "@/hooks/use-auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} component={Component} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/listing/:id" component={ListingDetails} />
      
      <PrivateRoute path="/add" component={PostAdd} />
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/chat" component={Chat} />

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
