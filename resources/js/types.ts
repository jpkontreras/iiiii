export interface Tag {
  id: number;
  name: string;
  type: 'dietary' | 'feature';
}

export interface PropertyOption {
  name: string;
  price: number;
}

export type PropertyValue = string[] | PropertyOption[] | number | null;

export interface MenuItemProperties {
  [key: string]: PropertyValue;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price?: string | number | null;
  properties?: MenuItemProperties;
  photo_path?: string | null;
  is_available: boolean;
  order: number;
  tags: Tag[];
  items?: MenuItem[];
  customizations?: any[];
}
