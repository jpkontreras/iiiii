import { cn } from '@/lib/utils';
import { MenuItem } from '@/types';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Settings,
  Utensils,
} from 'lucide-react';
import { TreeItem, TreeRenderProps } from 'react-complex-tree';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';

// Add an enum to strictly type the menu item types
enum MenuItemType {
  CATEGORY = 'category',
  ITEM = 'item',
  OPTION = 'option',
  MODIFIER = 'modifier',
}

// Update the MenuItem type to include the type field
interface EnhancedMenuItem extends MenuItem {
  type: MenuItemType;
}

interface MenuTreeRendererProps extends TreeRenderProps {
  item: TreeItem<EnhancedMenuItem>;
  icon?: React.ReactNode;
  context: {
    isSelected: boolean;
    isFocused: boolean;
    isExpanded: boolean;
    isDraggingOver: boolean;
    arrowProps: React.HTMLAttributes<HTMLDivElement>;
    itemContainerWithoutChildrenProps: React.HTMLAttributes<HTMLElement>;
    interactiveElementProps: React.HTMLAttributes<HTMLElement>;
    treeId: string;
    getItemTitle: (item: TreeItem<any>) => string;
    getItem: (itemId: string | number) => TreeItem<any>;
  };
  depth: number;
  children?: React.ReactNode;
}

interface RenderItemProps {
  item: TreeItem<EnhancedMenuItem>;
  context: MenuTreeRendererProps['context'];
}

function RenderItemArrow({ item, context }: RenderItemProps) {
  if (item.data.type !== MenuItemType.CATEGORY) return null;

  return (
    <div
      {...context.arrowProps}
      className="flex size-4 items-center justify-center transition-transform duration-300"
    >
      {context.isExpanded ? (
        <ChevronDown className="size-3" />
      ) : (
        <ChevronRight className="size-3" />
      )}
    </div>
  );
}

function getItemIcon(type: MenuItemType) {
  switch (type) {
    case MenuItemType.CATEGORY:
      return <Folder className="size-4" />;
    case MenuItemType.ITEM:
      return <Utensils className="size-4" />;
    case MenuItemType.OPTION:
      return <Settings className="size-4 text-muted-foreground" />;
    case MenuItemType.MODIFIER:
      return <Settings className="size-4 rotate-45 text-muted-foreground" />;
    default:
      return <Settings className="size-4" />;
  }
}

function getItemStyle(depth: number, type: MenuItemType) {
  const baseStyle = {
    fontSize: '15px',
    fontWeight: 400,
  };

  switch (type) {
    case MenuItemType.CATEGORY:
      return {
        ...baseStyle,
        fontSize: depth === 0 ? '18px' : '16px',
        fontWeight: depth === 0 ? 600 : 500,
      };
    case MenuItemType.ITEM:
      return { ...baseStyle, fontSize: '15px', fontWeight: 400 };
    case MenuItemType.OPTION:
      return { ...baseStyle, fontSize: '14px', fontStyle: 'italic' as const };
  }
}

function getItemCount(item: TreeItem<EnhancedMenuItem>): {
  count: number;
  type: 'items' | 'options' | 'categories';
} {
  if (!item.children?.length) return { count: 0, type: 'items' };

  switch (item.data.type) {
    case MenuItemType.CATEGORY:
      return { count: item.children.length, type: 'categories' };
    case MenuItemType.ITEM:
      return { count: item.children.length, type: 'options' };
    default:
      return { count: 0, type: 'items' };
  }
}

function hasModifiers(item: TreeItem<EnhancedMenuItem>): boolean {
  if (!item.children?.length) return false;
  return item.children.some((childId) => {
    const child = item.context?.getItem(childId);
    return (
      child?.data.type === MenuItemType.MODIFIER ||
      child?.data.type === MenuItemType.OPTION
    );
  });
}

function RenderCompositeIcon({
  type,
  hasModifiers,
}: {
  type: MenuItemType;
  hasModifiers: boolean;
}) {
  if (type === MenuItemType.CATEGORY && hasModifiers) {
    return (
      <div className="relative flex size-4 items-center justify-center">
        <Folder className="size-4" />
        <Utensils className="absolute bottom-0 right-0 size-2.5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex size-4 items-center justify-center">
      {getItemIcon(type)}
    </div>
  );
}

function RenderItemIcon({
  item,
  context,
}: {
  item: TreeItem<EnhancedMenuItem>;
  context: MenuTreeRendererProps['context'];
}) {
  const { count, type } = getItemCount(item);
  const showComposite =
    item.data.type === MenuItemType.CATEGORY && hasModifiers(item);

  return (
    <div className="flex items-center gap-1">
      <RenderCompositeIcon type={item.data.type} hasModifiers={showComposite} />
      {count > 0 && (
        <span
          className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] tabular-nums text-muted-foreground"
          title={`${count} ${type}`}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function RenderItem({
  item,
  depth,
  isExpanded,
  context,
}: {
  item: TreeItem<EnhancedMenuItem>;
  depth: number;
  isExpanded: boolean;
  context: MenuTreeRendererProps['context'];
}) {
  const itemStyle = getItemStyle(depth, item.data.type);

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex items-center gap-2">
        <RenderItemIcon item={item} context={context} />
        <span className="truncate" style={itemStyle}>
          {item.data.name}
        </span>
      </div>
      {item.data.type === MenuItemType.ITEM &&
        item.data.price &&
        Number(item.data.price) > 0 && (
          <div className="ml-auto">
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              ${Number(item.data.price).toFixed(2)}
            </span>
          </div>
        )}
      {item.data.type === MenuItemType.OPTION &&
        item.data.price &&
        Number(item.data.price) > 0 && (
          <div className="ml-auto">
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              +${Number(item.data.price).toFixed(2)}
            </span>
          </div>
        )}
    </div>
  );
}

function getBackgroundColor(depth: number) {
  switch (depth) {
    case 0:
      return 'bg-white';
    case 1:
      return 'bg-black/[0.02]';
    case 2:
      return 'bg-black/[0.04]';
    case 3:
      return 'bg-black/[0.06]';
    default:
      return 'bg-black/[0.06]';
  }
}

export function MenuTreeRenderer({
  item,
  depth,
  context,
  children,
  ...props
}: MenuTreeRendererProps) {
  const bgColor = getBackgroundColor(depth);

  // Validate menu structure
  const validateMenuStructure = () => {
    const hasChildrenOfDifferentTypes =
      children &&
      Array.isArray(children) &&
      children.some(
        (child: any) =>
          child.props.item.data.type !== children[0].props.item.data.type,
      );

    if (hasChildrenOfDifferentTypes) {
      console.warn('Invalid menu structure: Mixed types at the same level');
    }

    if (item.data.type === MenuItemType.OPTION && children) {
      console.error('Options cannot have children');
    }
  };

  validateMenuStructure();

  return (
    <>
      <SidebarMenuItem className="border-b border-gray-100">
        <SidebarMenuButton
          {...context.itemContainerWithoutChildrenProps}
          {...context.interactiveElementProps}
          isActive={context.isSelected}
          className={cn(
            'group relative cursor-pointer py-3',
            'transition-all duration-200 hover:scale-[1.02] hover:bg-black/[0.05]',
            bgColor,
            context.isDraggingOver && 'bg-sidebar-accent/50',
          )}
          style={{
            paddingLeft: depth > 0 ? `${depth * 20}px` : undefined,
          }}
          type="button"
          size="default"
        >
          <RenderItemArrow item={item} context={context} />
          <RenderItem
            item={item}
            depth={depth}
            isExpanded={context.isExpanded}
            context={context}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
      {item.data.type === MenuItemType.CATEGORY && children && <>{children}</>}
    </>
  );
}
