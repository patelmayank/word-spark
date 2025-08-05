import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">About QuickQuotes</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              QuickQuotes is a community-powered platform to share and discover daily inspiration through quotes. Built with love to spread positivity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Home
              </Link>
              <Link 
                to="/submit" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Submit a Quote
              </Link>
              <Link 
                to="/my-quotes" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                My Quotes
              </Link>
            </nav>
          </div>

          {/* Connect With Us */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Connect With Us</h3>
            <div className="flex flex-col space-y-2">
              <a 
                href="#" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Facebook size={16} />
                Facebook
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Twitter size={16} />
                Twitter
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Instagram size={16} />
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-6 pt-4">
          <p className="text-center text-muted-foreground text-xs">
            © {currentYear} QuickQuotes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;