import { Button } from '@/components/ui/button';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { FlatMenuItem } from '@/types/menu-items';
import {
  ChevronDown,
  ChevronRight,
  FolderIcon,
  PlusCircle,
  UtensilsCrossed,
} from 'lucide-react';
import {
  TreeEnvironmentRef,
  TreeItem,
  TreeItemRenderContext,
} from 'react-complex-tree';
import { MenuItemContextMenu } from './MenuItemContextMenu';
import { QuickAddForm } from './QuickAddForm';

interface RenderItemArrowProps {
  item: TreeItem<FlatMenuItem>;
  context: TreeItemRenderContext<never>;
}

interface MenuItemRendererProps {
  item: TreeItem<FlatMenuItem>;
  depth: number;
  context: TreeItemRenderContext<never>;
  children: React.ReactNode;
  addingToCategory: number | null;
  setAddingToCategory: (id: number | null) => void;
  handleQuickAdd: (
    parentItem: FlatMenuItem,
    data: { name: string; price: number },
  ) => void;
  environment: React.RefObject<TreeEnvironmentRef<FlatMenuItem>>;
}

interface RenderItemFolderProps {
  item: TreeItem<FlatMenuItem>;
  setAddingToCategory: (id: number | null) => void;
  environment: React.RefObject<TreeEnvironmentRef<FlatMenuItem>>;
}

function RenderItemArrow({ item, context }: RenderItemArrowProps) {
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

function RenderItemFolder({
  item,
  setAddingToCategory,
  environment,
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
            if (environment.current) {
              environment.current.expandItem(
                item.data.id.toString(),
                'menu-tree',
              );
            }
            setAddingToCategory(item.data.id);
          }}
        >
          <PlusCircle className="size-3" />
        </Button>
      </div>
    </>
  );
}

function RenderItem({ item }: { item: TreeItem<FlatMenuItem> }) {
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
  environment,
}: MenuItemRendererProps) {
  if (item.index === 'root') return <>{children}</>;

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
            isActive={context.isSelected}
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
                  environment={environment}
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
              onSubmit={(data) => handleQuickAdd(item.data, data)}
              onCancel={() => setAddingToCategory(null)}
            />
          </div>
        </SidebarMenuItem>
      )}
      {item.isFolder && children && <SidebarMenuSub>{children}</SidebarMenuSub>}
    </>
  );
}
