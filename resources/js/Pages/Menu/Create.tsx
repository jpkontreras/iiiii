import { Header } from '@/Components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Restaurant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { FormEvent } from 'react';

interface Props extends PageProps {
  restaurant: Restaurant;
}

interface FormData {
  name: string;
  description: string;
  is_active: boolean;
}

export default function Create({ restaurant }: Props) {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    name: '',
    description: '',
    is_active: true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('restaurants.menus.store', restaurant.id));
  };

  return (
    <AuthenticatedLayout
      header={
        <Header
          title={__('menu.create')}
          subtitle={__('menu.manage_menus_for', {
            restaurant: restaurant.name,
          })}
        />
      }
    >
      <Head title={__('menu.create')} />

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="py-6">
                <div className="mb-6 text-sm text-gray-500">
                  {__('common.required_fields')}
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      {__('menu.name')}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{__('menu.description_optional')}</Label>
                    <Textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={6}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>{__('menu.is_active')}</Label>
                      <p className="text-sm text-gray-500">
                        {__('menu.is_active_description')}
                      </p>
                    </div>
                    <Switch
                      checked={data.is_active}
                      onCheckedChange={(checked) =>
                        setData('is_active', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={processing}>
                {__('menu.create')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
