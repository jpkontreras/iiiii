import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem } from '@/types';
import { NotepadText } from 'lucide-react';
import { MenuTreeHeader } from './MenuTreeHeader';
import { MenuTreeItem } from './MenuTreeItem';

interface MenuTreePreviewProps {
  menuName: string;
  restaurantName: string;
  items: MenuItem[];
  selectedItems: Set<number>;
  onItemClick: (itemId: number) => void;
}

export function MenuTreePreview({
  menuName,
  restaurantName,
  items,
  selectedItems,
}: MenuTreePreviewProps) {
  if (!items.length) {
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
            <MenuTreeHeader
              menuName={menuName}
              restaurantName={restaurantName}
            />

            {/* Menu Categories and Items */}
            <div className="space-y-12">
              {items.map((category) => (
                <div key={category.id} className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-center font-serif text-xl tracking-wide">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-center text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-6">
                    {category.items?.map((item) => (
                      <MenuTreeItem
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

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
