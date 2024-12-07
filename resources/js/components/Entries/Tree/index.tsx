import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MenuEntry } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Tree, UncontrolledTreeEnvironment } from 'react-complex-tree';
import { MenuTreeDataProvider } from './MenuTreeDataProvider';

interface MenuTreeProps {
  items: MenuEntry[];
  onItemsChange?: (items: MenuEntry[]) => void;
}

type MenuItemType = 'category' | 'item' | 'modifier';

interface ItemStyle {
  fontSize: string;
  fontWeight: number;
  textTransform?: 'uppercase' | 'none';
  fontStyle?: 'italic' | 'normal';
}

function getItemStyle(depth: number, type: MenuItemType): ItemStyle {
  const baseStyle: ItemStyle = {
    fontSize: '15px',
    fontWeight: 400,
    textTransform: 'none',
    fontStyle: 'normal',
  };

  switch (type) {
    case 'category':
      return {
        ...baseStyle,
        fontSize: depth === 0 ? '18px' : '16px',
        fontWeight: depth === 0 ? 600 : 500,
        textTransform: 'uppercase',
      };
    case 'item':
      return {
        ...baseStyle,
        fontSize: '15px',
        fontWeight: 400,
      };
    case 'modifier':
      return {
        ...baseStyle,
        fontSize: '14px',
        fontWeight: 300,
        fontStyle: 'italic',
      };
    default:
      return baseStyle;
  }
}

function MenuTree({ items, onItemsChange }: MenuTreeProps) {
  const dataProvider = useMemo(() => new MenuTreeDataProvider(items), [items]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const getItemClasses = (type: MenuItemType, depth: number) => {
    const style = getItemStyle(depth, type);
    return cn(
      'text-base',
      {
        'text-lg': style.fontSize === '18px',
        'text-base': style.fontSize === '16px',
        'text-sm': style.fontSize === '14px',
      },
      {
        'font-semibold': style.fontWeight === 600,
        'font-medium': style.fontWeight === 500,
        'font-normal': style.fontWeight === 400,
        'font-light': style.fontWeight === 300,
      },
      {
        uppercase: style.textTransform === 'uppercase',
        italic: style.fontStyle === 'italic',
      },
    );
  };

  return (
    <UncontrolledTreeEnvironment<MenuEntry>
      dataProvider={dataProvider}
      getItemTitle={(item) => item.data.name}
      viewState={{
        ['menu-tree']: {
          expandedItems,
        },
      }}
      canDragAndDrop={false}
      canDropOnFolder={false}
      canReorderItems={false}
      onExpandItem={(item) => {
        setExpandedItems((prev) => [...prev, item.index as string]);
      }}
      onCollapseItem={(item) => {
        setExpandedItems((prev) =>
          prev.filter((i) => i !== (item.index as string)),
        );
      }}
      renderItemArrow={({ item, context }) => {
        if (item.data.type !== 'category') {
          return null;
        }
        return (
          <span {...context.arrowProps}>
            <ChevronRight
              className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-200',
                context.isExpanded && 'rotate-90',
              )}
            />
          </span>
        );
      }}
      renderItemTitle={({ title, item, context }) => (
        <div className="flex w-full items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-2">
            <span
              className={getItemClasses(
                item.data.type as MenuItemType,
                context.depth ?? 0,
              )}
            >
              {title}
            </span>
            {(item.data.type === 'item' || item.data.type === 'modifier') &&
              item.data.price && (
                <span
                  className={cn(
                    'text-muted-foreground',
                    item.data.type === 'modifier'
                      ? 'text-sm font-light italic'
                      : 'text-base',
                  )}
                >
                  {item.data.type === 'modifier' && '+'}$
                  {Number(item.data.price).toFixed(2)}
                </span>
              )}
          </div>
          <Badge
            variant="outline"
            className={cn('capitalize', {
              'border-blue-200 bg-blue-50 text-blue-700':
                item.data.type === 'category',
              'border-green-200 bg-green-50 text-green-700':
                item.data.type === 'item',
              'border-orange-200 bg-orange-50 text-orange-700':
                item.data.type === 'modifier',
            })}
          >
            {item.data.type}
          </Badge>
        </div>
      )}
      renderItem={({ item, title, arrow, depth, context, children }) => {
        const isModifier = item.data.type === 'modifier';
        const isItem = item.data.type === 'item';
        const isCategory = item.data.type === 'category';

        return (
          <li
            {...context.itemContainerWithChildrenProps}
            className={cn(
              'list-none',
              depth > 0 && 'ml-4 border-l border-border/50',
              isModifier && 'ml-4 border-l border-border/50',
              isItem && 'ml-4 border-l border-border/50',
            )}
          >
            <div
              {...context.itemContainerWithoutChildrenProps}
              {...context.interactiveElementProps}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-4 py-0.5',
                'hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring focus-visible:ring-offset-2',
                isModifier && 'pointer-events-none opacity-90',
              )}
            >
              {arrow}
              {title}
            </div>
            {children && !isModifier && (
              <ul className="flex w-full flex-col">{children}</ul>
            )}
          </li>
        );
      }}
      renderTreeContainer={({ children, containerProps }) => (
        <ul {...containerProps} className="flex w-full flex-col">
          {children}
        </ul>
      )}
      renderItemsContainer={({ children, containerProps }) => (
        <ul {...containerProps} className="flex w-full flex-col">
          {children}
        </ul>
      )}
    >
      <Tree treeId="menu-tree" rootItem="root" treeLabel="Menu Structure" />
    </UncontrolledTreeEnvironment>
  );
}

export default MenuTree;
