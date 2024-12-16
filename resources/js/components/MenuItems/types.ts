export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price?: number;
  isFolder?: boolean;
  children?: MenuItem[];
  category?: string;
}
