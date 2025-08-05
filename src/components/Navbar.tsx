import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Quote, Home, PlusCircle, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "Come back soon for more inspiration!",
      });
    }
  };

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/gallery", icon: Quote, label: "Gallery" },
    { to: "/submit", icon: PlusCircle, label: "Submit Quote" },
    { to: "/my-quotes", icon: User, label: "My Quotes" },
  ];

  return (
    <nav className="bg-gradient-card border-b border-border shadow-card sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <Quote className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              QuickQuotes
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden pb-4">
            <div className="flex space-x-1 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2 whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;