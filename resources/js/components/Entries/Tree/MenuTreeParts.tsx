import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';
import { TreeItem, TreeItemRenderContext } from 'react-complex-tree';

export function RenderItemArrow({
  item,
  context,
}: {
  item: TreeItem<MenuEntry>;
  context: TreeItemRenderContext;
}) {
  if (!item.children?.length) {
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
}

export function RenderItemTitle({
  item,
  context,
}: {
  item: TreeItem<MenuEntry>;
  context: TreeItemRenderContext;
}) {
  const types: MenuEntry['type'][] = ['item', 'modifier', 'composite'];

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">{item.data?.name}</span>
        {types.includes(item.data.type) && item.data.price && (
          <span className="text-xs font-light italic text-muted-foreground">
            {item.data.type === 'modifier' && '+'}$
            {Number(item.data.price).toFixed(2)}
          </span>
        )}
      </div>
      <Badge
        variant="secondary"
        className={cn('capitalize', {
          'border-blue-200 bg-blue-50 text-blue-700':
            item.data.type === 'category',
          'border-green-200 bg-green-50 text-green-700':
            item.data.type === 'item',
          'border-red-200 bg-red-50 text-red-700':
            item.data.type === 'composite',
          'border-orange-200 bg-orange-50 text-orange-700':
            item.data.type === 'modifier',
        })}
      >
        {item.data.type}
      </Badge>
    </div>
  );
}

interface RenderItemProps {
  item: TreeItem<MenuEntry>;
  title: ReactNode;
  arrow: ReactNode;
  depth: number;
  context: TreeItemRenderContext<never>;
  children: ReactNode;
}

export const RenderItem = ({
  item,
  title,
  arrow,
  depth,
  context,
  children,
}: RenderItemProps) => {
  const isModifier = item.data.type === 'modifier';
  const isItem = item.data.type === 'item';
  const { isSelected, isExpanded, isFocused } = context;

  const InteractiveComponent = context.isRenaming ? 'div' : 'button';

  return (
    <li
      {...context.itemContainerWithChildrenProps}
      className={cn(
        'list-none outline-none',
        depth > 0 && 'ml-4',
        isModifier && 'ml-4',
        isItem && 'ml-4',
      )}
    >
      <InteractiveComponent
        {...context.itemContainerWithoutChildrenProps}
        {...context.interactiveElementProps}
        className={cn(
          'flex w-full items-center gap-2 border-b border-l px-4 py-1 outline-none',
          'hover:bg-accent/90',
          isModifier && 'pointer-events-none opacity-90',
          isSelected && 'bg-accent',
          isFocused && 'bg-accent/50',
        )}
        type="button"
      >
        {arrow}
        {title}
      </InteractiveComponent>

      {children && !isModifier && (
        <ul className="flex w-full flex-col">{children}</ul>
      )}
    </li>
  );
};
