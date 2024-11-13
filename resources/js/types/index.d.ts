import { Config } from 'ziggy-js';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  menu_id: number;
  name: string;
  description?: string;
  price: number;
  category_id?: number;
  category?: Category;
  photo_path?: string;
  is_available: boolean;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  template_type: 'predefined' | 'custom';
  is_active: boolean;
  menuItems?: MenuItem[];
  created_at: string;
  updated_at: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
  flash?: {
    success?: string;
    error?: string;
  };
};
