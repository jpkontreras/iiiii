import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  back?: string;
  title: string;
  subtitle?: string;
}

export function Header({ back, title, subtitle }: HeaderProps) {
  return (
    <div className="flex w-full flex-col justify-center gap-y-2 bg-stone-100 px-10 py-4">
      <h2 className="flex flex-row">
        {back && (
          <Button variant="ghost" size="sm">
            <ArrowLeft size={48} />
            <span className="font-montserrat uppercase text-gray-500">
              {back}
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
