import { FlatMenuItem } from '@/types/menu-items';
import { TreeDataProvider, TreeItem, TreeItemIndex } from 'react-complex-tree';

export class MenuDataProvider implements TreeDataProvider<FlatMenuItem> {
  private items: FlatMenuItem[];
  private itemMap: Map<TreeItemIndex, TreeItem<FlatMenuItem>>;

  constructor(items: FlatMenuItem[]) {
    this.items = items;
    this.itemMap = new Map();
    this.buildItemMap();
  }

  // Add method to update items
  updateItems(items: FlatMenuItem[]) {
    this.items = items;
    this.buildItemMap();
  }

  getItemMap() {
    return Object.fromEntries(this.itemMap);
  }

  private buildItemMap() {
    // Clear the map before rebuilding
    this.itemMap.clear();

    // First, create all tree items without children
    for (const item of this.items) {
      this.itemMap.set(item.id.toString(), {
        index: item.id.toString(),
        canMove: true,
        canRename: true,
        data: item,
        children: [],
        isFolder: item.isFolder,
      });
    }

    // Add root item
    this.itemMap.set('root', {
      index: 'root',
      canMove: false,
      canRename: false,
      data: { id: 0, name: 'Root', parentId: null, isFolder: true },
      children: this.items
        .filter((item) => item.parentId === null)
        .map((item) => item.id.toString()),
      isFolder: true,
    });

    // Now set up the children arrays for each item
    for (const item of this.items) {
      const treeItem = this.itemMap.get(item.id.toString());
      if (treeItem && item.isFolder) {
        treeItem.children = this.items
          .filter((child) => child.parentId === item.id)
          .map((child) => child.id.toString());
      }
    }
  }

  async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem<FlatMenuItem>> {
    const item = this.itemMap.get(itemId.toString());
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }
    return item;
  }

  async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[],
  ): Promise<void> {
    // Update parent-child relationships in the flat structure
    const newItems = this.items.map((item) => {
      const itemIdStr = item.id.toString();
      if (newChildren.includes(itemIdStr)) {
        return {
          ...item,
          parentId: itemId === 'root' ? null : parseInt(itemId.toString()),
        };
      }
      return item;
    });

    // Update the items array and rebuild the map
    this.items = newItems;
    this.buildItemMap();
  }

  async onRenameItem(
    item: TreeItem<FlatMenuItem>,
    name: string,
  ): Promise<void> {
    const itemId = parseInt(item.index.toString());
    this.items = this.items.map((existingItem) =>
      existingItem.id === itemId ? { ...existingItem, name } : existingItem,
    );
    this.buildItemMap();
  }

  async onChangeItemData(
    itemId: TreeItemIndex,
    data: Partial<FlatMenuItem>,
  ): Promise<void> {
    const id = parseInt(itemId.toString());
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, ...data } : item,
    );
    this.buildItemMap();
  }

  // Add method to update internal state without full rebuild
  private addItemToMap(item: FlatMenuItem) {
    // Create tree item for the new item
    this.itemMap.set(item.id.toString(), {
      index: item.id.toString(),
      canMove: true,
      canRename: true,
      data: item,
      children: [],
      isFolder: item.isFolder,
    });

    // Update parent's children array if it exists
    if (item.parentId !== null) {
      const parentItem = this.itemMap.get(item.parentId.toString());
      if (parentItem) {
        parentItem.children = [
          ...(parentItem.children || []),
          item.id.toString(),
        ];
      }
    } else {
      // If it's a top-level item, add to root's children
      const rootItem = this.itemMap.get('root');
      if (rootItem) {
        rootItem.children = [...(rootItem.children || []), item.id.toString()];
      }
    }
  }

  // Method to add a new item without rebuilding the entire tree
  async addItem(item: FlatMenuItem): Promise<void> {
    this.items = [...this.items, item]; // Create new array to maintain immutability
    this.addItemToMap(item);
  }
}
