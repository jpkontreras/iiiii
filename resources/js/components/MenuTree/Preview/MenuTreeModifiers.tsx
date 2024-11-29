import { MenuItem } from '@/types';
import { MenuTreeTags } from './MenuTreeTags';

interface MenuTreeModifiersProps {
  modifiers: MenuItem[];
}

const formatPrice = (price: string | number | null): string => {
  if (!price || Number(price) === 0) return '';
  return `+$${Number(price).toFixed(2)}`;
};

export function MenuTreeModifiers({ modifiers }: MenuTreeModifiersProps) {
  if (!modifiers?.length) return null;

  return (
    <div className="rounded-md bg-muted/30 p-3">
      <div className="mb-2 text-sm font-medium">Options:</div>
      <div className="space-y-2">
        {modifiers.map((modifier) => (
          <div
            key={modifier.id}
            className="flex items-baseline justify-between text-sm"
          >
            <div className="space-y-1">
              <span>{modifier.name}</span>
              <MenuTreeTags tags={modifier.tags} />
            </div>
            {modifier.price && Number(modifier.price) > 0 && (
              <span className="text-muted-foreground">
                {formatPrice(modifier.price)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
