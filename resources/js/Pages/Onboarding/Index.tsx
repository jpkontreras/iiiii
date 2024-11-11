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
import { Head, router } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { Building2, ChefHat, ClipboardList, Users2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  auth: any;
}

export default function OnboardingIndex({ auth }: Props) {
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) return;
    router.post(route('onboarding.start'));
  };

  const steps = [
    {
      icon: <Building2 className="h-5 w-5" />,
      text: __('onboarding.steps.restaurant_info'),
    },
    {
      icon: <ChefHat className="h-5 w-5" />,
      text: __('onboarding.steps.menu_setup'),
    },
    {
      icon: <Users2 className="h-5 w-5" />,
      text: __('onboarding.steps.staff_management'),
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      text: __('onboarding.steps.final_review'),
    },
  ];

  return (
    <>
      <Head title={__('onboarding.welcome')} />

      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl">
          <div className="-mt-12 flex justify-center">
            <img src="/images/icon.png" alt="IRMA Logo" className="w-72" />
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
              <ul className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                    <span className="text-lg font-medium">{step.text}</span>
                  </li>
                ))}
              </ul>

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
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
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
              className="w-full"
              size="lg"
              disabled={!agreed}
              onClick={handleContinue}
            >
              {__('onboarding.agreement.accept')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
