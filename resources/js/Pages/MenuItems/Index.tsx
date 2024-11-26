import { Header } from '@/Components/Header';
import { MenuItemBuilder } from '@/components/MenuItems/MenuItemBuilder';
import { MenuPreview } from '@/components/MenuItems/MenuPreview';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { __ } from 'laravel-translator';
import { useState } from 'react';

interface Props extends PageProps {
  restaurant: Restaurant;
  menu: Menu;
}

const defaultItems: MenuItem[] = [
  {
    id: 1,
    name: 'Main Dishes',
    isFolder: true,
    children: [
      {
        id: 2,
        name: 'Grilled Salmon',
        description: 'Fresh salmon with herbs and lemon',
        price: 24.99,
        category: 'Main Dishes',
      },
      {
        id: 3,
        name: 'Beef Tenderloin',
        description: 'Premium cut with red wine sauce',
        price: 34.99,
        category: 'Main Dishes',
      },
    ],
  },
  {
    id: 4,
    name: 'Desserts',
    isFolder: true,
    children: [
      {
        id: 5,
        name: 'Chocolate Soufflé',
        description: 'Warm chocolate dessert with vanilla ice cream',
        price: 12.99,
        category: 'Desserts',
      },
    ],
  },
];

export default function Index({ restaurant, menu }: Props) {
  const [items, setItems] = useState<MenuItem[]>(defaultItems);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleItemsChange = (newItems: MenuItem[]) => {
    setItems(newItems);
    setSelectedItems(new Set());
  };

  // Get flat list of non-folder items for preview
  const getFlatMenuItems = (menuItems: MenuItem[]): MenuItem[] => {
    const flatItems = menuItems.reduce<MenuItem[]>((acc, item) => {
      if (item.isFolder && item.children) {
        return [...acc, ...getFlatMenuItems(item.children)];
      }
      if (!item.isFolder) {
        return [...acc, item];
      }
      return acc;
    }, []);
    console.log('Flattened menu items:', flatItems);
    return flatItems;
  };

  const handleItemClick = (itemId: number) => {
    setSelectedItems(new Set([itemId]));
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
            <MenuItemBuilder
              items={items}
              onChange={handleItemsChange}
              onSelectItem={handleItemClick}
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
