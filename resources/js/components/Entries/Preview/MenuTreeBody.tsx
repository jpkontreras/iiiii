import { cn } from '@/lib/utils';
import { MenuTreeNode } from '@/types';

interface MenuTreeBodyProps {
  items: MenuTreeNode[];
  selectedItems: Set<number>;
}

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
        </h3>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>

      {item.children?.length > 0 && (
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
