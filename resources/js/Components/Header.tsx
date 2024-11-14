import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  back?: string;
  title: string;
  subtitle?: string;
}

interface BreadcrumbItem {
  title: string;
  url: string;
  current: boolean;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { breadcrumbs = [] } = usePage().props as {
    breadcrumbs?: BreadcrumbItem[];
  };

  const previousPage =
    breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  // console.log({ title, subtitle });
  // console.log({ previousPage });

  const handleBack = () => {
    if (previousPage) {
      router.visit(previousPage.url);
    }
  };

  return (
    <div className="flex w-full flex-col justify-center gap-y-2 bg-stone-100 px-10 py-4">
      <h2 className="flex flex-row">
        {previousPage && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft size={48} />
            <span className="font-montserrat uppercase text-gray-500">
              {previousPage.title}
            </span>
          </Button>
        )}
      </h2>
      <div className="ml-2">
        <h2 className="font-prompt text-3xl font-bold text-gray-900">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
