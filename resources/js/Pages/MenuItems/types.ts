export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  tags: string[];
  description: string;
}

export const CATEGORIES = ['Starters', 'Mains', 'Desserts'] as const;
