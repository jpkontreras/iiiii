import { Header } from '@/Components/Header';
import { MenuPreview } from '@/components/MenuItems/MenuPreview';
import { MenuTree } from '@/components/MenuTree';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FlatMenuItem } from '@/types/menu-items';
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
}

const defaultItems: FlatMenuItem[] = [
  {
    id: 1,
    name: 'Main Dishes',
    parentId: null,
    isFolder: true,
  },
  {
    id: 2,
    name: 'Grilled Salmon',
    parentId: 1,
    isFolder: false,
    description: 'Fresh salmon with herbs and lemon',
    price: 24.99,
    category: 'Main Dishes',
  },
  {
    id: 3,
    name: 'Beef Tenderloin',
    parentId: 1,
    isFolder: false,
    description: 'Premium cut with red wine sauce',
    price: 34.99,
    category: 'Main Dishes',
  },
  {
    id: 4,
    name: 'Desserts',
    parentId: null,
    isFolder: true,
  },
  {
    id: 5,
    name: 'Chocolate Soufflé',
    parentId: 4,
    isFolder: false,
    description: 'Warm chocolate dessert with vanilla ice cream',
    price: 12.99,
    category: 'Desserts',
  },
];

export default function Index({ restaurant, menu }: Props) {
  const [items, setItems] = useState<FlatMenuItem[]>(defaultItems);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleItemsChange = (newItems: FlatMenuItem[]) => {
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

  // Updated to work with flat structure
  const getFlatMenuItems = (menuItems: FlatMenuItem[]): FlatMenuItem[] => {
    return menuItems.filter((item) => !item.isFolder);
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
          <ResizablePanel defaultSize={50} minSize={20}>
            <MenuTree
            // items={items}
            // onChange={handleItemsChange}
            // onSelectItem={handleSelectItem}
            />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={50}>
            <MenuPreview
              menuName={menu.name}
              restaurantName={restaurant.name}
              items={getFlatMenuItems(items)}
              selectedItems={selectedItems}
              onItemClick={handleItemClick}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthenticatedLayout>
  );
}
