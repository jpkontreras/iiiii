import { MenuTreeNode } from '@/types';
import { TreeDataProvider, TreeItem, TreeItemIndex } from 'react-complex-tree';

export interface TreeMenuItem extends TreeItem {
  data: MenuTreeNode;
  index: TreeItemIndex;
  children: TreeItemIndex[];
}

export class MenuTreeDataProvider implements TreeDataProvider<MenuTreeNode> {
  private items: Record<TreeItemIndex, TreeMenuItem> = {};

  constructor(treeData: MenuTreeNode[]) {
    // Initialize root item
    this.items.root = {
      index: 'root',
      isFolder: true,
      children: [],
      data: {
        id: 0,
        name: 'Root',
        type: 'category',
        children: treeData,
      },
    };

    // Process all nodes recursively
    this.processNodes(treeData, 'root');
  }

  private processNodes(nodes: MenuTreeNode[], parentId: TreeItemIndex) {
    nodes.forEach((node, index) => {
      const nodeId = `${parentId}_${index}`;

      this.items[nodeId] = {
        index: nodeId,
        isFolder: node.type === 'category',
        children: [],
        data: node,
      };

      // Add to parent's children
      if (parentId !== nodeId) {
        this.items[parentId].children.push(nodeId);
      }

      // Process children if they exist
      if (node.children && node.children.length > 0) {
        this.processNodes(node.children, nodeId);
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
  getAllItems(): Record<TreeItemIndex, TreeMenuItem> {
    return this.items;
  }

  getItemById(id: number): TreeMenuItem | undefined {
    return Object.values(this.items).find((item) => item.data.id === id);
  }
}
