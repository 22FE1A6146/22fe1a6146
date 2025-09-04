export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  clicks: ClickData[];
  isExpired: boolean;
}

export interface ClickData {
  id: string;
  timestamp: Date;
  source: string;
  userAgent?: string;
  referrer?: string;
}

export interface UrlFormData {
  originalUrl: string;
  customShortCode?: string;
  validityMinutes: number;
}