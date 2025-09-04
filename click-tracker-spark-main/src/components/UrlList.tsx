import { useState } from 'react';
import { ShortenedUrl } from '@/types/url';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  ExternalLink, 
  Calendar, 
  MousePointer, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface UrlListProps {
  urls: ShortenedUrl[];
  onDelete: (id: string) => void;
  onTrackClick: (shortCode: string) => void;
}

export const UrlList = ({ urls, onDelete, onTrackClick }: UrlListProps) => {
  const { toast } = useToast();
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const handleRedirect = (url: ShortenedUrl) => {
    if (new Date() > url.expiresAt) {
      toast({
        title: "Link Expired",
        description: "This short link has expired and cannot be accessed",
        variant: "destructive",
      });
      return;
    }
    onTrackClick(url.shortCode);
    window.open(url.originalUrl, '_blank');
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedUrls);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedUrls(newExpanded);
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (urls.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <MousePointer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No shortened URLs yet</h3>
          <p className="text-muted-foreground">
            Create your first short link using the form above
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Shortened URLs</h2>
        <Badge variant="secondary">{urls.length} link{urls.length !== 1 ? 's' : ''}</Badge>
      </div>
      
      {urls.map((url) => {
        const isExpanded = expandedUrls.has(url.id);
        const isExpired = new Date() > url.expiresAt;
        
        return (
          <Card key={url.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm truncate">{url.shortUrl}</h3>
                    {isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mb-3">
                    {url.originalUrl}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {format(url.createdAt, 'MMM d, HH:mm')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(url.expiresAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointer className="h-3 w-3" />
                      {url.clicks.length} click{url.clicks.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(url.shortUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRedirect(url)}
                    disabled={isExpired}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpanded(url.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(url.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {isExpanded && url.clicks.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Click Analytics ({url.clicks.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {url.clicks
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((click, index) => (
                        <div
                          key={click.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              #{index + 1}
                            </span>
                            <div>
                              <div className="font-medium">
                                {format(click.timestamp, 'MMM d, yyyy HH:mm:ss')}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                Source: {click.source} • Referrer: {click.referrer}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {isExpanded && url.clicks.length === 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No clicks recorded yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};