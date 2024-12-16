import { MenuTreePreview } from '@/components/MenuItems/Preview/MenuTreePreview';

import { Header } from '@/Components/Header';
import MenuTree from '@/components/MenuItems/Tree';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MenuTreeNode } from '@/types';
import { __ } from 'laravel-translator';
import { useState } from 'react';

interface PageProps {
  auth: any;
}

interface Restaurant {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  name: string;
}

interface Props extends PageProps {
  restaurant: Restaurant;
  menu: Menu;
  entries: MenuTreeNode[];
}

export default function Index({ restaurant, menu, entries }: Props) {
  const [items, setItems] = useState<MenuTreeNode[]>(entries || []);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleItemsChange = (newItems: MenuTreeNode[]) => {
    setItems(newItems);
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <Header
          title={`${__('menu_items.title')} - ${menu.name}`}
          subtitle={__('menu_items.subtitle', {
            menu: menu.name,
            restaurant: restaurant.name,
          })}
        />
      }
    >
      <div className="container">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={30}>
            <MenuTree items={items} onItemsChange={handleItemsChange} />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={70}>
            <MenuTreePreview
              items={items}
              restaurantName={restaurant.name}
              menuName={menu.name}
              selectedItems={selectedItems}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthenticatedLayout>
  );
}
