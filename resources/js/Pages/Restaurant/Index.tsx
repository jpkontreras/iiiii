import { Header } from '@/Components/Header';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { __ } from 'laravel-translator';
import { EllipsisVertical, Trash } from 'lucide-react';
import { useState } from 'react';

interface Restaurant {
  id: number;
  name: string;
  description: string;
}

interface Props {
  restaurants: Restaurant[];
}

type Checked = DropdownMenuCheckboxItemProps['checked'];

export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex flex-row justify-around py-2">
            <Trash />
            <span className="text-base text-destructive">
              {__('restaurant.option_delete')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Index({ restaurants }: Props) {
  return (
    <>
      <Head title={__('restaurant.title')} />
      <Authenticated
        header={
          <Header
            title={__('restaurant.header_title')}
            subtitle={__('restaurant.header_subtitle')}
          />
        }
      >
        <div className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Card key={restaurant?.id}>
                <CardHeader className="flex flex-row content-start items-start justify-between">
                  <div>
                    <CardTitle>{restaurant?.name}</CardTitle>
                    <CardDescription>{restaurant?.description}</CardDescription>
                  </div>
                  <DropdownMenuCheckboxes />
                </CardHeader>

                <CardContent />

                <div className="flex items-end justify-end gap-x-2 p-4">
                  <Link
                    className={buttonVariants({ variant: 'secondary' })}
                    href={route('restaurants.show', {
                      restaurant: restaurant.id,
                    })}
                  >
                    {__('restaurant.view_details')}
                  </Link>
                  <Link
                    className={buttonVariants({ variant: 'default' })}
                    href={route('restaurants.dashboard', {
                      restaurant: restaurant.id,
                    })}
                  >
                    {__('restaurant.go_to_dashboard')}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Authenticated>
    </>
  );
}
