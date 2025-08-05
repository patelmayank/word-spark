import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EditQuoteModal from '@/components/EditQuoteModal';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeText } from '@/lib/sanitize';
import { Quote as QuoteIcon, Edit } from 'lucide-react';

interface Quote {
  id: string;
  quote_text: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface QuoteCardProps {
  quote: Quote;
  showAuthor?: boolean;
  showEditButton?: boolean;
  onQuoteUpdated?: (updatedQuote: Quote) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  showAuthor = true, 
  showEditButton = false,
  onQuoteUpdated 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCardClick = () => {
    navigate(`/quote/${quote.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation
    setEditModalOpen(true);
  };

  const handleQuoteUpdated = (updatedQuote: Quote) => {
    if (onQuoteUpdated) {
      onQuoteUpdated(updatedQuote);
    }
  };

  const isOwner = user && quote.user_id === user.id;

  return (
    <>
      <Card 
        className="bg-gradient-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] animate-fade-in border-0 cursor-pointer group"
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                <QuoteIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <blockquote 
                className="text-lg font-medium text-foreground leading-relaxed mb-4 italic"
                dangerouslySetInnerHTML={{ __html: `"${sanitizeText(quote.quote_text)}"` }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-sm font-semibold text-primary"
                    dangerouslySetInnerHTML={{ __html: `— ${sanitizeText(quote.author_name)}` }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  {showEditButton && isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditClick}
                      className="h-6 w-6 p-0 hover:bg-primary/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {formatDate(quote.created_at)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Quote Modal */}
      {editModalOpen && (
        <EditQuoteModal
          quote={quote}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onQuoteUpdated={handleQuoteUpdated}
        />
      )}
    </>
  );
};

export default QuoteCard;