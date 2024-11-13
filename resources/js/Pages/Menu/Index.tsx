import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Menu as MenuType, PageProps, Restaurant } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, FileText, Plus, XCircle } from 'lucide-react';

interface Props extends PageProps {
  restaurant: Restaurant;
  menus: MenuType[];
}

export default function Index({ restaurant, menus, flash }: Props) {
  return (
    <AuthenticatedLayout>
      <Head title={`Menus - ${restaurant.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Menus</h2>
              <p className="mt-1 text-sm text-gray-600">
                Manage menus for {restaurant.name}
              </p>
            </div>
            <Link
              href={route('restaurants.menus.create', restaurant.id)}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Menu
            </Link>
          </div>

          {flash?.success && (
            <div className="relative mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {flash.success}
            </div>
          )}

          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            {menus.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No menus
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new menu
                </p>
                <div className="mt-6">
                  <Link
                    href={route('restaurants.menus.create', restaurant.id)}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Create Menu
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {menus.map((menu) => (
                      <tr key={menu.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {menu.name}
                          </div>
                          {menu.description && (
                            <div className="text-sm text-gray-500">
                              {menu.description}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-800">
                            {menu.template_type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {menu.menuItems?.length || 0} items
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {menu.is_active ? (
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle className="mr-1.5 h-5 w-5" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-gray-500">
                              <XCircle className="mr-1.5 h-5 w-5" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <Link
                            href={route('restaurants.menus.show', [
                              restaurant.id,
                              menu.id,
                            ])}
                            className="mr-4 text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                          <Link
                            href={route('restaurants.menus.edit', [
                              restaurant.id,
                              menu.id,
                            ])}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
