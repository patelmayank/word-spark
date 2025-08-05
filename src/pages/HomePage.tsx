import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Quote, Heart, Users, Sparkles } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Quote,
      title: "Share Inspiration",
      description: "Share your favorite quotes and inspire others in our community"
    },
    {
      icon: Heart,
      title: "Spread Positivity",
      description: "Discover uplifting quotes that brighten your day and others'"
    },
    {
      icon: Users,
      title: "Join the Community",
      description: "Connect with like-minded people who love inspirational content"
    },
    {
      icon: Sparkles,
      title: "Daily Motivation",
      description: "Get your daily dose of motivation from our curated collection"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
              QuickQuotes
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Share inspiration, spread positivity, and discover quotes that move your soul. 
              Join our community of dreamers and motivators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link to="/gallery">
                    <Button variant="hero" size="lg" className="text-lg px-8 py-3">
                      Explore Quotes
                    </Button>
                  </Link>
                  <Link to="/submit">
                    <Button variant="inspirational" size="lg" className="text-lg px-8 py-3">
                      Share a Quote
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="hero" size="lg" className="text-lg px-8 py-3">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-primary/20 animate-pulse">
          <Quote className="h-16 w-16" />
        </div>
        <div className="absolute bottom-10 right-10 text-primary/20 animate-pulse animation-delay-1000">
          <Sparkles className="h-12 w-12" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose QuickQuotes?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what makes our platform the perfect place for sharing and finding inspiration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-gradient-card border-0 hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 bg-gradient-hero/5">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Ready to Share Your Inspiration?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of people sharing quotes that matter. Start your journey today.
              </p>
              <Link to="/auth">
                <Button variant="hero" size="lg" className="text-lg px-10 py-4">
                  Join QuickQuotes Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;