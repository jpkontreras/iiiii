import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(2, __('onboarding.form.restaurant.validation.min'))
    .max(50, __('onboarding.form.restaurant.validation.max')),
  description: z
    .string()
    .min(10, __('onboarding.form.description.validation.min'))
    .max(500, __('onboarding.form.description.validation.max')),
});

type OnboardingForm = z.infer<typeof formSchema>;

interface Props {
  errors: Partial<Record<keyof OnboardingForm, string>>;
}

export default function Onboarding({ errors, ...rest }: Props) {
  console.log({ errors, ...rest });

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Set server-side validation errors when they exist
  useEffect(() => {
    if (errors) {
      console.log({ e: Object.keys(errors) });

      Object.keys(errors).forEach((key) => {
        const errorKey = key as keyof OnboardingForm;
        form.setError(errorKey, {
          type: 'server',
          message: errors[errorKey],
        });
      });
    }
  }, [errors, form.setError]);

  function onSubmit(values: OnboardingForm) {
    router.post('/onboarding', values);
  }

  return (
    <Authenticated showNavbar={false}>
      <div className="container mx-auto max-w-[800px] py-10">
        <Card>
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl">
              {__('onboarding.welcome.title')}
            </CardTitle>
            <CardDescription className="text-base">
              {__('onboarding.welcome.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {__('onboarding.form.restaurant.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={__(
                            'onboarding.form.restaurant.placeholder',
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {__('onboarding.form.description.label')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={__(
                            'onboarding.form.description.placeholder',
                          )}
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        {__('onboarding.form.description.characters_count', {
                          count: field.value?.length || 0,
                        })}
                      </p>
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? __('onboarding.form.submit.saving')
                      : __('onboarding.form.submit.continue')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Authenticated>
  );
}
