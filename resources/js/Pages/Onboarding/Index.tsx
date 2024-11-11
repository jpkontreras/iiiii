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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Restaurant name must be at least 2 characters.')
    .max(50, 'Restaurant name must not exceed 50 characters.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(500, 'Description must not exceed 500 characters.'),
});

type OnboardingForm = z.infer<typeof formSchema>;

interface Props {
  errors: Partial<Record<keyof OnboardingForm, string>>;
}

export default function Onboarding({ errors }: Props) {
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
            <CardTitle className="text-3xl">Welcome to IRMA</CardTitle>
            <CardDescription className="text-base">
              Let's start by setting up your restaurant profile. Please provide
              your restaurant's name and a brief description.
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
                      <FormLabel>Restaurant Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your restaurant name"
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your restaurant..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/500 characters
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
                    {form.formState.isSubmitting ? 'Saving...' : 'Continue'}
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
