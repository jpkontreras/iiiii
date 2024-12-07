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

export type EntryType = 'category' | 'item' | 'composite' | 'modifier';

export interface MenuModifier {
  id: number;
  path: string;
  name: string;
  description?: string;
  price: string | null;
  position: number;
  is_active: boolean;
  depth: number;
  type: 'modifier';
  tags: string[];
}

export interface MenuEntry {
  id: number;
  path: string;
  name: string;
  description?: string;
  price: string | null;
  position: number;
  is_active: boolean;
  depth: number;
  type: EntryType;
  tags: string[];
  items?: MenuEntry[];
  modifiers?: MenuModifier[];
}

export interface MenuEntryCollection {
  entries: MenuEntry[];
}

export interface Menu {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  template_type: 'predefined' | 'custom';
  is_active: boolean;
  entries?: MenuEntryCollection;
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
