export interface MenuEntry {
  id: number;
  path: string;
  name: string;
  description: string | null;
  price: string | number | null;
  position: number;
  is_active: boolean;
  depth: number;
  type: 'category' | 'item' | 'modifier' | 'composite';
  tags: MenuEntryTag[];
  items?: MenuEntry[];
}

export interface MenuEntryTag {
  id: number;
  name: string;
  type: string;
}
