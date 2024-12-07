import { MenuItem } from '@/types';
import { useMemo } from 'react';
import {
  Tree,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';

interface MenuTreeInterface {
  items: [];
  onItemsChange: unknown;
}

class MenuTreeDataProvider implements TreeDataProvider<MenuItem> {
  private listeners: ((changedItemIds: TreeItemIndex[]) => void)[] = [];
  constructor(private items: MenuItem[]) {}

  async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem<MenuItem>> {
    return {
      index: itemId,
      data: this.items.find((item) => item.id === itemId) || this.items[0],
      isFolder: false,
      children: [],
    };
  }

  onDidChangeTreeData(listener: (changedItemIds: TreeItemIndex[]) => void) {
    this.listeners.push(listener);
    return {
      dispose: () => {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
          this.listeners.splice(index, 1);
        }
      },
    };
  }

  private notifyListeners(changedItemIds: TreeItemIndex[]) {
    this.listeners.forEach((listener) => listener(changedItemIds));
  }

  onRenameItem?:
    | ((item: TreeItem<MenuItem>, name: string) => Promise<void>)
    | undefined;
  onChangeItemChildren?:
    | ((itemId: TreeItemIndex, newChildren: TreeItemIndex[]) => Promise<void>)
    | undefined;
}

function MenuTree({ items, onItemsChange }: MenuTreeInterface) {
  const dataProvider = useMemo(() => new MenuTreeDataProvider(items), [items]);

  return (
    <>
      <UncontrolledTreeEnvironment
        dataProvider={dataProvider}
        getItemTitle={(item) => item.data.name}
        viewState={{
          ['menu-tree']: {},
        }}
      >
        <Tree treeId="menu-tree" rootItem="root" treeLabel="Menu Structure" />
      </UncontrolledTreeEnvironment>
    </>
  );
}

export default MenuTree;
