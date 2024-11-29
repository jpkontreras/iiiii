import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/types';
import { useMemo } from 'react';
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

function convertFlatToTreeItems(
  flatItems: MenuItem[],
): Record<TreeItemIndex, TreeItem<MenuItem>> {
  const treeItems: Record<TreeItemIndex, TreeItem<MenuItem>> = {
    root: {
      index: 'root',
      canMove: true,
      isFolder: true,
      children: [],
      data: {
        id: 0,
        name: 'root',
        parentId: null,
        isFolder: true,
      },
      canRename: true,
    },
  };

  // First pass: Create all items
  flatItems.forEach((item) => {
    const treeItem: TreeItem<MenuItem> = {
      index: item.id.toString(),
      data: item,
      isFolder: item.isFolder,
    };

    if (item.isFolder) {
      treeItem.children = [];
    }

    treeItems[item.id.toString()] = treeItem;
  });

  // Second pass: Build relationships
  flatItems.forEach((item) => {
    const itemId = item.id.toString();
    const parentId = item.parentId?.toString() || 'root';

    // Add child to parent's children array
    if (treeItems[parentId].children) {
      treeItems[parentId].children!.push(itemId);
    }
  });

  return treeItems;
}

function convertTreeToFlatItems(
  treeItems: Record<TreeItemIndex, TreeItem<MenuItem>>,
): MenuItem[] {
  const flatItems: MenuItem[] = [];
  const processedIds = new Set<string>();

  const processItem = (
    itemId: TreeItemIndex,
    parentId: number | null = null,
  ): void => {
    if (processedIds.has(itemId.toString()) || !treeItems[itemId]) {
      return;
    }

    const treeItem = treeItems[itemId];
    processedIds.add(itemId.toString());

    // Skip the root item
    if (itemId === 'root') {
      treeItem.children?.forEach((childId) => processItem(childId, null));
      return;
    }

    // Get the original item data or create new flat item
    let flatItem: MenuItem;
    if (typeof treeItem.data === 'object' && treeItem.data !== null) {
      // Use the original data but update parentId and isFolder status
      flatItem = {
        ...(treeItem.data as MenuItem),
        parentId, // Update with new parent
        isFolder: !!treeItem.children,
      };
    } else {
      // Create new flat item if no original data exists
      flatItem = {
        id: parseInt(itemId.toString()),
        name: String(treeItem.data),
        parentId,
        isFolder: !!treeItem.children,
      };
    }

    flatItems.push(flatItem);

    // Process children if this is a folder
    if (treeItem.children) {
      treeItem.children.forEach((childId) => processItem(childId, flatItem.id));
    }
  };

  // Start processing from root
  processItem('root');

  return flatItems.sort((a, b) => a.id - b.id);
}

// return {
//   root: {
//     index: 'root',
//     children: ['child1', 'child2'],
//     data: 'root',
//   },
//   child1: {
//     index: 'child1',
//     children: [],
//     data: {
//       id: 1,
//       name: 'child1',
//       parentId: 0,
//       isFolder: true,
//     },
//     isFolder: true,
//   },
//   child2: {
//     index: 'child2',
//     children: [],
//     data: {
//       id: 1,
//       name: 'child2',
//       parentId: 1,
//       isFolder: true,
//     },
//   },
// };

function flatToTree(
  items: MenuItem[],
): Record<TreeItemIndex, TreeItem<MenuItem | string>> {
  const treeBuild = items.map((item) => ({
    [item.name]: {
      index: item.name,
      children: [],
      data: item,
    },
  }));

  return {
    root: {
      index: 'root',
      children: ['child1', 'child2'],
      data: 'root',
    },
    ...treeBuild,
  };
}

export function MenuTree({ items, onItemsChange }: MenuTreeProps) {
  const treeItems = useMemo(() => items, [items]);
  console.log({ treeItems });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <UncontrolledTreeEnvironment
                dataProvider={
                  new StaticTreeDataProvider(treeItems, (item, data) => ({
                    ...item,
                    data,
                  }))
                }
                getItemTitle={(item) => item.data.name}
                viewState={{
                  ['menu-tree']: {},
                }}
                //canSearch={!isEditing}
                //canSearchByStartingTyping={!isEditing}
                canDragAndDrop
                canReorderItems
                canDropOnFolder
                canDropAt={(draggedItems, target) => {
                  console.log({ draggedItems });

                  return true;
                }}
                renderItem={(props) => (
                  <MenuTreeRenderer
                    {...props}
                    // addingToCategory={addingToCategory}
                    setAddingToCategory={(id) => {
                      // setAddingToCategory(id);
                      // setIsEditing(!!id);
                    }}
                    handleQuickAdd={(parentId, data) => {
                      // setAddingToCategory(null);
                      // setIsEditing(false);
                    }}
                  />
                )}
                renderItemsContainer={({ children, containerProps }) => (
                  <ul
                    {...containerProps}
                    className={cn('flex flex-col gap-[2px] pl-3')}
                  >
                    {children}
                  </ul>
                )}
                renderTreeContainer={({ children, containerProps }) => (
                  <SidebarMenu {...containerProps} className="gap-[2px]">
                    {children}
                  </SidebarMenu>
                )}
              >
                <Tree
                  treeId="menu-tree"
                  rootItem="root"
                  treeLabel="UI Components"
                />
              </UncontrolledTreeEnvironment>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </div>
  );
}
