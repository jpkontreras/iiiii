import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, usePage } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { HomeIcon } from 'lucide-react';
import React from 'react';

interface BreadcrumbItem {
  title: string;
  url: string;
  current: boolean;
}

const Breadcrumbs: React.FC = () => {
  const { breadcrumbs = [] } = usePage().props as {
    breadcrumbs?: BreadcrumbItem[];
  };
  console.log({ breadcrumbs });

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.current ? (
                <BreadcrumbPage>
                  {item.title === 'home' ? (
                    <HomeIcon className="h-4 w-4" />
                  ) : (
                    __(item.title)
                  )}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.url}>
                    {item.title === 'home' ? (
                      <HomeIcon className="h-4 w-4" />
                    ) : (
                      __(item.title)
                    )}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
