import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Quote, PlusCircle, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SubmitQuotePage = () => {
  const [quoteText, setQuoteText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a quote.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .insert([
          {
            quote_text: quoteText.trim(),
            author_name: authorName.trim(),
            user_id: user.id,
          },
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Quote submitted successfully!",
        description: "Your inspiring quote has been shared with the community.",
        variant: "default",
      });

      // Reset form
      setQuoteText('');
      setAuthorName('');
      
      // Navigate to gallery
      navigate('/gallery');
    } catch (error: any) {
      toast({
        title: "Error submitting quote",
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
          <Quote className="h-4 w-4" />
          <AlertDescription>
            Please sign in to submit a quote to our community.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <PlusCircle className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Share a Quote
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Share an inspiring quote that moves you. Help others find motivation and positivity.
            </p>
          </div>

          {/* Form */}
          <Card className="bg-gradient-card border-0 shadow-elegant animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Submit Your Quote
              </CardTitle>
              <CardDescription>
                Fill in the quote and author information below. Make sure it's something that truly inspires you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quote" className="text-sm font-medium">
                    Quote Text *
                  </Label>
                  <div className="relative">
                    <Quote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="quote"
                      placeholder="Enter the inspiring quote here..."
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      className="pl-10 min-h-[120px] resize-none"
                      required
                      maxLength={500}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {quoteText.length}/500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium">
                    Author Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="author"
                      type="text"
                      placeholder="Who said this quote?"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="pl-10"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="bg-accent/20 rounded-lg p-4 border border-accent/30">
                  <h4 className="font-medium text-foreground mb-2">Preview:</h4>
                  {quoteText && authorName ? (
                    <blockquote className="text-foreground italic">
                      "{quoteText}"
                      <footer className="text-primary font-medium mt-2">
                        — {authorName}
                      </footer>
                    </blockquote>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Your quote preview will appear here...
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="inspirational"
                  className="w-full text-lg py-3"
                  disabled={loading || !quoteText.trim() || !authorName.trim()}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Share Quote</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="mt-6 bg-gradient-success/10 border-0">
            <CardContent className="p-4">
              <h4 className="font-medium text-foreground mb-2">💡 Tips for great quotes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Choose quotes that genuinely inspire or motivate you</li>
                <li>• Double-check the spelling and attribution</li>
                <li>• Keep it concise and impactful</li>
                <li>• Share quotes that spread positivity</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitQuotePage;