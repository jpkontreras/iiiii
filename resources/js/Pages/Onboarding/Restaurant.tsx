import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { Building2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Restaurant() {
  const { data, setData, post, processing } = useForm({
    name: '',
    description: '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('onboarding.restaurants'));
  };

  return (
    <>
      <Head title={__('onboarding.steps.restaurant_info')} />

      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <form onSubmit={handleSubmit}>
          <Card className="w-full max-w-2xl border-none shadow-none">
            <div className="mt-4 flex justify-center md:-mt-24">
              <ApplicationLogo className="w-72 rounded-3xl p-5" />
            </div>

            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {__('onboarding.restaurant.title')}
              </CardTitle>
              <CardDescription className="mt-2 text-center text-lg">
                {__('onboarding.description')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-medium">
                    {__('onboarding.steps.restaurant_info')}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="mb-6 text-sm text-gray-500">
                    {__('common.required_fields')}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {__('onboarding.restaurant.name')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {__('onboarding.restaurant.description')}
                    </Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder={__(
                        'onboarding.restaurant.description_placeholder',
                      )}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={processing}
              >
                {__('onboarding.restaurant.continue')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
