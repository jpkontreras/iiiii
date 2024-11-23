import { CustomTrackerCursor } from '@/Components/CustomTrackerCursor';
import { Header } from '@/Components/Header';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Menu, PageProps, Restaurant } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { __ } from 'laravel-translator';

interface Props extends PageProps {
  restaurant: Restaurant;
  menu: Menu;
}

export default function Index({ restaurant, menu }: Props) {
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
      <motion.div className="relative z-0 size-full cursor-text overflow-hidden rounded-xl border border-amber-300 bg-amber-50/65">
        <CustomTrackerCursor
          element={
            <div className="z-1 relative cursor-cell rounded-3xl bg-amber-200 px-4 py-2">
              <h5 className="text-center text-sm font-semibold">
                {__('menu_items.add_entry')}
              </h5>
            </div>
          }
        />
      </motion.div>
    </AuthenticatedLayout>
  );
}
