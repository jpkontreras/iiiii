import { Header } from '@/Components/Header';
import MenuItems from '@/components/menuitems';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MenuTreeNode } from '@/types';
import { __ } from 'laravel-translator';

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
      <MenuItems />
    </AuthenticatedLayout>
  );
}
