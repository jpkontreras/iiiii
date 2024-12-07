import { MenuEntry } from '@/types';
import { TreeDataProvider, TreeItem, TreeItemIndex } from 'react-complex-tree';

export interface TreeMenuItem extends TreeItem {
  data: MenuEntry;
  path: string;
  children: TreeItemIndex[];
}

export class MenuTreeDataProvider implements TreeDataProvider<MenuEntry> {
  private items: Record<TreeItemIndex, TreeMenuItem> = {};
  private pathMap: Record<string, TreeItemIndex> = {};

  constructor(menuEntries: MenuEntry[]) {
    // Initialize root item
    this.items.root = {
      index: 'root',
      isFolder: true,
      children: menuEntries.map((entry) => entry.path),
      data: {} as MenuEntry,
      path: '',
    };

    // Process all entries recursively
    this.processEntries(menuEntries);
  }

  private processEntries(entries: MenuEntry[]) {
    entries.forEach((entry) => {
      const index = entry.path;
      this.pathMap[entry.path] = index;

      // Get parent path
      const parentPath = entry.path.includes('/')
        ? entry.path.split('/')[0]
        : entry.path.split('.').slice(0, -1).join('.');

      this.items[index] = {
        index,
        isFolder: entry.type === 'category' || entry.type === 'composite',
        children: entry.items?.map((item) => item.path) || [],
        data: entry,
        path: entry.path,
      };

      // Add this item to parent's children if it's not a top-level item
      if (parentPath && parentPath !== entry.path) {
        const parent = this.items[parentPath];
        if (parent && !parent.children.includes(index)) {
          parent.children.push(index);
        }
      }

      // Process child items if they exist
      if (entry.items && entry.items.length > 0) {
        this.processEntries(entry.items);
      }
    });
  }

  // Required TreeDataProvider methods
  async getTreeItem(itemId: TreeItemIndex): Promise<TreeMenuItem> {
    return this.items[itemId];
  }

  async getTreeItems(itemIds: TreeItemIndex[]): Promise<TreeMenuItem[]> {
    return itemIds.map((id) => this.items[id]);
  }

  async getRootItem(): Promise<TreeMenuItem> {
    return this.items.root;
  }

  async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[],
  ): Promise<void> {
    this.items[itemId].children = newChildren;
  }

  // Helper methods
  getItemByPath(path: string): TreeMenuItem | undefined {
    return this.items[this.pathMap[path]];
  }

  getAllItems(): Record<TreeItemIndex, TreeMenuItem> {
    return this.items;
  }
}
