import { Button } from '@/components/ui/button';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { FlatMenuItem } from '@/types/menu-items';
import { FolderPlus, Search } from 'lucide-react';
import { HTMLProps, useEffect, useRef, useState } from 'react';
import {
  DraggingPosition,
  Tree,
  TreeEnvironmentRef,
  TreeItem,
  TreeItemIndex,
  TreeItemRenderContext,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { MenuDataProvider } from './MenuDataProvider';
import { MenuItemRenderer } from './MenuItemRenderer';

interface MenuItemBuilderProps {
  items: FlatMenuItem[];
  onChange: (items: FlatMenuItem[]) => void;
  onSelectItem?: (itemId: number) => void;
}

function MenuItemToolbar() {
  return (
    <div className="flex items-center gap-2 border-b p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="flex items-center gap-2"
      >
        <FolderPlus className="size-4" />
        Add Category
      </Button>
    </div>
  );
}

export function MenuItemBuilder({
  items,
  onChange,
  onSelectItem,
}: MenuItemBuilderProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['root']);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCategory, setAddingToCategory] = useState<number | null>(null);
  const [version, setVersion] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dataProviderRef = useRef<MenuDataProvider>(
    new MenuDataProvider(items, onChange),
  );
  const environment = useRef<TreeEnvironmentRef<FlatMenuItem>>(null);
  const pendingActionsRef = useRef<(() => void)[]>([]);
  const isEditing = addingToCategory !== null;

  useEffect(() => {
    if (pendingActionsRef.current.length > 0) {
      const actions = pendingActionsRef.current;
      pendingActionsRef.current = [];
      actions.forEach((action) => action());
    }
  }, [version]);

  useEffect(() => {
    dataProviderRef.current.updateItems(items);
  }, [items]);

  const handleQuickAdd = async (
    parentItem: FlatMenuItem,
    data: { name: string; price: number },
  ) => {
    const newItem: FlatMenuItem = {
      id: Math.max(...items.map((item) => item.id)) + 1,
      name: data.name,
      parentId: parentItem.id,
      isFolder: false,
      description: '',
      price: data.price,
      category: parentItem.name,
    };

    await dataProviderRef.current.addItem(newItem);
    onChange([...items, newItem]);
    setAddingToCategory(null);

    pendingActionsRef.current.push(() => {
      if (environment.current) {
        setExpandedItems((prev) => {
          if (!prev.includes(parentItem.id.toString())) {
            return [...prev, parentItem.id.toString()];
          }
          return prev;
        });
        setFocusedItem(newItem.id.toString());
      }
    });
  };

  const renderItem = ({
    item,
    depth,
    context,
    children,
  }: {
    item: TreeItem<FlatMenuItem>;
    depth: number;
    context: TreeItemRenderContext<never>;
    children: React.ReactNode;
  }) => (
    <MenuItemRenderer
      item={item}
      depth={depth}
      context={context}
      children={children}
      addingToCategory={addingToCategory}
      setAddingToCategory={setAddingToCategory}
      handleQuickAdd={handleQuickAdd}
      environment={environment}
    />
  );

  const renderDragBetweenLine = ({
    draggingPosition,
    lineProps,
  }: {
    draggingPosition: DraggingPosition;
    lineProps: HTMLProps<HTMLDivElement>;
  }) => {
    const position = draggingPosition as { targetIndex?: number };
    if (typeof position.targetIndex !== 'number') return null;

    return (
      <div
        {...lineProps}
        className="absolute left-0 right-0 h-0.5 animate-pulse bg-primary shadow-[0_0_8px_rgba(0,0,0,0.25)]"
        style={{
          transform: `translateY(${position.targetIndex * 32}px)`,
        }}
      />
    );
  };

  const renderSearchInput = ({
    inputProps,
  }: {
    inputProps: HTMLProps<HTMLInputElement>;
  }) => (
    <div className="relative px-2 py-2">
      <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        {...inputProps}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          inputProps.onChange?.(e);
        }}
        className="h-8 w-full rounded-md border border-input bg-transparent px-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder="Search items..."
      />
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <MenuItemToolbar />
      <div
        className={cn(
          'flex-1 transition-all duration-200',
          isDragging && 'bg-muted/50 shadow-inner',
        )}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <UncontrolledTreeEnvironment<FlatMenuItem>
                key={version}
                ref={environment}
                canDragAndDrop
                canDropOnFolder
                canReorderItems
                canRename
                canSearch={!isEditing}
                canSearchByStartingTyping={!isEditing}
                dataProvider={dataProviderRef.current}
                getItemTitle={(item) => item.data.name}
                viewState={{
                  ['menu-tree']: {
                    expandedItems,
                    selectedItems,
                    focusedItem: focusedItem as TreeItemIndex | undefined,
                  },
                }}
                onExpandItem={(item) => {
                  setExpandedItems([...expandedItems, item.toString()]);
                }}
                onCollapseItem={(item) => {
                  setExpandedItems(
                    expandedItems.filter((id) => id !== item.toString()),
                  );
                }}
                onFocusItem={(item) => {
                  setFocusedItem(item.toString());
                }}
                onSelectItems={(items) => {
                  setSelectedItems(items as string[]);
                  const selectedId = parseInt(items[0].toString());
                  if (!isNaN(selectedId) && onSelectItem) {
                    onSelectItem(selectedId);
                  }
                }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                canDropAt={(items, target) => {
                  if (target.targetType === 'between-items') return true;
                  if (target.targetType === 'item') {
                    const itemId = (target as { targetId: string }).targetId;
                    return dataProviderRef.current
                      .getTreeItem(itemId)
                      .then((item) => item.isFolder);
                  }
                  return target.targetType === 'root';
                }}
                onDrop={(items, target) => {
                  dataProviderRef.current.handleDrop(items, target);
                }}
                renderItem={renderItem}
                renderDragBetweenLine={renderDragBetweenLine}
                renderSearchInput={renderSearchInput}
                renderTreeContainer={({ children, containerProps }) => (
                  <SidebarMenu {...containerProps}>{children}</SidebarMenu>
                )}
              >
                <Tree
                  treeId="menu-tree"
                  rootItem="root"
                  treeLabel="Menu Items"
                />
              </UncontrolledTreeEnvironment>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </div>
  );
}
