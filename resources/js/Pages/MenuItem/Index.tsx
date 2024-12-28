import { Header } from '@/Components/Header';
import MenuItemDetails from '@/components/MenuItems/Details';
import { MenuTreePreview } from '@/components/MenuItems/Preview/MenuTreePreview';
import MenuTree from '@/components/MenuItems/Tree';
import { Label } from '@/components/ui/label';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Switch } from '@/components/ui/switch';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MenuTreeNode } from '@/types';
import { __ } from 'laravel-translator';
import { useMemo, useState } from 'react';

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
  const [menumode, setMenumode] = useState<boolean>(false);

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

  const props = useMemo(
    () => ({
      items,
      restaurantName: restaurant.name,
      menuName: restaurant.name,
      selectedItems,
    }),
    [items, restaurant.name, selectedItems],
  );

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
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={30} maxSize={35} order={1}>
          <MenuTree items={items} onItemsChange={handleItemsChange} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel
          minSize={65}
          defaultSize={70}
          className="h-full"
          order={2}
        >
          <div className="m-0 grid grid-rows-[35px,1fr]">
            <div className="blue-50 grid grid-flow-col items-center justify-start gap-x-4 px-4">
              <Switch checked={menumode} onCheckedChange={setMenumode} />
              <Label htmlFor="airplane-mode" className="font-montserrat">
                Menu mode
              </Label>
            </div>
          </div>

          {menumode ? <MenuTreePreview {...props} /> : <MenuItemDetails />}
        </ResizablePanel>

        {/* <ResizablePanel defaultSize={70}>
            <div className="m-0 grid h-full grid-rows-[35px,1fr]">
              <div className="blue-50 grid grid-flow-col items-center justify-start gap-x-4 px-4">
                <Switch checked={menumode} onCheckedChange={setMenumode} />
                <Label htmlFor="airplane-mode" className="font-montserrat">
                  Menu mode
                </Label>
              </div>
              {!menumode && <MenuItemDetails />}

              {menumode && (
                <MenuTreePreview
      
                />
              )}
            </div>
          </ResizablePanel> */}
      </ResizablePanelGroup>
    </AuthenticatedLayout>
  );
}
