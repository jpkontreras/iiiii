import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function Header({ back, title }: { back?: string; title: string }) {
  return (
    <div className="flex w-full flex-col justify-center gap-y-2 bg-gray-200 px-10 py-4">
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
      <h2 className="font-prompt ml-2 text-3xl font-bold uppercase text-gray-900">
        {title}
      </h2>
    </div>
  );
}
