import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/types';
import { FolderOpen, Minus, UtensilsCrossed } from 'lucide-react';
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

function getItemIcon(item: MenuItem) {
  if (item.type === 'modifier') {
    return <Minus className="size-4" />;
  }
  if (item.type === 'item') {
    return <UtensilsCrossed className="size-4" />;
  }
  if (item.type === 'category') {
    return <FolderOpen className="size-4" />;
  }
  return <FolderOpen className="size-4" />;
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

  // Recursive function to process items and their children
  function processItem(item: MenuItem) {
    // Add the current item to treeItems
    treeItems[item.path] = {
      index: item.path,
      canMove: true,
      isFolder: item.type === 'category',
      children: [], // Will be populated with child paths
      data: item,
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
      item.modifiers.forEach((modifier) => {
        processItem(modifier);
        treeItems[item.path].children!.push(modifier.path);
      });
    }
  }

  // Process top-level items and build the tree
  items.forEach((item) => {
    processItem(item);
    treeItems.root.children!.push(item.path);
  });

  // Sort children arrays by position
  Object.values(treeItems).forEach((treeItem) => {
    if (treeItem.children && treeItem.children.length > 0) {
      treeItem.children.sort((a, b) => {
        const itemA = treeItems[a].data as MenuItem;
        const itemB = treeItems[b].data as MenuItem;
        return (itemA.position || 0) - (itemB.position || 0);
      });
    }
  });

  return treeItems;
}

export function MenuTree({ items, onItemsChange }: MenuTreeProps) {
  const treeItems = useMemo(() => buildTreeItems(items), [items]);
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>(['root']);

  const dataProvider = useMemo(
    () =>
      new StaticTreeDataProvider(treeItems, (item, data) => ({
        ...item,
        data: data as MenuItem,
      })),
    [treeItems],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <UncontrolledTreeEnvironment
                dataProvider={dataProvider}
                getItemTitle={(item) => item.data.name}
                viewState={{
                  ['menu-tree']: {
                    expandedItems,
                  },
                }}
                renderItem={(props) => (
                  <MenuTreeRenderer
                    {...props}
                    icon={getItemIcon(props.item.data)}
                  />
                )}
                renderItemsContainer={({ children, containerProps }) => (
                  <ul
                    {...containerProps}
                    className={cn('flex flex-col gap-[2px]')}
                  >
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
      </div>
    </div>
  );
}
