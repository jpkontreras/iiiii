import { cn } from '@/lib/utils';
import { MenuTreeNode } from '@/types';

interface MenuTreeBodyProps {
  items: MenuTreeNode[];
  selectedItems: Set<number>;
}

const formatPrice = (price: number) => {
  if (price === 0) return '';
  return ` (+$${price.toFixed(2)})`;
};

const ModifierGroup = ({ group }: { group: any }) => {
  const selectionText =
    group.min_selections === group.max_selections
      ? `Select ${group.min_selections}`
      : `Select ${group.min_selections}-${group.max_selections}`;

  return (
    <div className="mt-2 space-y-1">
      <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {group.name}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
          {selectionText}
        </span>
      </h4>
      <div className="ml-4 space-y-1">
        {group.modifiers.map((modifier: any) => (
          <div key={modifier.id} className="text-sm">
            {modifier.name}
            <span className="text-muted-foreground">
              {formatPrice(modifier.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Variations = ({ variations }: { variations: any[] }) => {
  if (!variations?.length) return null;

  return (
    <div className="mt-2 space-y-1">
      <h4 className="text-sm font-medium text-muted-foreground">
        Available as:
      </h4>
      <div className="ml-4 space-y-1">
        {variations.map((variation) => (
          <div key={variation.id} className="text-sm">
            {variation.name}
            <span className="text-muted-foreground">
              {formatPrice(variation.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuTreeItem = ({
  item,
  isSelected,
}: {
  item: MenuTreeNode;
  isSelected: boolean;
}) => {
  const isRoot = item.depth === 0;
  const isItem = item.type === 'item';

  return (
    <div className="space-y-2">
      <div>
        <h3
          className={cn(
            'font-serif tracking-wide',
            isRoot && 'text-center text-2xl',
            isItem ? 'text-lg font-medium' : 'text-xl',
            isSelected && 'text-primary',
          )}
        >
          {item.name}
          {isItem && item.price > 0 && (
            <span className="ml-2 text-muted-foreground">
              ${item.price.toFixed(2)}
            </span>
          )}
        </h3>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}

        {/* Show variations if they exist */}
        {isItem && item.variations && (
          <Variations variations={item.variations} />
        )}

        {/* Show modifier groups if they exist */}
        {isItem &&
          item.modifier_groups?.map((group) => (
            <ModifierGroup key={group.id} group={group} />
          ))}
      </div>

      {item.children && item.children.length > 0 && (
        <div className={cn('space-y-2', !isRoot && 'ml-4')}>
          {item.children.map((child) => (
            <MenuTreeItem key={child.id} item={child} isSelected={isSelected} />
          ))}
        </div>
      )}
    </div>
  );
};

export function MenuTreeBody({ items, selectedItems }: MenuTreeBodyProps) {
  if (!items.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No menu items added yet
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {items.map((item, idx) => (
        <MenuTreeItem
          item={item}
          isSelected={selectedItems.has(item.id)}
          key={`id_${idx}`}
        />
      ))}
    </div>
  );
}
