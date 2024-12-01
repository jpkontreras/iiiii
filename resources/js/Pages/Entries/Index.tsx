import { Header } from '@/Components/Header';
import { MenuTree } from '@/components/MenuTree/MenuTree';
import { MenuTreePreview } from '@/components/MenuTree/Preview';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MenuItem } from '@/types';
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
  entries: MenuItem[];
}

export default function Index({ restaurant, menu, entries }: Props) {
  const [items, setItems] = useState<MenuItem[]>(entries);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleItemsChange = (newItems: MenuItem[]) => {
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

  const handleItemClick = (itemId: number) => {
    handleSelectItem(itemId);
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
          <ResizablePanel defaultSize={50} minSize={30}>
            <MenuTree items={items} onItemsChange={handleItemsChange} />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={50}>
            <MenuTreePreview
              menuName={menu.name}
              restaurantName={restaurant.name}
              items={items}
              selectedItems={selectedItems}
              onItemClick={handleItemClick}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthenticatedLayout>
  );
}
