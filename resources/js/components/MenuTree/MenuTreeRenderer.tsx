import { cn } from '@/lib/utils';
import { MenuItem } from '@/types';
import {
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Folder,
  FolderOpen,
  Package,
  PackageOpen,
  Settings,
  Utensils,
} from 'lucide-react';
import { TreeItem, TreeRenderProps } from 'react-complex-tree';
import { Button } from '../ui/button';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';

// Add an enum to strictly type the menu item types
enum MenuItemType {
  CATEGORY = 'category',
  COMPOSITE = 'composite',
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
  if (![MenuItemType.CATEGORY, MenuItemType.COMPOSITE].includes(item.data.type))
    return null;

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

function getItemIcon(type: MenuItemType, expanded?: boolean) {
  // Create a unique key for switch comparison
  const key = `${type}${expanded ? ':expanded' : ''}`;

  switch (key) {
    // Categories
    case `${MenuItemType.CATEGORY}:expanded`:
      return <FolderOpen className="size-4" />;
    case MenuItemType.CATEGORY:
      return <Folder className="size-4" />;

    // Categories
    case `${MenuItemType.COMPOSITE}:expanded`:
      return <PackageOpen className="size-4" />;
    case MenuItemType.COMPOSITE:
      return <Package className="size-4" />;

    // Items
    case `${MenuItemType.ITEM}:expanded`:
      return <Utensils className="size-4" />;
    case MenuItemType.ITEM:
      return <Utensils className="size-4" />;

    // Options
    case `${MenuItemType.OPTION}:expanded`:
      return <Settings className="size-4" />;
    case MenuItemType.OPTION:
      return <Settings className="size-4 text-muted-foreground" />;

    // Modifiers
    case `${MenuItemType.MODIFIER}:expanded`:
      return <Settings className="size-4 rotate-45" />;
    case MenuItemType.MODIFIER:
      return <Settings className="size-4 rotate-45 text-muted-foreground" />;

    default:
      return <Folder className="size-4" />;
  }
}

function getItemStyle(depth: number, type: MenuItemType) {
  const baseStyle = {
    fontSize: '15px',
    fontWeight: 400,
  };

  switch (type) {
    case MenuItemType.CATEGORY:
    case MenuItemType.COMPOSITE:
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
    case MenuItemType.COMPOSITE:
      return { count: item.children.length, type: 'categories' };
    case MenuItemType.ITEM:
      return { count: item.children.length, type: 'options' };
    default:
      return { count: 0, type: 'items' };
  }
}

function RenderCompositeIcon({
  type,
  isExpanded,
}: {
  type: MenuItemType;
  isExpanded: boolean;
}) {
  return (
    <div className="flex size-4 items-center justify-center">
      {getItemIcon(type, isExpanded)}
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
  const { isExpanded } = context;
  const { count, type } = getItemCount(item);

  return (
    <div className="flex items-center gap-1">
      <RenderCompositeIcon type={item.data.type} isExpanded={isExpanded} />
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

function getItemPrice(
  item: TreeItem<EnhancedMenuItem>,
  context: MenuTreeRendererProps['context'],
): { basePrice: number; modifiersTotal: number } {
  const basePrice = Number(item.data.price || 0);
  let modifiersTotal = 0;

  if (item.children?.length && item.data.type === MenuItemType.ITEM) {
    item.children.forEach((childId) => {
      const modifier = context.getItem(childId);
      if (modifier?.data.price) {
        modifiersTotal += Number(modifier.data.price);
      }
    });
  }

  return { basePrice, modifiersTotal };
}

function RenderPrice({
  basePrice,
  modifiersTotal,
  type,
}: {
  basePrice: number;
  modifiersTotal: number;
  type: MenuItemType;
}) {
  if (basePrice === 0 && modifiersTotal === 0) return null;

  const totalPrice = basePrice + modifiersTotal;
  const prefix = type === MenuItemType.OPTION ? '+' : '';
  const priceText = `${prefix}$${totalPrice.toFixed(2)}`;
  const tooltip =
    modifiersTotal > 0
      ? `Base: $${basePrice.toFixed(2)} + Modifiers: $${modifiersTotal.toFixed(2)}`
      : undefined;

  return (
    <div className="ml-auto">
      <span
        className="shrink-0 text-sm tabular-nums text-muted-foreground"
        title={tooltip}
      >
        {priceText}
      </span>
    </div>
  );
}

function RenderActions({ isSelected }: { isSelected: boolean }) {
  const className = `p-6 hidden group-hover:flex  ${isSelected ? 'flex' : ''}`;
  return (
    <Button
      variant="link"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log({ done: true });
      }}
    >
      <Ellipsis size="6" />
    </Button>
  );
}

function RenderItem({
  item,
  depth,
  context,
}: {
  item: TreeItem<EnhancedMenuItem>;
  depth: number;
  isExpanded: boolean;
  context: MenuTreeRendererProps['context'];
}) {
  const itemStyle = getItemStyle(depth, item.data.type);
  const { basePrice, modifiersTotal } = getItemPrice(item, context);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <RenderItemIcon item={item} context={context} />
        <span className="truncate" style={itemStyle}>
          {item.data.name}
        </span>
      </div>
      <RenderPrice
        basePrice={basePrice}
        modifiersTotal={modifiersTotal}
        type={item.data.type}
      />
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

  return (
    <>
      <SidebarMenuItem className="border-b border-gray-100">
        <SidebarMenuButton
          {...context.itemContainerWithoutChildrenProps}
          {...context.interactiveElementProps}
          isActive={context.isSelected}
          className={cn(
            'group relative cursor-pointer py-3',
            'transition-all duration-200 hover:scale-x-[1.01] hover:bg-black/[0.05]',
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
      {[MenuItemType.CATEGORY, MenuItemType.COMPOSITE].includes(
        item.data.type,
      ) &&
        children && <>{children}</>}
    </>
  );
}
