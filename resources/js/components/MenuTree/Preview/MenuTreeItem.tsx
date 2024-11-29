import { MenuItem } from '@/types';
import { MenuTreeProperties } from './MenuTreeProperties';
import { MenuTreeTags } from './MenuTreeTags';

interface MenuTreeItemProps {
  item: MenuItem;
  isSelected: boolean;
}

const formatPrice = (price: string | number | null): string => {
  if (!price) return '';
  return `$${Number(price).toFixed(2)}`;
};

export function MenuTreeItem({ item, isSelected }: MenuTreeItemProps) {
  return (
    <div
      className={`space-y-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-serif text-lg">
            {item.name}
            {!item.is_available && (
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
      {item.properties && <MenuTreeProperties properties={item.properties} />}
    </div>
  );
}
