import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import QuoteCard from '@/components/QuoteCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Quote, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Quote {
  id: string;
  quote_text: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const GalleryPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setQuotes(data || []);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error loading quotes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view the quotes gallery.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Quote className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Quote Gallery
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover inspiring quotes shared by our amazing community. Let these words of wisdom 
            brighten your day and motivate your journey.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading inspiring quotes..." />
        ) : error ? (
          <div className="flex justify-center">
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-16">
            <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No quotes yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share an inspiring quote with the community!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quotes.map((quote, index) => (
              <div
                key={quote.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <QuoteCard quote={quote} />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {quotes.length > 0 && (
          <div className="text-center mt-12 p-6 bg-gradient-card rounded-lg border-0 shadow-card">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-primary">{quotes.length}</span> inspiring quotes
              from our community
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;