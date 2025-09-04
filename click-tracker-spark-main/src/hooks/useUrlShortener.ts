import { useState, useEffect } from 'react';
import { ShortenedUrl, ClickData, UrlFormData } from '@/types/url';

const STORAGE_KEY = 'shortened_urls';

export const useUrlShortener = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedUrls = JSON.parse(stored).map((url: any) => ({
        ...url,
        createdAt: new Date(url.createdAt),
        expiresAt: new Date(url.expiresAt),
        clicks: url.clicks.map((click: any) => ({
          ...click,
          timestamp: new Date(click.timestamp),
        })),
        isExpired: new Date() > new Date(url.expiresAt),
      }));
      setUrls(parsedUrls);
    }
  }, []);

  const saveToStorage = (urlsList: ShortenedUrl[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urlsList));
  };

  const generateShortCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createShortUrl = (formData: UrlFormData): ShortenedUrl => {
    const shortCode = formData.customShortCode || generateShortCode();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + formData.validityMinutes * 60000);

    // Check if custom short code already exists
    if (formData.customShortCode && urls.some(url => url.shortCode === formData.customShortCode)) {
      throw new Error('Short code already exists. Please choose a different one.');
    }

    const newUrl: ShortenedUrl = {
      id: crypto.randomUUID(),
      originalUrl: formData.originalUrl,
      shortCode,
      shortUrl: `${window.location.origin}/${shortCode}`,
      createdAt,
      expiresAt,
      clicks: [],
      isExpired: false,
    };

    const updatedUrls = [newUrl, ...urls];
    setUrls(updatedUrls);
    saveToStorage(updatedUrls);
    return newUrl;
  };

  const addClick = (shortCode: string, source: string = 'direct'): boolean => {
    const urlIndex = urls.findIndex(url => url.shortCode === shortCode);
    if (urlIndex === -1) return false;

    const url = urls[urlIndex];
    if (new Date() > url.expiresAt) {
      return false; // URL expired
    }

    const clickData: ClickData = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      source,
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
    };

    const updatedUrls = [...urls];
    updatedUrls[urlIndex] = {
      ...url,
      clicks: [...url.clicks, clickData],
    };

    setUrls(updatedUrls);
    saveToStorage(updatedUrls);
    return true;
  };

  const getUrlByShortCode = (shortCode: string): ShortenedUrl | undefined => {
    return urls.find(url => url.shortCode === shortCode);
  };

  const deleteUrl = (id: string) => {
    const updatedUrls = urls.filter(url => url.id !== id);
    setUrls(updatedUrls);
    saveToStorage(updatedUrls);
  };

  return {
    urls,
    createShortUrl,
    addClick,
    getUrlByShortCode,
    deleteUrl,
  };
};