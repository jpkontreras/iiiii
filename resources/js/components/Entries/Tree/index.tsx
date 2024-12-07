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

function MenuTree({ items, onItemsChange }: MenuTreeProps) {
  const dataProvider = useMemo(() => new MenuTreeDataProvider(items), [items]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
        if (item.data.type !== 'category' && item.data.type !== 'composite') {
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
      renderItemTitle={({ title, item }) => (
        <div className="flex w-full items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-normal">{title}</span>
            {item.data.price && (
              <span className="text-base text-muted-foreground">
                ${Number(item.data.price).toFixed(2)}
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
              'border-purple-200 bg-purple-50 text-purple-700':
                item.data.type === 'composite',
            })}
          >
            {item.data.type}
          </Badge>
        </div>
      )}
      renderItem={({ item, title, arrow, depth, context, children }) => {
        const InteractiveComponent = context.isRenaming ? 'div' : 'button';
        const isComposite = item.data.type === 'composite';

        return (
          <li
            {...context.itemContainerWithChildrenProps}
            className={cn(
              'list-none',
              depth > 0 && 'ml-4 border-l border-border/50',
              isComposite && 'ml-4 border-l border-border/50',
            )}
          >
            <div
              {...context.itemContainerWithoutChildrenProps}
              {...context.interactiveElementProps}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-4 py-0.5',
                'hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              {arrow}
              {title}
            </div>
            {children && <ul className="flex w-full flex-col">{children}</ul>}
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
