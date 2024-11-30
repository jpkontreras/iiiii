import { cn } from '@/lib/utils';
import { MenuItem } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TreeItem, TreeRenderProps } from 'react-complex-tree';
import { MenuItemContextMenu } from '../MenuItems/MenuItemContextMenu';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '../ui/sidebar';

interface MenuTreeRendererProps extends TreeRenderProps {
  item: TreeItem<MenuItem>;
  icon?: React.ReactNode;
  context: {
    isSelected: boolean;
    isFocused: boolean;
    isExpanded: boolean;
    isDraggingOver: boolean;
    arrowProps: React.HTMLAttributes<HTMLDivElement>;
    itemContainerWithoutChildrenProps: React.HTMLAttributes<HTMLElement>;
    interactiveElementProps: React.HTMLAttributes<HTMLElement>;
  };
  depth: number;
  children?: React.ReactNode;
}

interface RenderItemProps {
  item: TreeItem<MenuItem>;
  context: MenuTreeRendererProps['context'];
}

function RenderItemArrow({ item, context }: RenderItemProps) {
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

function RenderItem({
  item,
  icon,
}: {
  item: TreeItem<MenuItem>;
  icon?: React.ReactNode;
}) {
  return (
    <>
      {icon}
      <div className="flex flex-1 items-center justify-between gap-4">
        <span className="truncate">{item.data.name}</span>
        {item.data.price && Number(item.data.price) > 0 && (
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
            ${Number(item.data.price).toFixed(2)}
          </span>
        )}
      </div>
    </>
  );
}

export function MenuTreeRenderer({
  item,
  depth,
  context,
  children,
  icon,
  ...props
}: MenuTreeRendererProps) {
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
              <RenderItem item={item} icon={icon} />
            </div>
          </SidebarMenuButton>
        </MenuItemContextMenu>
      </SidebarMenuItem>
      {item.isFolder && children && <SidebarMenuSub>{children}</SidebarMenuSub>}
    </>
  );
}
