import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/types';
import { useMemo, useState } from 'react';
import {
  StaticTreeDataProvider,
  Tree,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { MenuTreeRenderer } from './MenuTreeRenderer';

interface MenuTreeProps {
  items: MenuItem[];
  onItemsChange?: (items: MenuItem[]) => void;
}

interface ModifierGroup {
  name: string;
  items: MenuItem[];
}

function buildTreeItems(
  items: MenuItem[],
): Record<TreeItemIndex, TreeItem<MenuItem>> {
  const treeItems: Record<TreeItemIndex, TreeItem<MenuItem>> = {
    root: {
      index: 'root',
      canMove: false,
      isFolder: true,
      children: [],
      data: {
        id: 0,
        path: '',
        name: 'Menu',
        description: null,
        price: null,
        position: 0,
        is_active: true,
        depth: 0,
        type: 'category',
        tags: [],
      },
    },
  };

  function processItem(item: MenuItem) {
    // For modifiers, enhance the name with the group name
    let displayName = item.name;
    if (item.type === 'modifier') {
      const groupMatch = item.path.match(/\/\+([^.]+)\./);
      if (groupMatch) {
        const groupName =
          groupMatch[1].charAt(0).toUpperCase() + groupMatch[1].slice(1);
        displayName = `${groupName}: ${item.name}`;
      }
    }

    treeItems[item.path] = {
      index: item.path,
      canMove: true,
      isFolder: ['category', 'composite'].includes(item.type),
      children: [],
      data: {
        ...item,
        name: displayName,
      },
    };

    // Process regular items
    if (item.items && item.items.length > 0) {
      item.items.forEach((childItem) => {
        processItem(childItem);
        treeItems[item.path].children!.push(childItem.path);
      });
    }

    // Process modifiers
    if (item.modifiers && item.modifiers.length > 0) {
      // Sort modifiers by group and position
      const sortedModifiers = [...item.modifiers].sort((a, b) => {
        const groupA = a.path.match(/\/\+([^.]+)\./)![1];
        const groupB = b.path.match(/\/\+([^.]+)\./)![1];
        if (groupA !== groupB) return groupA.localeCompare(groupB);
        return (a.position || 0) - (b.position || 0);
      });

      sortedModifiers.forEach((modifier) => {
        processItem(modifier);
        treeItems[item.path].children!.push(modifier.path);
      });
    }
  }

  items.forEach((item) => {
    processItem(item);
    treeItems.root.children!.push(item.path);
  });

  return treeItems;
}

function getAllPaths(items: MenuItem[]): string[] {
  const paths = new Set<string>(['root']);

  function collectPaths(item: MenuItem) {
    paths.add(item.path);

    // Collect paths from regular items
    if (item.items) {
      item.items.forEach(collectPaths);
    }

    // Collect paths from modifiers
    if (item.modifiers) {
      item.modifiers.forEach(collectPaths);
    }
  }

  items.forEach(collectPaths);
  return Array.from(paths);
}

export function MenuTree({ items, onItemsChange }: MenuTreeProps) {
  console.log({ items });

  const treeItems = useMemo(() => buildTreeItems(items), [items]);
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>(() =>
    getAllPaths(items),
  );
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

  const dataProvider = useMemo(
    () =>
      new StaticTreeDataProvider(treeItems, (item, data) => ({
        ...item,
        data: data as MenuItem,
      })),
    [treeItems],
  );

  const handleSelectItems = (items: TreeItemIndex[]) => {
    setSelectedItems(items);

    // If we're deselecting (saving) a modifier item
    const previousSelected = selectedItems[0];
    if (previousSelected && items.length === 0) {
      const item = treeItems[previousSelected]?.data;
      if (item?.type === 'modifier') {
        // Collapse the parent item
        const parentPath = item.path.split('/')[0];
        setExpandedItems((prev) =>
          prev.filter((path) => !(path as string).startsWith(parentPath)),
        );

        // Refresh the tree data starting from root
        console.log({ items });

        dataProvider.onChangeItemChildren('root', items);
      }
    }
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <UncontrolledTreeEnvironment
            dataProvider={dataProvider}
            getItemTitle={(item) => item.data.name}
            viewState={{
              ['menu-tree']: {
                expandedItems,
                selectedItems,
              },
            }}
            canSearch={false}
            renderItem={(props) => (
              <MenuTreeRenderer {...props} selectedItem={selectedItems[0]} />
            )}
            renderItemsContainer={({ children, containerProps }) => (
              <ul {...containerProps} className={cn('flex flex-col gap-[2px]')}>
                {children}
              </ul>
            )}
            renderTreeContainer={({ children, containerProps }) => (
              <SidebarMenu {...containerProps} className="gap-[2px]">
                {children}
              </SidebarMenu>
            )}
            onExpandItem={(item) => {
              setExpandedItems((prev) => [...prev, item.index]);
            }}
            onCollapseItem={(item) => {
              setExpandedItems((prev) =>
                prev.filter((id) => id !== item.index),
              );
            }}
            onSelectItems={handleSelectItems}
          >
            <Tree
              treeId="menu-tree"
              rootItem="root"
              treeLabel="Menu Structure"
            />
          </UncontrolledTreeEnvironment>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
