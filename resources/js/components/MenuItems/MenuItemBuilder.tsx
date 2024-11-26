import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { MenuItem } from '@/types';
import {
  Check,
  ChevronDown,
  ChevronRight,
  FolderIcon,
  FolderPlus,
  PlusCircle,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Disposable,
  Tree,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
  TreeItemRenderContext,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { MenuItemContextMenu } from './MenuItemContextMenu';
import { MenuItemDialog } from './MenuItemDialog';

interface MenuItemBuilderProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  onSelectItem?: (itemId: number) => void;
}

const convertToTreeData = (items: MenuItem[]) => {
  const treeItems: Record<string, TreeItem<MenuItem>> = {
    root: {
      index: 'root',
      canMove: false,
      isFolder: true,
      children: items.map((item) => item.id.toString()),
      data: { id: 0, name: 'Root', description: '', price: 0, isFolder: true },
      canRename: false,
    },
  };

  const processItem = (item: MenuItem) => {
    treeItems[item.id.toString()] = {
      index: item.id.toString(),
      canMove: true,
      isFolder: !!item.isFolder,
      children: item.children?.map((child) => child.id.toString()),
      data: item,
      canRename: true,
    };

    if (item.children) {
      item.children.forEach(processItem);
    }
  };

  items.forEach(processItem);
  return { items: treeItems };
};

const getAllItemIds = (items: MenuItem[]): string[] => {
  const ids: string[] = [];

  const processItem = (item: MenuItem) => {
    ids.push(item.id.toString());
    if (item.children) {
      item.children.forEach(processItem);
    }
  };

  items.forEach(processItem);
  return ids;
};

interface InlineEditFormProps {
  item: MenuItem;
  onSave: (data: { name: string; price: number }) => void;
  onCancel: () => void;
}

function InlineEditForm({ item, onSave, onCancel }: InlineEditFormProps) {
  const [data, setData] = useState({ name: item.name, price: item.price || 0 });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.name.trim()) {
      onSave(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 py-1">
      <div className="flex items-center gap-1">
        <Input
          ref={nameInputRef}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="h-7 text-sm"
          placeholder="Item name..."
        />
        {!item.isFolder && (
          <Input
            type="number"
            value={data.price || ''}
            onChange={(e) =>
              setData({ ...data, price: parseFloat(e.target.value) || 0 })
            }
            className="h-7 w-24 text-sm"
            placeholder="Price..."
            step="0.01"
            min="0"
          />
        )}
      </div>
      <div className="flex justify-end gap-1">
        <button type="submit" className="p-1 hover:text-primary">
          <Check className="size-4" />
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      </div>
    </form>
  );
}

class MenuDataProvider implements TreeDataProvider<MenuItem> {
  private treeChangeListeners: ((changedItemIds: TreeItemIndex[]) => void)[] =
    [];
  private data: Record<TreeItemIndex, TreeItem<MenuItem>>;

  constructor(items: MenuItem[]) {
    this.data = convertToTreeData(items).items;
  }

  public async getTreeItem(itemId: TreeItemIndex) {
    return this.data[itemId];
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[],
  ) {
    this.data[itemId].children = newChildren;
    this.treeChangeListeners.forEach((listener) => listener([itemId]));
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void,
  ): Disposable {
    this.treeChangeListeners.push(listener);
    return {
      dispose: () => {
        this.treeChangeListeners.splice(
          this.treeChangeListeners.indexOf(listener),
          1,
        );
      },
    };
  }

  public injectItem(parentId: TreeItemIndex, newItem: MenuItem) {
    const itemId = newItem.id.toString();
    this.data[itemId] = {
      index: itemId,
      canMove: true,
      isFolder: !!newItem.isFolder,
      children: newItem.children?.map((child) => child.id.toString()),
      data: newItem,
      canRename: true,
    };

    if (parentId) {
      this.data[parentId].children = [
        ...(this.data[parentId].children || []),
        itemId,
      ];
      this.treeChangeListeners.forEach((listener) => listener([parentId]));
    }
  }
}

interface MenuItemToolbarProps {
  onAddCategory: () => void;
}

function MenuItemToolbar({ onAddCategory }: MenuItemToolbarProps) {
  return (
    <div className="flex items-center gap-2 border-b p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddCategory}
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
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: 'category' | 'item';
    item?: MenuItem;
    parentId?: number;
  }>({ open: false, type: 'item' });
  const [addingToCategory, setAddingToCategory] = useState<number | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['root']);
  const [treeKey, setTreeKey] = useState(0);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<MenuItem[]>(items);

  // Update local items when props change
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const dataProvider = useMemo(
    () => new MenuDataProvider(localItems),
    [localItems],
  );

  const getMaxId = (items: MenuItem[]): number => {
    let maxId = 0;
    const processItem = (item: MenuItem) => {
      maxId = Math.max(maxId, item.id);
      if (item.children) {
        item.children.forEach(processItem);
      }
    };
    items.forEach(processItem);
    return maxId;
  };

  const updateItems = (newItems: MenuItem[]) => {
    setLocalItems(newItems);
    onChange(newItems);
    setTreeKey((prev) => prev + 1);
  };

  const handleAddCategory = () => {
    const newItem: MenuItem = {
      id: getMaxId(localItems) + 1,
      name: 'New Category',
      description: '',
      price: 0,
      isFolder: true,
      children: [],
    };

    setDialog({
      open: true,
      type: 'category',
      item: newItem,
    });

    updateItems([...localItems, newItem]);
  };

  const handleDrop = useCallback(
    (draggedItems: TreeItem<MenuItem>[], target: any) => {
      const processItems = (currentItems: MenuItem[]): MenuItem[] => {
        // Remove dragged items from their original positions
        const draggedIds = new Set(draggedItems.map((item) => item.data.id));
        const itemsWithoutDragged = currentItems.filter(
          (item) => !draggedIds.has(item.id),
        );

        // If dropping at root level
        if (target.targetType === 'root') {
          return [
            ...itemsWithoutDragged,
            ...draggedItems.map((item) => item.data),
          ];
        }

        // If dropping into a folder
        if (
          target.targetType === 'item-folder' ||
          target.targetType === 'folder'
        ) {
          return itemsWithoutDragged.map((item) => {
            if (item.id.toString() === target.targetItem.toString()) {
              return {
                ...item,
                children: [
                  ...(item.children || []),
                  ...draggedItems.map((draggedItem) => draggedItem.data),
                ],
              };
            }
            return item;
          });
        }

        // If dropping between items
        if (target.targetType === 'between-items') {
          const parentId = target.parentItem;
          return itemsWithoutDragged.map((item) => {
            if (item.id.toString() === parentId.toString()) {
              const newChildren = [...(item.children || [])];
              newChildren.splice(
                target.childIndex,
                0,
                ...draggedItems.map((draggedItem) => draggedItem.data),
              );
              return { ...item, children: newChildren };
            }
            return item;
          });
        }

        return itemsWithoutDragged;
      };

      const newItems = processItems(localItems);
      updateItems(newItems);
    },
    [localItems, updateItems],
  );

  const renderItem = ({
    item,
    title,
    arrow,
    depth,
    context,
    children,
  }: {
    item: TreeItem<MenuItem>;
    title: React.ReactNode;
    arrow: React.ReactNode;
    depth: number;
    context: TreeItemRenderContext<never>;
    children: React.ReactNode;
  }) => {
    const isCategory = item.isFolder;
    const menuItem = item.data;
    const isRoot = item.index === 'root';
    const isAdding = addingToCategory === menuItem.id;
    const isEditing = editingItemId === menuItem.id;
    const isSelected = focusedItem === item.index.toString();

    if (isRoot) {
      return <>{children}</>;
    }

    const itemContent = isEditing ? (
      <div
        className="relative flex w-full items-center"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {arrow}
        <InlineEditForm
          item={menuItem}
          onSave={(data) => handleQuickEdit(menuItem.id, data)}
          onCancel={() => {
            setEditingItemId(null);
            setSearchEnabled(true);
          }}
        />
      </div>
    ) : (
      <div
        {...context.itemContainerWithoutChildrenProps}
        {...context.interactiveElementProps}
        className={`group relative flex h-8 w-full items-center gap-2 rounded-md px-2 hover:bg-sidebar-accent ${
          isSelected ? 'bg-sidebar-accent' : ''
        } ${context.isDraggingOver ? 'bg-sidebar-accent/50' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditingItemId(menuItem.id);
          setSearchEnabled(false);
        }}
      >
        {arrow}
        {isCategory ? (
          <>
            <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-sm">{title}</span>
            <div className="invisible group-hover:visible">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddingToCategory(menuItem.id);
                  setSearchEnabled(false);
                }}
                className="h-6 px-2"
              >
                <PlusCircle className="size-3" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <UtensilsCrossed className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">{menuItem.name}</span>
            {menuItem.price > 0 && (
              <span className="shrink-0 text-sm text-muted-foreground">
                ${menuItem.price.toFixed(2)}
              </span>
            )}
          </>
        )}
      </div>
    );

    return (
      <SidebarMenuItem {...context.itemContainerWithChildrenProps}>
        <MenuItemContextMenu
          isCategory={isCategory}
          onEdit={() => handleEdit(menuItem)}
          onDelete={() => handleDelete(menuItem.id)}
          onMoveUp={() => handleMove(menuItem.id, 'up')}
          onMoveDown={() => handleMove(menuItem.id, 'down')}
        >
          {itemContent}
        </MenuItemContextMenu>
        {isCategory && (
          <SidebarMenuSub>
            {isAdding && (
              <div style={{ paddingLeft: `${(depth + 1) * 12 + 4}px` }}>
                <InlineEditForm
                  item={menuItem}
                  onSave={(data) => handleQuickAdd(menuItem.id, data)}
                  onCancel={() => {
                    setAddingToCategory(null);
                    setSearchEnabled(true);
                  }}
                />
              </div>
            )}
            {children}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };

  const handleEdit = (item: MenuItem) => {
    setDialog({
      open: true,
      type: item.isFolder ? 'category' : 'item',
      item,
    });
  };

  const handleDelete = (itemId: number) => {
    const deleteItem = (items: MenuItem[]): MenuItem[] => {
      return items.filter((item) => {
        if (item.id === itemId) return false;
        if (item.children) {
          item.children = deleteItem(item.children);
        }
        return true;
      });
    };

    updateItems(deleteItem(localItems));
  };

  const handleMove = (itemId: number, direction: 'up' | 'down') => {
    const moveItem = (items: MenuItem[]): MenuItem[] => {
      const index = items.findIndex((item) => item.id === itemId);
      if (index === -1) {
        return items.map((item) => {
          if (item.children) {
            return { ...item, children: moveItem(item.children) };
          }
          return item;
        });
      }

      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === items.length - 1)
      ) {
        return items;
      }

      const newItems = [...items];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[swapIndex]] = [
        newItems[swapIndex],
        newItems[index],
      ];

      return newItems;
    };

    updateItems(moveItem(localItems));
  };

  const handleQuickEdit = (
    itemId: number,
    data: { name: string; price: number },
  ) => {
    const updateItem = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            name: data.name,
            price: item.isFolder ? item.price : data.price,
          };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };

    updateItems(updateItem(localItems));
    setEditingItemId(null);
    setSearchEnabled(true);
  };

  const handleSave = (data: Partial<MenuItem>) => {
    const parentId = dialog.parentId;
    const isEditing = !!dialog.item;

    if (isEditing) {
      const updateItem = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
          if (item.id === dialog.item?.id) {
            return {
              ...item,
              ...data,
              isFolder: item.isFolder,
              children: item.children,
            };
          }
          if (item.children) {
            return { ...item, children: updateItem(item.children) };
          }
          return item;
        });
      };

      updateItems(updateItem(localItems));
    } else {
      const newItem: MenuItem = {
        id: getMaxId(localItems) + 1,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        isFolder: dialog.type === 'category',
        children: dialog.type === 'category' ? [] : undefined,
        category:
          dialog.type === 'category'
            ? undefined
            : localItems.find((i) => i.id === parentId)?.name,
      };

      if (parentId) {
        const addToParent = (items: MenuItem[]): MenuItem[] => {
          return items.map((item) => {
            if (item.id === parentId) {
              return {
                ...item,
                children: [...(item.children || []), newItem],
              };
            }
            if (item.children) {
              return { ...item, children: addToParent(item.children) };
            }
            return item;
          });
        };

        updateItems(addToParent(localItems));
      } else {
        updateItems([...localItems, newItem]);
      }
    }

    setDialog({ open: false, type: 'item' });
  };

  const handleQuickAdd = (
    categoryId: number,
    data: { name: string; price: number },
  ) => {
    const parentCategory = localItems.find((i) => i.id === categoryId);
    const newItem: MenuItem = {
      id: getMaxId(localItems) + 1,
      name: data.name,
      description: '',
      price: data.price,
      category: parentCategory?.name,
    };

    const addToParent = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === categoryId) {
          return {
            ...item,
            children: [...(item.children || []), newItem],
          };
        }
        if (item.children) {
          return { ...item, children: addToParent(item.children) };
        }
        return item;
      });
    };

    updateItems(addToParent(localItems));
    setAddingToCategory(null);
    setSearchEnabled(true);
  };

  return (
    <div className="flex h-full flex-col">
      <MenuItemToolbar onAddCategory={handleAddCategory} />
      <div className="flex-1">
        <SidebarContent className="h-full">
          <SidebarGroup>
            <SidebarGroupContent>
              <UncontrolledTreeEnvironment<MenuItem>
                canDragAndDrop
                canDropOnFolder
                canReorderItems
                dataProvider={dataProvider}
                getItemTitle={(item) => item.data.name}
                viewState={{
                  ['menu-tree']: {
                    expandedItems,
                    selectedItems: focusedItem ? [focusedItem] : [],
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
                  const selectedId = parseInt(items[0].toString());
                  if (!isNaN(selectedId) && onSelectItem) {
                    onSelectItem(selectedId);
                  }
                }}
                onDrop={handleDrop}
                renderItemArrow={({ item, context }) =>
                  item.isFolder ? (
                    <span {...context.arrowProps} className="mr-1">
                      {context.isExpanded ? (
                        <ChevronDown className="size-3" />
                      ) : (
                        <ChevronRight className="size-3" />
                      )}
                    </span>
                  ) : null
                }
                renderItem={renderItem}
                renderTreeContainer={({ children, containerProps }) => (
                  <SidebarMenu {...containerProps}>{children}</SidebarMenu>
                )}
                canSearch={searchEnabled}
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
      <MenuItemDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, type: 'item' })}
        onSave={handleSave}
        item={dialog.item}
        isCategory={dialog.type === 'category'}
      />
    </div>
  );
}
