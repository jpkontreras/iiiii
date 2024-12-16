import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuTreeNode } from '@/types';
import { MenuTreeBody } from './MenuTreeBody';
import { MenuTreeHeader } from './MenuTreeHeader';
interface MenuTreePreviewProps {
  menuName: string;
  restaurantName: string;
  items: MenuTreeNode[];
  selectedItems: Set<number>;
}

export function MenuTreePreview({
  menuName,
  restaurantName,
  items,
  selectedItems,
}: MenuTreePreviewProps) {
  console.log({ items });

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ScrollArea className="flex-1 px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <MenuTreeHeader
              menuName={menuName}
              restaurantName={restaurantName}
            />
            <MenuTreeBody items={items} selectedItems={selectedItems} />

            <div className="mt-12 flex items-center justify-center">
              <div className="h-px w-16 bg-border" />
              <div className="mx-4 text-xl uppercase tracking-widest text-muted-foreground">
                ✦
              </div>
              <div className="h-px w-16 bg-border" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
