export interface FlatMenuItem {
  id: number;
  name: string;
  parentId: number | null;
  isFolder: boolean;
  description?: string;
  price?: number;
  category?: string;
}
