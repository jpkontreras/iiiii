import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export function Header({
  title,
  subtitle,
  showBackButton = true,
}: HeaderProps) {
  console.log({ x: usePage().props });

  const { ziggy } = usePage().props as {
    ziggy: {
      location: string;
      routes: Record<
        string,
        {
          uri: string;
          methods: string[];
          parameters?: string[];
        }
      >;
    };
  };

  // Function to get all possible route patterns for a resource
  const getResourcePatterns = () => {
    const patterns = new Set<string>();

    // Get all routes that contain 'restaurants' (or other resources)
    Object.entries(ziggy.routes)
      .filter(([name]) => name.startsWith('restaurants.'))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .forEach(([_, route]) => {
        const lastSegment = route.uri.split('/').pop();
        if (lastSegment && !lastSegment.includes('{')) {
          patterns.add(lastSegment);
        }
      });

    return Array.from(patterns);
  };

  // Function to determine if we can go back and where to go
  const getBackRoute = () => {
    const currentPath = new URL(ziggy.location).pathname;
    const segments = currentPath.split('/').filter(Boolean);
    const resourcePatterns = getResourcePatterns();

    // If we're at root level or have no segments, no back navigation
    if (segments.length <= 1) return null;

    // Remove the last segment if it's a known route pattern
    const lastSegment = segments[segments.length - 1];
    console.log({ lastSegment });

    if (resourcePatterns.includes(lastSegment)) {
      segments.pop();
    }

    if (segments.length > 0) {
      segments.pop();
      return '/' + segments.join('/');
    }

    return null;
  };

  const lastSegment = () => {
    const patterns = getResourcePatterns();
    const currentPath = new URL(ziggy.location);
    console.log({ currentPath });
  };

  const backRoute = getBackRoute();
  const ls = lastSegment();

  const handleBack = () => {
    if (backRoute) {
      router.visit(backRoute);
    }
  };

  return (
    <div className="flex w-full flex-col justify-center gap-y-2 bg-stone-100 px-10 py-4">
      <h2 className="flex flex-row">
        {showBackButton && backRoute && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft size={48} />
            <span className="font-montserrat uppercase text-gray-500">
              Back
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
