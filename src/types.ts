export interface MenuItem {
  id: number;
  path: string;
  name: string;
  description?: string;
  price?: number;
  position: number;
  is_active: boolean;
  depth: number;
  type: 'category' | 'item' | 'modifier';
  tags: string[];
  items?: MenuItem[];
  modifiers?: MenuItem[];
}
