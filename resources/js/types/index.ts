export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price?: number;
  parentId: number | string | null;
  category?: string;
  isFolder?: boolean;
  items?: MenuItem[];
  children?: MenuItem[];
  tags?: string[];
}
