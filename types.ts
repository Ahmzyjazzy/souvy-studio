
export enum ToneTier {
  ROMANTIC = 'Romantic',
  PROFESSIONAL = 'Professional',
  HUMOROUS = 'Humorous',
  MINIMALIST = 'Minimalist'
}

export type ElementType = 'text' | 'image';

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: string; // Text string or base64 URL
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  zIndex: number;
  isLocked?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface Customization {
  elements: CanvasElement[];
  generatedNote: string;
  designAdvice: string;
  recipientName: string;
  occasion: string;
  tone: ToneTier;
  previewImage?: string; // High-res base64 composite of the final design
}

export interface CartItem {
  id: string;
  product: Product;
  customization: Customization | null;
}
