import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatPrice } from '@/lib/utils';
import { MenuItem, Menu as MenuType, PageProps, Restaurant } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Edit, FileText, XCircle } from 'lucide-react';

interface Props extends PageProps {
  restaurant: Restaurant;
  menu: MenuType;
}

export default function Show({ restaurant, menu, flash }: Props) {
  // Group menu items by category
  const itemsByCategory =
    menu.menuItems?.reduce(
      (acc, item) => {
        const categoryName = item.category?.name || 'Uncategorized';
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
      },
      {} as Record<string, MenuItem[]>,
    ) || {};

  return (
    <AuthenticatedLayout>
      <Head title={`${menu.name} - Menu Details`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {menu.name}
                </h2>
                {menu.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {menu.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href={route('restaurants.menus.edit', [
                    restaurant.id,
                    menu.id,
                  ])}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Menu
                </Link>
                <Button variant="outline">Preview Menu</Button>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  menu.template_type === 'custom'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {menu.template_type}
              </span>
              {menu.is_active ? (
                <span className="inline-flex items-center text-green-600">
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center text-gray-500">
                  <XCircle className="mr-1.5 h-4 w-4" />
                  Inactive
                </span>
              )}
            </div>
          </div>

          {flash?.success && (
            <div className="relative mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {flash.success}
            </div>
          )}

          {flash?.error && (
            <div className="relative mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {flash.error}
            </div>
          )}

          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              {menu.menuItems?.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No menu items
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding items to your menu
                  </p>
                  <div className="mt-6">
                    <Link
                      href={route('restaurants.menus.edit', [
                        restaurant.id,
                        menu.id,
                      ])}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Items
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="mb-4 text-lg font-medium text-gray-900">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="relative rounded-lg border bg-white p-6 shadow-sm"
                          >
                            {item.photo_path && (
                              <img
                                src={item.photo_path}
                                alt={item.name}
                                className="mb-4 h-48 w-full rounded-md object-cover"
                              />
                            )}
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-base font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                            {item.tags && item.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            {!item.is_available && (
                              <div className="absolute right-2 top-2">
                                <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                  Unavailable
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
