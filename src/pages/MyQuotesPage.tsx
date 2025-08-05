import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import QuoteCard from '@/components/QuoteCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Quote } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Quote {
  id: string;
  quote_text: string;
  author_name: string;
  created_at: string;
  user_id: string;
}

const MyQuotesPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyQuotes();
    }
  }, [user]);

  const fetchMyQuotes = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading your quotes",
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
          <User className="h-4 w-4" />
          <AlertDescription>Please sign in to view your quotes.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              My Quotes
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Here are all the inspiring quotes you've shared with our community.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your quotes..." />
        ) : quotes.length === 0 ? (
          <div className="text-center py-16">
            <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No quotes yet</h3>
            <p className="text-muted-foreground">Start sharing inspiring quotes with the community!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quotes.map((quote, index) => (
              <div key={quote.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <QuoteCard quote={quote} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuotesPage;