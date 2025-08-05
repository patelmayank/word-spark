import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EditQuoteModal from '@/components/EditQuoteModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeText } from '@/lib/sanitize';
import { toast } from '@/hooks/use-toast';
import { Quote, ArrowLeft, Calendar, User, Edit, Trash2, AlertCircle } from 'lucide-react';

interface QuoteDetail {
  id: string;
  quote_text: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const QuoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuote();
    } else {
      setError('Invalid quote ID');
      setLoading(false);
    }
  }, [id]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Quote not found');
        } else {
          throw error;
        }
        return;
      }

      setQuote(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load quote');
      toast({
        title: "Error loading quote",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!quote || !user || quote.user_id !== user.id) return;

    try {
      setDeleting(true);

      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quote.id)
        .eq('user_id', user.id); // Double check ownership

      if (error) throw error;

      toast({
        title: "Quote deleted successfully",
        description: "Your quote has been removed from the collection.",
      });

      navigate('/gallery');
    } catch (error: any) {
      toast({
        title: "Error deleting quote",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleQuoteUpdated = (updatedQuote: QuoteDetail) => {
    setQuote(updatedQuote);
    toast({
      title: "Quote updated",
      description: "Your quote has been successfully updated!",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view quote details.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/gallery')}
            className="hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <Card className="bg-gradient-card border-0 shadow-elegant animate-fade-in">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-center">
                {error}
              </AlertDescription>
            </Alert>
          ) : quote ? (
            <Card className="bg-gradient-card border-0 shadow-elegant animate-fade-in">
              <CardContent className="p-8">
                {/* Quote Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                      <Quote className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">Quote Details</h1>
                      <p className="text-sm text-muted-foreground">Inspirational wisdom shared</p>
                    </div>
                  </div>

                  {/* Owner Actions */}
                  {quote.user_id === user.id && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditModalOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Deleting...</span>
                          </div>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Quote Content */}
                <div className="space-y-8">
                  {/* Main Quote */}
                  <div className="text-center py-8 px-4 bg-gradient-hero/5 rounded-lg border border-primary/10">
                    <blockquote 
                      className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic"
                      dangerouslySetInnerHTML={{ __html: `"${sanitizeText(quote.quote_text)}"` }}
                    />
                    <footer className="mt-6">
                      <cite 
                        className="text-xl font-semibold text-primary not-italic"
                        dangerouslySetInnerHTML={{ __html: `— ${sanitizeText(quote.author_name)}` }}
                      />
                    </footer>
                  </div>

                  {/* Quote Metadata */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Submission Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Submission Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submitted:</span>
                          <span className="font-medium">{formatDate(quote.created_at)}</span>
                        </div>
                        {quote.updated_at !== quote.created_at && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last updated:</span>
                            <span className="font-medium">{formatDate(quote.updated_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Shared By
                      </h3>
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-sm">
                          {quote.user_id === user.id ? 'You' : 'Community Member'}
                        </Badge>
                        {quote.user_id === user.id && (
                          <p className="text-xs text-muted-foreground">
                            This is one of your contributed quotes
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                    <Link to="/gallery" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Gallery
                      </Button>
                    </Link>
                    <Link to="/submit" className="flex-1">
                      <Button variant="inspirational" className="w-full">
                        <Quote className="h-4 w-4 mr-2" />
                        Share Another Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Edit Quote Modal */}
        {quote && (
          <EditQuoteModal
            quote={quote}
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onQuoteUpdated={handleQuoteUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default QuoteDetailPage;