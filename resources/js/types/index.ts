export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  isFolder?: boolean;
  children?: MenuItem[];
  tags?: string[];
}
