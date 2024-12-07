import { MenuItem, TreeChangeEvent, TreeDataProviderEvents } from '@/types';
import {
  TreeDataProvider as BaseTreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree';

export class TreeDataProvider implements BaseTreeDataProvider<MenuItem> {
  private items: Map<string, MenuItem>;
  private events: TreeDataProviderEvents;

  constructor(initialItems: MenuItem[], events: TreeDataProviderEvents) {
    this.items = new Map(initialItems.map((item) => [item.id, item]));
    this.events = events;
  }

  async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem<MenuItem>> {
    const item = this.items.get(itemId as string);
    if (!item) throw new Error(`Item with id ${itemId} not found`);

    return {
      index: itemId,
      data: item,
      isFolder: Boolean(item.children?.length),
      children: item.children || [],
    };
  }

  private emitChange(type: TreeChangeEvent['type'], changedIds: string[]) {
    this.events.onItemsChange?.({
      type,
      items: Array.from(this.items.values()),
      changedIds,
    });
  }

  // Public API methods
  updateItem(itemId: string, updates: Partial<MenuItem>) {
    const item = this.items.get(itemId);
    if (!item) return;

    const updatedItem = { ...item, ...updates };
    this.items.set(itemId, updatedItem);
    this.emitChange('update', [itemId]);
  }

  addItem(item: MenuItem, parentId?: string) {
    this.items.set(item.id, item);

    if (parentId) {
      const parent = this.items.get(parentId);
      if (parent) {
        parent.children = [...(parent.children || []), item.id];
        this.items.set(parentId, parent);
      }
    }

    this.emitChange('add', [item.id, parentId].filter(Boolean) as string[]);
  }

  removeItem(itemId: string) {
    const item = this.items.get(itemId);
    if (!item) return;

    // Remove from parent's children
    for (const [pid, parent] of this.items.entries()) {
      if (parent.children?.includes(itemId)) {
        parent.children = parent.children.filter((id) => id !== itemId);
        this.items.set(pid, parent);
      }
    }

    this.items.delete(itemId);
    this.emitChange('remove', [itemId]);
  }

  reorderItems(
    sourceId: string,
    targetId: string,
    position: 'before' | 'after' | 'inside',
  ) {
    // Implementation for reordering items
    // ...
    this.emitChange('reorder', [sourceId, targetId]);
  }
}
