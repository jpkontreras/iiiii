import { cn } from '@/lib/utils';
import { MenuItem } from '@/types';
import {
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Folder,
  FolderOpen,
  MoveVertical,
  Package,
  PackageOpen,
  Plus,
  Settings,
  Trash2,
  Utensils,
} from 'lucide-react';
import { useState } from 'react';
import { TreeItem, TreeRenderProps } from 'react-complex-tree';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

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
  selectedItem?: TreeItem<EnhancedMenuItem>;
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
  const isModifierGroup =
    item.data.type === MenuItemType.MODIFIER &&
    item.children &&
    item.children.length > 0;

  // If this is a modifier group header, render it differently
  if (isModifierGroup) {
    return (
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2 border-b border-border/50 pb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {getModifierGroupLabel(item.data.path)}
          </span>
        </div>
      </div>
    );
  }

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

// Add this interface for the operations
interface SpecialItemRowProps {
  item: TreeItem<EnhancedMenuItem>;
  depth: number;
}

// Add this type for the form
interface ItemFormData {
  name: string;
  price: string | null;
  description: string | null;
}

// Add this helper function
function formatPath(path: string) {
  return path.split('/').filter(Boolean).join(' → ');
}

// Add this helper function to get a friendly item type label
function getItemTypeLabel(type: MenuItemType) {
  switch (type) {
    case MenuItemType.CATEGORY:
      return 'Category';
    case MenuItemType.COMPOSITE:
      return 'Combo';
    case MenuItemType.ITEM:
      return 'Item';
    case MenuItemType.OPTION:
      return 'Option';
    case MenuItemType.MODIFIER:
      return 'Modifier';
    default:
      return type;
  }
}

// Add this helper to get the modifier group label
function getModifierGroupLabel(path: string) {
  const parts = path.split('/');
  const modifierType = parts[parts.length - 2]; // Get the parent segment
  return modifierType === 'size' ? 'Size Options' : 'Add-ons';
}

// Replace the existing SpecialItemRow with this enhanced version
function SpecialItemRow({ item, depth }: SpecialItemRowProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    name: item.data.name,
    price: item.data.price?.toString() ?? null,
    description: item.data.description,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const canAddChild =
    depth < 3 && ['category', 'composite', 'item'].includes(item.data.type);
  const canEdit = true;
  const canDelete = depth > 0;
  const canMove = depth > 0;

  const handleAdd = () => {
    const newItemType = item.data.type === 'item' ? 'option' : 'item';
    console.log('Add new', newItemType, 'under', item.data.name);
  };

  const handleSave = () => {
    console.log('Save', formData);
  };

  const formattedPath = formatPath(item.data.path);

  return (
    <div className="flex flex-col bg-muted/30">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        {/* Header with Item Info and Quick Actions */}
        <div className="relative flex items-center justify-between gap-2 border-b border-border/50 px-4 py-2">
          {/* Visual connector to the item */}
          <div
            className="absolute -top-px left-[24px] h-[2px] w-4 bg-border"
            style={{ left: `${(depth + 1) * 20}px` }}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 truncate text-xs text-muted-foreground">
                <Badge
                  variant={
                    item.data.type === 'category' ? 'default' : 'secondary'
                  }
                  className="shrink-0"
                >
                  {getItemTypeLabel(item.data.type)}
                </Badge>
                <span className="truncate font-medium">{item.data.name}</span>
                {item.data.price && (
                  <span className="shrink-0 tabular-nums">
                    ${Number(item.data.price).toFixed(2)}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    item.data.type === 'category' ? 'default' : 'secondary'
                  }
                >
                  {getItemTypeLabel(item.data.type)}
                </Badge>
                <span className="font-medium">{item.data.name}</span>
                {item.data.price && (
                  <span className="tabular-nums">
                    ${Number(item.data.price).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Path: {formatPath(item.data.path)}
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            {canAddChild && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleAdd}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Add {item.data.type === 'item' ? 'option' : 'item'}
                </TooltipContent>
              </Tooltip>
            )}
            {canMove && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoveVertical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Move {item.data.name}</TooltipContent>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-destructive/90 hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete {item.data.name}</TooltipContent>
              </Tooltip>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Collapsible Form - Updated height and padding */}
        <CollapsibleContent>
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col gap-3 p-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="sticky bottom-0 bg-muted/30 pt-3">
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function MenuTreeRenderer({
  item,
  depth,
  context,
  children,
  selectedItem,
  ...props
}: MenuTreeRendererProps) {
  const bgColor = getBackgroundColor(depth);
  const isItemSelected = context.isSelected;
  const isExpanded = context.isExpanded;

  return (
    <>
      <SidebarMenuItem className="border-b border-gray-100">
        <SidebarMenuButton
          {...context.itemContainerWithoutChildrenProps}
          {...context.interactiveElementProps}
          isActive={isItemSelected}
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

      {isItemSelected && isExpanded && (
        <div className="border-b border-gray-100">
          <SpecialItemRow item={item} depth={depth} />
        </div>
      )}

      {[MenuItemType.CATEGORY, MenuItemType.COMPOSITE].includes(
        item.data.type,
      ) &&
        children && <>{children}</>}
    </>
  );
}
