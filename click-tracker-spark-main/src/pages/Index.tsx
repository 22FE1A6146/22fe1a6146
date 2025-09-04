import { useState } from 'react';
import { UrlShortenerForm } from '@/components/UrlShortenerForm';
import { UrlList } from '@/components/UrlList';
import { useUrlShortener } from '@/hooks/useUrlShortener';
import { UrlFormData } from '@/types/url';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const { urls, createShortUrl, deleteUrl, addClick } = useUrlShortener();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUrl = async (formData: UrlFormData) => {
    setIsLoading(true);
    try {
      const newUrl = createShortUrl(formData);
      toast({
        title: "Success!",
        description: `Short URL created: ${newUrl.shortCode}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create short URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteUrl(id);
    toast({
      title: "Deleted",
      description: "Short URL has been deleted",
    });
  };

  const handleTrackClick = (shortCode: string) => {
    addClick(shortCode, 'interface');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              URL Shortener
            </h1>
            <p className="text-lg text-muted-foreground">
              Create short links with detailed analytics and click tracking
            </p>
          </div>
          
          <UrlShortenerForm 
            onSubmit={handleCreateUrl} 
            isLoading={isLoading}
          />
          
          <UrlList 
            urls={urls}
            onDelete={handleDelete}
            onTrackClick={handleTrackClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
