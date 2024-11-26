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
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Disposable,
  Tree,
  TreeDataProvider,
  TreeInformation,
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

interface InlineFormProps {
  onSave: (data: { name: string; price: number }) => void;
  onCancel: () => void;
}

function InlineItemForm({ onSave, onCancel }: InlineFormProps) {
  const [data, setData] = useState({ name: '', price: 0 });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.name.trim()) {
      onSave(data);
      setData({ name: '', price: 0 });
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
      </div>
      <div className="flex justify-end gap-1">
        <button type="submit" className="p-1 hover:text-primary">
          <Check className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setData({ name: '', price: 0 });
            onCancel();
          }}
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

export function MenuItemBuilder({
  items,
  onChange,
  onSelectItem,
}: MenuItemBuilderProps) {
  const dataProvider = useMemo(() => new MenuDataProvider(items), [items]);

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

  useEffect(() => {
    setExpandedItems(['root', ...getAllItemIds(items)]);
    setTreeKey((prev) => prev + 1);
  }, [items]);

  const updateItems = (newItems: MenuItem[]) => {
    onChange(newItems);
  };

  const handleAddCategory = () => {
    const newItem: MenuItem = {
      id: getMaxId(items) + 1,
      name: 'New Category',
      description: '',
      price: 0,
      isFolder: true,
      children: [],
    };

    updateItems([...items, newItem]);
    setDialog({
      open: true,
      type: 'category',
      item: newItem,
    });
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

    updateItems(deleteItem(items));
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

    updateItems(moveItem(items));
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

      updateItems(updateItem(items));
    } else {
      const newItem: MenuItem = {
        id: getMaxId(items) + 1,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        isFolder: dialog.type === 'category',
        children: dialog.type === 'category' ? [] : undefined,
        category:
          dialog.type === 'category'
            ? undefined
            : items.find((i) => i.id === parentId)?.name,
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

        updateItems(addToParent(items));
      } else {
        updateItems([...items, newItem]);
      }
    }

    setDialog({ open: false, type: 'item' });
  };

  const handleQuickAdd = (
    categoryId: number,
    data: { name: string; price: number },
  ) => {
    const parentCategory = items.find((i) => i.id === categoryId);
    const newItem: MenuItem = {
      id: getMaxId(items) + 1,
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

    updateItems(addToParent(items));
    setAddingToCategory(null);
    setSearchEnabled(true);
  };

  const renderItem = ({
    item,
    title,
    arrow,
    depth,
    context,
    children,
    info,
  }: {
    item: TreeItem<MenuItem>;
    title: React.ReactNode;
    arrow: React.ReactNode;
    depth: number;
    context: TreeItemRenderContext<never>;
    children: React.ReactNode;
    info: TreeInformation;
  }) => {
    const isCategory = item.isFolder;
    const menuItem = item.data;
    const isRoot = item.index === 'root';
    const isAdding = addingToCategory === menuItem.id;

    if (isRoot) {
      return <>{children}</>;
    }

    const itemContent = (
      <div
        {...context.itemContainerWithoutChildrenProps}
        {...context.interactiveElementProps}
        className="group relative flex h-8 w-full items-center gap-2 rounded-md px-2 hover:bg-sidebar-accent"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
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
                <InlineItemForm
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

  return (
    <div className="flex h-full flex-col">
      <MenuItemToolbar onAddCategory={handleAddCategory} />
      <div className="flex-1">
        <UncontrolledTreeEnvironment<MenuItem>
          key={treeKey}
          canDragAndDrop
          canDropOnFolder
          canReorderItems
          dataProvider={dataProvider}
          getItemTitle={(item) => item.data.name}
          viewState={{
            ['menu-tree']: {
              expandedItems,
            },
          }}
          onExpandItem={(item) => {
            const newExpanded = [...expandedItems, item.toString()];
            setExpandedItems(newExpanded);
          }}
          onCollapseItem={(item) => {
            const newExpanded = expandedItems.filter(
              (id) => id !== item.toString(),
            );
            setExpandedItems(newExpanded);
          }}
          onPrimaryAction={(item: TreeItem<MenuItem>, treeId: string) => {
            const selectedId = parseInt(item.index);
            if (!isNaN(selectedId) && onSelectItem) {
              onSelectItem(selectedId);
            }
          }}
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
            <SidebarContent className="h-full flex-1">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu {...containerProps}>{children}</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          )}
          canSearch={searchEnabled}
        >
          <Tree treeId="menu-tree" rootItem="root" treeLabel="Menu Items" />
        </UncontrolledTreeEnvironment>
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
