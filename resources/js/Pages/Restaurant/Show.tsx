import { Head, Link } from '@inertiajs/react';
import { __ } from 'laravel-translator';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

interface Props {
  restaurant: Restaurant;
}

export default function Show({ restaurant }: Props) {
  return (
    <>
      <Head title={restaurant.name} />

      <div className="flex min-h-screen flex-col bg-gray-100">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                {restaurant.name}
              </h1>
              <Link
                href={route('restaurants.dashboard', {
                  restaurant: restaurant.id,
                })}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                {__('restaurant.go_to_dashboard')}
              </Link>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {__('restaurant.description')}
                    </h2>
                    <p className="mt-1 text-gray-600">
                      {restaurant.description}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {__('restaurant.contact_information')}
                    </h2>
                    <div className="mt-1 space-y-2 text-gray-600">
                      <p>
                        {__('restaurant.address')}: {restaurant.address}
                      </p>
                      <p>
                        {__('restaurant.phone')}: {restaurant.phone}
                      </p>
                      <p>
                        {__('restaurant.email')}: {restaurant.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={route('restaurants.index')}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {__('restaurant.back_to_restaurants')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
