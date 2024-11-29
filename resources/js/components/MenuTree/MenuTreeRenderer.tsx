import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tag } from '@/types';
import { TreeRenderProps } from 'react-complex-tree';

interface MenuTreeRendererProps extends TreeRenderProps {
  icon?: React.ReactNode;
  description?: string | null;
  price?: string | number | null;
  tags?: Tag[];
}

const formatPrice = (price: string | number | null): string => {
  if (!price) return '';
  return `$${Number(price).toFixed(2)}`;
};

export function MenuTreeRenderer({
  item,
  depth,
  children,
  title,
  context,
  arrow,
  icon,
  description,
  price,
  tags,
  ...props
}: MenuTreeRendererProps) {
  const indentation = depth * 20;
  const isSelected = context.isSelected;
  const isFocused = context.isFocused;

  return (
    <li
      {...context.itemContainerWithChildrenProps}
      className="relative flex flex-col"
    >
      <div
        {...context.itemContainerWithoutChildrenProps}
        {...props}
        className={cn(
          'group relative flex h-8 cursor-pointer items-center rounded-md px-2 hover:bg-accent',
          isSelected && 'bg-accent',
          isFocused && 'ring-1 ring-ring ring-offset-1',
        )}
        style={{ paddingLeft: indentation }}
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {arrow}
          {icon}
          <span className="truncate">{title}</span>
          {price && (
            <span className="ml-auto text-sm text-muted-foreground">
              {formatPrice(price)}
            </span>
          )}
          {tags?.map((tag) => (
            <Badge
              key={tag.id}
              variant={tag.type === 'dietary' ? 'outline' : 'default'}
              className="ml-2 text-xs"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      {children}
    </li>
  );
}
