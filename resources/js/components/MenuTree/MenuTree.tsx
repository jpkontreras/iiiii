import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { FlatMenuItem } from '@/types/menu-items';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  StaticTreeDataProvider,
  Tree,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { MenuTreeRenderer } from './MenuTreeRenderer';

interface MenuTreeProps {
  items: FlatMenuItem[];
  onItemsChange?: (items: FlatMenuItem[]) => void;
}

function convertFlatToTreeItems(
  flatItems: FlatMenuItem[],
): Record<TreeItemIndex, TreeItem<string>> {
  const treeItems: Record<TreeItemIndex, TreeItem<string>> = {
    root: {
      index: 'root',
      canMove: true,
      isFolder: true,
      children: [],
      data: 'root',
      canRename: true,
    },
  };

  // First pass: Create all items
  flatItems.forEach((item) => {
    const treeItem: TreeItem<string> = {
      index: item.id.toString(),
      data: item.name,
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
  treeItems: Record<TreeItemIndex, TreeItem<string>>,
): FlatMenuItem[] {
  const flatItems: FlatMenuItem[] = [];
  const processedIds = new Set<string>();

  // Helper function to process each item
  const processItem = (
    itemId: TreeItemIndex,
    parentId: number | null = null,
  ): void => {
    // Skip if already processed or item doesn't exist
    if (processedIds.has(itemId.toString()) || !treeItems[itemId]) {
      return;
    }

    const treeItem = treeItems[itemId];
    processedIds.add(itemId.toString());

    // Skip the root item
    if (itemId === 'root') {
      // Process root's children
      treeItem.children?.forEach((childId) => processItem(childId, null));
      return;
    }

    // Convert tree item to flat item
    const flatItem: FlatMenuItem = {
      id: parseInt(itemId.toString()),
      name: treeItem.data,
      parentId,
      isFolder: !!treeItem.children,
    };

    flatItems.push(flatItem);

    // Process children if this is a folder
    if (treeItem.children) {
      treeItem.children.forEach((childId) => processItem(childId, flatItem.id));
    }
  };

  // Start processing from root
  processItem('root');

  return flatItems;
}

export function MenuTree({ items: flatItems, onItemsChange }: MenuTreeProps) {
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const isUpdatingFromProps = useRef(false);
  const items = useRef<Record<TreeItemIndex, TreeItem<string>>>(
    convertFlatToTreeItems(flatItems),
  );
  const dataProviderRef = useRef<StaticTreeDataProvider<string>>();

  // Create data provider only once
  const dataProvider = useMemo(() => {
    const provider = new StaticTreeDataProvider(
      items.current,
      (item, data) => ({
        ...item,
        data,
      }),
    );

    provider.onDidChangeTreeData((changedItemIds) => {
      if (!isUpdatingFromProps.current) {
        console.log('Tree data changed:', changedItemIds);
        const newFlatItems = convertTreeToFlatItems(items.current);
        onItemsChange?.(newFlatItems);
      }
    });

    dataProviderRef.current = provider;
    return provider;
  }, []); // Empty dependency array - create only once

  // Update tree items when flat items change
  useEffect(() => {
    isUpdatingFromProps.current = true;
    items.current = convertFlatToTreeItems(flatItems);

    if (dataProviderRef.current) {
      dataProviderRef.current.onDidChangeTreeDataEmitter.emit(['root']);
    }

    // Reset the flag after the update
    requestAnimationFrame(() => {
      isUpdatingFromProps.current = false;
    });
  }, [flatItems]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <UncontrolledTreeEnvironment
                dataProvider={dataProvider}
                getItemTitle={(item) => item.data}
                viewState={{
                  ['menu-tree']: {},
                }}
                canSearch={!isEditing}
                canSearchByStartingTyping={!isEditing}
                canDragAndDrop
                canReorderItems
                canDropOnFolder
                renderItem={(props) => (
                  <MenuTreeRenderer
                    {...props}
                    addingToCategory={addingToCategory}
                    setAddingToCategory={(id) => {
                      setAddingToCategory(id);
                      setIsEditing(!!id);
                    }}
                    handleQuickAdd={(parentId, data) => {
                      setAddingToCategory(null);
                      setIsEditing(false);
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
