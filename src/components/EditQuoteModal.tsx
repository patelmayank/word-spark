import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeText } from '@/lib/sanitize';
import { toast } from '@/hooks/use-toast';
import { Quote, User, Save, X } from 'lucide-react';

interface Quote {
  id: string;
  quote_text: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface EditQuoteModalProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
  onQuoteUpdated: (updatedQuote: Quote) => void;
}

const EditQuoteModal: React.FC<EditQuoteModalProps> = ({ 
  quote, 
  isOpen, 
  onClose, 
  onQuoteUpdated 
}) => {
  const [quoteText, setQuoteText] = useState(quote.quote_text);
  const [authorName, setAuthorName] = useState(quote.author_name);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Reset form when quote changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setQuoteText(quote.quote_text);
      setAuthorName(quote.author_name);
    }
  }, [quote, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit quotes.",
        variant: "destructive",
      });
      return;
    }

    // Validate quote length on frontend
    const trimmedQuote = quoteText.trim();
    if (trimmedQuote.length < 10) {
      toast({
        title: "Quote too short",
        description: "Quote must be at least 10 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (trimmedQuote.length > 280) {
      toast({
        title: "Quote too long",
        description: "Quote must be no more than 280 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call the Edge Function to update the quote
      console.log('Calling update-quote function with data:', {
        quote_id: quote.id,
        quote_text: trimmedQuote,
        author_name: authorName.trim(),
      });

      const { data, error } = await supabase.functions.invoke('update-quote', {
        body: {
          quote_id: quote.id,
          quote_text: trimmedQuote,
          author_name: authorName.trim(),
        },
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: data?.message || "Quote updated successfully!",
        description: "Your changes have been saved.",
        variant: "default",
      });

      // Update the parent component with the new quote data
      if (data?.quote) {
        onQuoteUpdated(data.quote);
      }

      // Close the modal
      onClose();

    } catch (error: any) {
      console.error('Error updating quote:', error);
      
      let errorMessage = "Please try again later.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error updating quote",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setQuoteText(quote.quote_text);
    setAuthorName(quote.author_name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-card border-0 shadow-elegant">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground flex items-center">
            <Quote className="h-6 w-6 mr-2 text-primary" />
            Edit Quote
          </DialogTitle>
          <DialogDescription>
            Make changes to your quote. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-quote" className="text-sm font-medium">
              Quote Text *
            </Label>
            <div className="relative">
              <Quote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="edit-quote"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Enter the inspiring quote here..."
                className="pl-10 min-h-[120px] resize-none"
                required
                minLength={10}
                maxLength={280}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {quoteText.length}/280 characters • Minimum 10 characters required
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-author" className="text-sm font-medium">
              Author Name <span className="text-muted-foreground">(optional, defaults to "Unknown")</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-author"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Who said this quote?"
                className="pl-10"
                maxLength={100}
              />
            </div>
          </div>

          <div className="bg-accent/20 rounded-lg p-4 border border-accent/30">
            <h4 className="font-medium text-foreground mb-2">Preview:</h4>
            {quoteText ? (
              <blockquote className="text-foreground italic">
                <span dangerouslySetInnerHTML={{ __html: `"${sanitizeText(quoteText)}"` }} />
                <footer className="text-primary font-medium mt-2">
                  <span dangerouslySetInnerHTML={{ __html: `— ${sanitizeText(authorName || 'Unknown')}` }} />
                </footer>
              </blockquote>
            ) : (
              <p className="text-muted-foreground text-sm">
                Your quote preview will appear here...
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="inspirational"
              disabled={loading || !quoteText.trim() || quoteText.trim().length < 10}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuoteModal;