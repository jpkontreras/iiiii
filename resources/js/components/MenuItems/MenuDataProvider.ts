import { FlatMenuItem } from '@/types/menu-items';
import {
  DraggingPosition,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree';

interface DraggingPositionWithId extends DraggingPosition {
  targetId: string;
}

export class MenuDataProvider implements TreeDataProvider<FlatMenuItem> {
  private items: FlatMenuItem[];
  public itemMap: Map<TreeItemIndex, TreeItem<FlatMenuItem>>;
  private onChange: (items: FlatMenuItem[]) => void;

  constructor(
    items: FlatMenuItem[],
    onChange: (items: FlatMenuItem[]) => void,
  ) {
    this.items = items;
    this.itemMap = new Map();
    this.onChange = onChange;
    this.buildItemMap();
  }

  async addItem(item: FlatMenuItem): Promise<void> {
    this.items = [...this.items, item];
    this.addItemToMap(item);
    this.onChange(this.items);
  }

  updateItems(items: FlatMenuItem[]) {
    this.items = items;
    this.buildItemMap();
    this.onChange(this.items);
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
    const targetItem =
      itemId === 'root'
        ? null
        : this.items.find((item) => item.id.toString() === itemId);
    const newCategory = targetItem?.name;

    const newItems = this.items.map((item) => {
      const itemIdStr = item.id.toString();
      if (newChildren.includes(itemIdStr)) {
        return {
          ...item,
          parentId: itemId === 'root' ? null : parseInt(itemId.toString()),
          ...(!item.isFolder && newCategory && { category: newCategory }),
        };
      }
      return item;
    });

    this.items = newItems;
    this.buildItemMap();
    this.onChange(this.items);
  }

  handleDrop(
    items: TreeItem<FlatMenuItem>[],
    target: DraggingPosition,
  ): Promise<void> {
    if (target.targetType === 'item' || target.targetType === 'root') {
      const targetId =
        target.targetType === 'root'
          ? 'root'
          : (target as DraggingPositionWithId).targetId;
      const movedItemIds = items.map((item) => item.index.toString());
      return this.onChangeItemChildren(targetId, movedItemIds);
    }

    if (target.targetType === 'between-items') {
      // Handle reordering at the same level
      const { parentId } = target;
      const parent =
        parentId === 'root'
          ? this.itemMap.get('root')
          : this.itemMap.get(parentId);

      if (parent) {
        const newChildren = [...parent.children];
        const movedIds = items.map((item) => item.index.toString());

        // Remove moved items from their current position
        movedIds.forEach((id) => {
          const index = newChildren.indexOf(id);
          if (index !== -1) {
            newChildren.splice(index, 1);
          }
        });

        // Insert at the new position
        const targetIndex = target.childIndex;
        newChildren.splice(targetIndex, 0, ...movedIds);

        return this.onChangeItemChildren(parentId, newChildren);
      }
    }

    return Promise.resolve();
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
}
