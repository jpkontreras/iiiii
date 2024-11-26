import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem } from '@/types';
import { NotepadText } from 'lucide-react';
import { useMemo } from 'react';

interface MenuPreviewProps {
  menuName: string;
  restaurantName: string;
  items: MenuItem[];
  selectedItems: Set<number>;
  onItemClick: (itemId: number) => void;
}

export function MenuPreview({
  menuName,
  restaurantName,
  items,
  selectedItems,
}: MenuPreviewProps) {
  const groupItemsByCategory = (
    items: MenuItem[],
  ): Record<string, MenuItem[]> => {
    const grouped: Record<string, MenuItem[]> = {};

    items.forEach((item) => {
      if (!item.category) return;

      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  };

  const groupedItems = useMemo(() => groupItemsByCategory(items), [items]);
  const hasCategories = Object.keys(groupedItems).length > 0;

  if (!hasCategories) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No menu items added yet
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl p-8">
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            {/* Menu Header */}
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight">
                {menuName}
              </h2>
              <p className="text-sm italic text-muted-foreground">
                {restaurantName}
              </p>
              <div className="mt-4 flex items-center justify-center">
                <div className="h-px w-24 bg-border" />
                <div className="mx-2 text-xl">✦</div>
                <div className="h-px w-24 bg-border" />
              </div>
            </div>

            {/* Menu Categories and Items */}
            <div className="space-y-12">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="space-y-6">
                  <h3 className="text-center font-serif text-xl tracking-wide">
                    {category}
                  </h3>
                  <div className="space-y-6">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`space-y-1 ${
                          selectedItems.has(item.id)
                            ? 'text-primary'
                            : 'text-foreground'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <h4 className="font-serif text-lg">{item.name}</h4>
                          <div className="relative">
                            <div className="absolute -right-2 h-px w-12 bg-border" />
                            <span className="font-medium tabular-nums">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="mt-12 flex items-center justify-center">
              <div className="h-px w-16 bg-border" />
              <div className="mx-4 text-xs uppercase tracking-widest text-muted-foreground">
                <NotepadText className="size-8" />
              </div>
              <div className="h-px w-16 bg-border" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
