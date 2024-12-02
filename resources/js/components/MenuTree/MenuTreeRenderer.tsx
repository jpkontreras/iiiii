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
  };
  depth: number;
  children?: React.ReactNode;
}

interface RenderItemProps {
  item: TreeItem<EnhancedMenuItem>;
  context: MenuTreeRendererProps['context'];
}

function RenderItemArrow({ item, context }: RenderItemProps) {
  // Only categories should have arrows
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

function RenderItem({
  item,
  depth,
}: {
  item: TreeItem<EnhancedMenuItem>;
  depth: number;
}) {
  const itemStyle = getItemStyle(depth, item.data.type);
  const icon = getItemIcon(item.data.type);

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="flex w-4 items-center justify-center">{icon}</div>
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
          <RenderItem item={item} depth={depth} />
        </SidebarMenuButton>
      </SidebarMenuItem>
      {item.data.type === MenuItemType.CATEGORY && children && <>{children}</>}
    </>
  );
}
