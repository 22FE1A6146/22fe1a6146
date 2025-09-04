import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Copy, Clock } from 'lucide-react';
import { UrlFormData } from '@/types/url';
import { useToast } from '@/hooks/use-toast';

interface UrlShortenerFormProps {
  onSubmit: (data: UrlFormData) => void;
  isLoading?: boolean;
}

export const UrlShortenerForm = ({ onSubmit, isLoading = false }: UrlShortenerFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UrlFormData>({
    originalUrl: '',
    customShortCode: '',
    validityMinutes: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.originalUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.originalUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    setFormData({
      originalUrl: '',
      customShortCode: '',
      validityMinutes: 30,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Link className="h-6 w-6 text-primary" />
          URL Shortener
        </CardTitle>
        <CardDescription>
          Create short, trackable links with detailed analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="originalUrl" className="text-sm font-medium">
              Original URL
            </Label>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={formData.originalUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customShortCode" className="text-sm font-medium">
                Custom Short Code (Optional)
              </Label>
              <Input
                id="customShortCode"
                placeholder="mycode"
                value={formData.customShortCode}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customShortCode: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                }))}
                maxLength={20}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validityMinutes" className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Validity (minutes)
              </Label>
              <Input
                id="validityMinutes"
                type="number"
                min={1}
                max={10080}
                value={formData.validityMinutes}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  validityMinutes: Math.max(1, parseInt(e.target.value) || 30)
                }))}
                className="w-full"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Creating...' : 'Shorten URL'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};