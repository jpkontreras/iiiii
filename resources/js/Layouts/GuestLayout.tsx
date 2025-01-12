import ApplicationLogo from '@/Components/ApplicationLogo';
import { PropsWithChildren } from 'react';

export default function Guest({
  children,
  authentication = false,
}: PropsWithChildren<{ authentication?: boolean }>) {
  if (authentication) {
    return (
      <div className="grid min-h-screen grid-cols-2 bg-gray-50">
        <div className="flex flex-col items-center bg-white py-16 shadow-inner lg:py-10">
          <div className="rounded-full bg-gray-50 p-5">
            <ApplicationLogo className="size-64 fill-current text-gray-500 lg:size-56" />
          </div>
          <div className="mt-6 w-full overflow-hidden px-6 py-4 dark:bg-gray-800 sm:max-w-md">
            {children}
          </div>
        </div>
        <div className="bg-gray-50"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
      <ApplicationLogo className="h-60 w-60 fill-current text-gray-500" />
      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
        {children}
      </div>
    </div>
  );
}
