import { Header } from '@/Components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent } from '@/components/ui/popover';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Menu, PageProps, Restaurant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props extends PageProps {
  restaurant: Restaurant;
  menu: Menu;
}

interface MousePosition {
  x: number;
  y: number;
}

interface NewMenuItem {
  id: string; // Temporary client ID
  name: string;
  price: string;
  description?: string;
  position: number;
}

export default function Index({ restaurant, menu }: Props) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [newItems, setNewItems] = useState<NewMenuItem[]>([]);

  const { data, setData, reset } = useForm({
    name: '',
    price: '',
    description: '',
    position: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDropZoneClick = (e: React.MouseEvent, position: number) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setData('position', position);
    setIsPopoverOpen(true);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: NewMenuItem = {
      id: `temp-${Date.now()}`,
      name: data.name,
      price: data.price,
      description: data.description,
      position: data.position,
    };
    setNewItems([...newItems, newItem]);
    setIsPopoverOpen(false);
    reset();
  };

  const handleSaveAll = () => {
    // Here we'll implement the save to server functionality
    console.log('Saving items:', newItems);
  };

  const allItems = [
    ...(menu.menuItems || []),
    ...newItems.map((item) => ({
      ...item,
      is_available: true,
    })),
  ].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <AuthenticatedLayout
      header={
        <Header
          title={__('menu_items.title')}
          subtitle={__('menu_items.subtitle', {
            menu: menu.name,
            restaurant: restaurant.name,
          })}
        />
      }
    >
      <Head title={`${menu.name} - ${__('menu_items.title')}`} />

      {/* Custom Cursor */}
      <div
        className={`pointer-events-none fixed left-0 top-0 z-50 whitespace-nowrap rounded-lg bg-gray-100/90 px-2 py-1 text-gray-800 shadow-sm transition-opacity ${
          isOverDropZone ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate(${mousePosition.x + 20}px, ${mousePosition.y + 20}px)`,
        }}
      >
        Click to add item
      </div>

      {/* Menu Builder */}
      <div className="h-[calc(100vh-12rem)] p-4">
        <div className="h-full rounded-lg border bg-gray-100/80 p-2 shadow-sm">
          {/* Menu Header */}
          <div className="mb-4 text-center">
            <h2 className="truncate text-xl font-semibold">
              {restaurant.name} - {menu.name}
            </h2>
          </div>

          <div className="h-[calc(100%-4rem)] space-y-2 overflow-auto px-4">
            {allItems.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  {__('menu_items.no_items_description')}
                </p>
              </div>
            ) : (
              allItems.map((item, index) => (
                <div key={item.id}>
                  {/* Drop Zone */}
                  <div
                    className="group h-4 w-full cursor-pointer"
                    onMouseEnter={() => setIsOverDropZone(true)}
                    onMouseLeave={() => setIsOverDropZone(false)}
                    onClick={(e) => handleDropZoneClick(e, index)}
                  >
                    <div className="mx-auto h-0.5 w-1/3 bg-gray-200 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {/* Menu Item */}
                  <div className="rounded-lg border bg-white p-3 text-center shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 text-center">
                        <Input
                          value={item.name}
                          className="border-none bg-transparent text-center text-lg hover:bg-gray-50"
                          onChange={() => {}}
                        />
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.price}
                          className="w-24 border-none bg-transparent text-center"
                          onChange={() => {}}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Final Drop Zone */}
            <div
              className="group h-16 w-full cursor-pointer"
              onMouseEnter={() => setIsOverDropZone(true)}
              onMouseLeave={() => setIsOverDropZone(false)}
              onClick={(e) => handleDropZoneClick(e, allItems.length)}
            >
              <div className="mx-auto h-0.5 w-1/3 bg-gray-200 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {newItems.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveAll}>
              {__('menu_items.save_all')} ({newItems.length})
            </Button>
          </div>
        )}

        {/* Add Item Popover */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverContent
            className="w-80"
            style={{
              position: 'absolute',
              left: popoverPosition.x,
              top: popoverPosition.y,
            }}
          >
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-2">
                <Label>{__('menu_items.name_placeholder')}</Label>
                <Input
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{__('menu_items.price_placeholder')}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  {__('common.cancel')}
                </Button>
                <Button type="submit">{__('menu_items.add_item')}</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </AuthenticatedLayout>
  );
}
