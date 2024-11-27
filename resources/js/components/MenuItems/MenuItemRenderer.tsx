import { Button } from '@/components/ui/button';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  FolderIcon,
  PlusCircle,
  UtensilsCrossed,
} from 'lucide-react';
import { TreeItem, TreeItemRenderContext } from 'react-complex-tree';
import { MenuItemContextMenu } from './MenuItemContextMenu';
import { QuickAddForm } from './QuickAddForm';
import { MenuItem } from './types';

interface RenderItemArrowProps {
  item: TreeItem<MenuItem>;
  context: TreeItemRenderContext<never>;
}

export function RenderItemArrow({ item, context }: RenderItemArrowProps) {
  if (!item.isFolder) return null;
  return (
    <div
      {...context.arrowProps}
      className="flex size-4 items-center justify-center"
    >
      {context.isExpanded ? (
        <ChevronDown className="size-3" />
      ) : (
        <ChevronRight className="size-3" />
      )}
    </div>
  );
}

interface MenuItemRendererProps {
  item: TreeItem<MenuItem>;
  depth: number;
  context: TreeItemRenderContext<never>;
  children: React.ReactNode;
  addingToCategory: number | null;
  setAddingToCategory: (id: number | null) => void;
  handleQuickAdd: (
    menuItem: MenuItem,
    data: { name: string; price: number },
  ) => void;
}

interface RenderItemProps {
  item: TreeItem<MenuItem>;
}

interface RenderItemFolderProps extends RenderItemProps {
  setAddingToCategory: (id: number | null) => void;
}

function RenderItemFolder({
  item,
  setAddingToCategory,
}: RenderItemFolderProps) {
  return (
    <>
      <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 items-center gap-x-1">
        <span className="truncate">{item.data.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setAddingToCategory(item.data.id);
          }}
        >
          <PlusCircle className="size-3" />
        </Button>
      </div>
    </>
  );
}

function RenderItem({ item }: RenderItemProps) {
  return (
    <>
      <UtensilsCrossed className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 items-center justify-between gap-4">
        <span className="truncate">{item.data.name}</span>
        {item.data.price && item.data.price > 0 && (
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
            ${item.data.price.toFixed(2)}
          </span>
        )}
      </div>
    </>
  );
}

export function MenuItemRenderer({
  item,
  depth,
  context,
  children,
  addingToCategory,
  setAddingToCategory,
  handleQuickAdd,
}: MenuItemRendererProps) {
  const isRoot = item.index === 'root';
  const isSelected = context.isSelected;

  if (isRoot) {
    return <>{children}</>;
  }

  return (
    <>
      <SidebarMenuItem>
        <MenuItemContextMenu
          isCategory={item.isFolder}
          onEdit={() => {}}
          onDelete={() => {}}
          onMoveUp={() => {}}
          onMoveDown={() => {}}
        >
          <SidebarMenuButton
            {...context.itemContainerWithoutChildrenProps}
            {...context.interactiveElementProps}
            isActive={isSelected}
            className={cn(
              'group relative',
              context.isDraggingOver && 'bg-sidebar-accent/50',
            )}
            style={{
              paddingLeft: depth > 0 ? `${depth * 16}px` : undefined,
            }}
            type="button"
            size="default"
          >
            <RenderItemArrow item={item} context={context} />

            <div className="flex w-full items-center gap-2">
              {item.isFolder ? (
                <RenderItemFolder
                  item={item}
                  setAddingToCategory={setAddingToCategory}
                />
              ) : (
                <RenderItem item={item} />
              )}
            </div>
          </SidebarMenuButton>
        </MenuItemContextMenu>
      </SidebarMenuItem>

      {addingToCategory === item.data.id && (
        <SidebarMenuItem>
          <div
            className={cn(
              'my-2 rounded-sm bg-sidebar-accent',
              depth > 0 ? `ml-[${(depth + 1) * 16}px]` : 'ml-8',
            )}
          >
            <QuickAddForm
              parentId={item.data.id}
              onSubmit={(data) => {
                //console.log({ data });
                handleQuickAdd(item.data, data);
              }}
              onCancel={() => setAddingToCategory(null)}
            />
          </div>
        </SidebarMenuItem>
      )}
      {item.isFolder && children && <SidebarMenuSub>{children}</SidebarMenuSub>}
    </>
  );
}
