export interface Tag {
  id: number;
  name: string;
  type: string;
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
  path: string;
  name: string;
  description: string | null;
  price: string | number | null;
  position: number;
  is_active: boolean;
  depth: number;
  type: 'category' | 'item' | 'modifier';
  tags: Tag[];
  items?: MenuItem[];
  modifiers?: MenuItem[];
}

export interface TreeNode<T = any> {
  id: number;
  name: string;
  parentId: number | null;
  isFolder?: boolean;
  children?: TreeNode<T>[];
  data?: T;
}

export interface MenuTreeItem extends TreeNode {
  description?: string;
  price?: string | number | null;
  properties?: MenuItemProperties;
  photo_path?: string | null;
  is_available: boolean;
  order: number;
  tags: Tag[];
  items?: MenuTreeItem[];
}
