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

export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  depth: number;
  image_path?: string;
  category_id?: number;
  is_active: boolean;
  variations?: ItemVariation[];
  modifier_groups?: ModifierGroupWithModifiers[];
}

export interface ItemVariation {
  id: number;
  name: string;
  price_adjustment: number;
  is_default: boolean;
  is_active: boolean;
}

export interface ModifierGroupWithModifiers {
  id: number;
  name: string;
  min_selections: number;
  max_selections: number;
  is_required: boolean;
  modifiers: Modifier[];
  pivot?: {
    menu_item_id: number;
    modifier_group_id: number;
  };
}

export interface ModifierGroup {
  id: number;
  name: string;
  min_selections: number;
  max_selections: number;
  is_required: boolean;
}

export interface Modifier {
  id: number;
  name: string;
  price_adjustment: number;
  is_default: boolean;
  is_active: boolean;
  modifier_group_id: number;
}

export interface MenuTreeNode {
  id: number;
  name: string;
  type: 'category' | 'item';
  children?: MenuTreeNode[];
  depth?: number;
  description?: string;
  slug?: string;
  price?: number;
  image_path?: string;
  variations?: ItemVariation[];
  modifier_groups?: ModifierGroupWithModifiers[];
}

export interface Menu {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  is_active: boolean;
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
