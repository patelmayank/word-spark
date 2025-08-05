import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote as QuoteIcon } from 'lucide-react';

interface Quote {
  id: string;
  quote_text: string;
  author_name: string;
  created_at: string;
  user_id: string;
}

interface QuoteCardProps {
  quote: Quote;
  showAuthor?: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, showAuthor = true }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="bg-gradient-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] animate-fade-in border-0">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <QuoteIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <blockquote className="text-lg font-medium text-foreground leading-relaxed mb-4 italic">
              "{quote.quote_text}"
            </blockquote>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-primary">
                  — {quote.author_name}
                </span>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs">
                  {formatDate(quote.created_at)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;