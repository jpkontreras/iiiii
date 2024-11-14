import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { __ } from 'laravel-translator';

interface Restaurant {
  id: number;
  name: string;
  description: string;
}

interface Props {
  restaurants: Restaurant[];
}

export default function Index({ restaurants }: Props) {
  return (
    <>
      <Head title={__('restaurant.title')} />
      <Authenticated>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="rounded-lg border p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                    <p className="mt-2 text-gray-600">
                      {restaurant.description}
                    </p>
                    <div className="mt-4 flex gap-4">
                      <Link
                        href={route('restaurants.show', {
                          restaurant: restaurant.id,
                        })}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {__('restaurant.view_details')}
                      </Link>
                      <Link
                        href={route('restaurants.dashboard', {
                          restaurant: restaurant.id,
                        })}
                        className="text-green-600 hover:text-green-800"
                      >
                        {__('restaurant.go_to_dashboard')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Authenticated>
    </>
  );
}
