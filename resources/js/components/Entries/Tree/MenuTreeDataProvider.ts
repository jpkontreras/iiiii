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

      // Determine parent path based on entry type and path structure
      const parentPath = this.getParentPath(entry);

      this.items[index] = {
        index,
        isFolder: this.isFolder(entry),
        children: entry.items?.map((item) => item.path) || [],
        data: entry,
        path: entry.path,
      };

      // Add to parent's children if not root
      if (parentPath && parentPath !== entry.path) {
        const parent = this.items[parentPath];
        if (parent && !parent.children.includes(index)) {
          parent.children.push(index);
        }
      }

      // Recursively process children
      if (entry.items && entry.items.length > 0) {
        this.processEntries(entry.items);
      }
    });
  }

  private getParentPath(entry: MenuEntry): string {
    // Handle root level entries
    if (!entry.path.includes('.') && !entry.path.includes('/')) {
      return '';
    }

    // Handle modifiers
    if (entry.type === 'modifier') {
      const [basePath] = entry.path.split('/+');
      return basePath;
    }

    // Handle regular items and categories
    const pathParts = entry.path.split('.');
    return pathParts.slice(0, -1).join('.');
  }

  private isFolder(entry: MenuEntry): boolean {
    return Boolean(
      entry.type === 'category' ||
        entry.type === 'composite' ||
        (entry.items && entry.items.length > 0),
    );
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
