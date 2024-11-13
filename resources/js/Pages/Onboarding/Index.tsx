import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';

export default function OnboardingIndex() {
  const { data, setData, post, processing } = useForm({
    agreed: false,
  });

  const handleContinue = (e) => {
    e.preventDefault();

    if (!data.agreed) return;
    post(route('onboarding.start'));
  };

  return (
    <Authenticated showNavbar={false}>
      <Head title={__('onboarding.welcome')} />

      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <form onSubmit={handleContinue}>
          <Card className="w-full max-w-2xl">
            <div className="mt-4 flex justify-center md:-mt-24">
              <img
                src="/images/icon2.png"
                alt="IRMA Logo"
                className="w-72 rounded-3xl p-5"
              />
            </div>

            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {__('onboarding.welcome')}
              </CardTitle>
              <CardDescription className="mt-2 text-center text-lg">
                {__('onboarding.description')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-8">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">
                    {__('onboarding.agreement.title')}
                  </h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {__('onboarding.agreement.description')}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={data.agreed}
                      onCheckedChange={(checked) =>
                        setData('agreed', checked as boolean)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {__('onboarding.agreement.accept')}
                    </label>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <a href="#" className="text-primary hover:underline">
                      {__('onboarding.agreement.terms_link')}
                    </a>
                    <a href="#" className="text-primary hover:underline">
                      {__('onboarding.agreement.privacy_link')}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!data.agreed || processing}
              >
                {__('onboarding.agreement.accept')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Authenticated>
  );
}
