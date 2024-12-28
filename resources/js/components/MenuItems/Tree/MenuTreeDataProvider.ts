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

  //  isFolder: ode.type === 'category' || this.hasModifiersOrVariations(node),
  private processNodes(nodes: MenuTreeNode[], parentId: TreeItemIndex) {
    nodes.forEach((node, index) => {
      const nodeId = `${parentId}_${index}`;

      this.items[nodeId] = {
        index: nodeId,
        isFolder: node.type === 'category',
        children: [],
        data: {
          ...node,
          name: node.name,
          type: node.type,
        },
      };

      // Add to parent's children
      if (parentId !== nodeId) {
        this.items[parentId].children.push(nodeId);
      }

      // Process children if they exist
      if (node.children && node.children.length > 0) {
        this.processNodes(node.children, nodeId);
      }

      // if (node.type === 'item') {
      //   this.processItemExtras(node, nodeId);
      // }
    });
  }

  private hasModifiersOrVariations(node: MenuTreeNode): boolean {
    if (node.type !== 'item') {
      return false;
    }

    const hasVariations =
      Array.isArray(node.variations) && node.variations.length > 0;
    const hasModifierGroups =
      Array.isArray(node.modifier_groups) && node.modifier_groups.length > 0;

    return hasVariations || hasModifierGroups;
  }

  private processItemExtras(node: MenuTreeNode, parentId: TreeItemIndex) {
    // Process variations directly under the parent item
    if (node.variations && node.variations.length > 0) {
      node.variations.forEach((variation, index) => {
        const variationId = `${parentId}_variation_${index}`;
        this.items[variationId] = {
          index: variationId,
          isFolder: false,
          children: [],
          data: {
            ...variation,
            type: 'variation',
            name:
              variation.price > 0
                ? `${variation.name} (+$${variation.price.toFixed(2)})`
                : variation.name,
          },
        };
        this.items[parentId].children.push(variationId);
      });
    }

    // Process modifier groups directly under the parent item
    if (node.modifier_groups && node.modifier_groups.length > 0) {
      node.modifier_groups.forEach((group, groupIndex) => {
        const groupId = `${parentId}_group_${groupIndex}`;
        const selectionText =
          group.min_selections === group.max_selections
            ? `(Select ${group.min_selections})`
            : `(Select ${group.min_selections}-${group.max_selections})`;

        this.items[groupId] = {
          index: groupId,
          isFolder: true,
          children: [],
          data: {
            ...group,
            type: 'modifier_group',
            name: `${group.name} ${selectionText}`,
          },
        };
        this.items[parentId].children.push(groupId);

        // Process modifiers within the group
        group.modifiers.forEach((modifier, modifierIndex) => {
          const modifierId = `${groupId}_${modifierIndex}`;
          this.items[modifierId] = {
            index: modifierId,
            isFolder: false,
            children: [],
            data: {
              ...modifier,
              type: 'modifier',
              name:
                modifier.price > 0
                  ? `${modifier.name} (+$${modifier.price.toFixed(2)})`
                  : modifier.name,
            },
          };
          this.items[groupId].children.push(modifierId);
        });
      });
    }
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

  getAllItems(): Record<TreeItemIndex, TreeMenuItem> {
    return this.items;
  }

  getItemById(id: number): TreeMenuItem | undefined {
    return Object.values(this.items).find((item) => item.data.id === id);
  }
}
