import { MenuItem } from '@/types';
import { MenuTreeModifiers } from './MenuTreeModifiers';
import { MenuTreeTags } from './MenuTreeTags';

interface MenuTreeItemProps {
  item: MenuItem;
  isSelected: boolean;
  depth?: number;
}

const formatPrice = (price: string | number | null): string => {
  if (!price) return '';
  return `$${Number(price).toFixed(2)}`;
};

export function MenuTreeItem({
  item,
  isSelected,
  depth = 0,
}: MenuTreeItemProps) {
  const hasModifiers = item.modifiers && item.modifiers.length > 0;
  const hasItems = item.items && item.items.length > 0;

  return (
    <div
      className={`space-y-4 ${isSelected ? 'text-primary' : 'text-foreground'}`}
    >
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif text-lg">
              {item.name}
              {!item.is_active && (
                <span className="ml-2 text-sm text-muted-foreground">
                  (Unavailable)
                </span>
              )}
            </h4>
            <MenuTreeTags tags={item.tags} />
          </div>
          {item.price && (
            <div className="relative">
              <div className="absolute -right-2 h-px w-12 bg-border" />
              <span className="font-medium tabular-nums">
                {formatPrice(item.price)}
              </span>
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>

      {/* Show modifiers if they exist */}
      {hasModifiers && (
        <div className="ml-4">
          <MenuTreeModifiers modifiers={item.modifiers} />
        </div>
      )}

      {/* Recursively render child items */}
      {hasItems && (
        <div className={`ml-${depth * 4} space-y-4`}>
          {item.items.map((childItem) => (
            <MenuTreeItem
              key={childItem.id}
              item={childItem}
              isSelected={isSelected}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
