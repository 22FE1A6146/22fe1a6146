import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useUrlShortener } from '@/hooks/useUrlShortener';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

export const RedirectHandler = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { getUrlByShortCode, addClick } = useUrlShortener();

  useEffect(() => {
    if (!shortCode) return;

    const url = getUrlByShortCode(shortCode);
    if (!url) return;

    // Check if expired
    if (new Date() > url.expiresAt) {
      return;
    }

    // Track the click
    addClick(shortCode, 'direct');
    
    // Redirect to original URL
    setTimeout(() => {
      window.location.href = url.originalUrl;
    }, 1000);
  }, [shortCode, getUrlByShortCode, addClick]);

  if (!shortCode) {
    return <Navigate to="/" replace />;
  }

  const url = getUrlByShortCode(shortCode);

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Link Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The short link you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="text-primary hover:underline"
            >
              Return to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (new Date() > url.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Link Expired</h1>
            <p className="text-muted-foreground mb-4">
              This short link has expired and is no longer accessible.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="text-primary hover:underline"
            >
              Return to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-12">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-semibold mb-2">Redirecting...</h1>
          <p className="text-muted-foreground mb-4">
            You will be redirected to your destination shortly.
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {url.originalUrl}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};