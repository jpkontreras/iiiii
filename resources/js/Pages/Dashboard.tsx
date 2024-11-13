import { Header } from '@/Components/Header';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const messages = {
  title: 'The quick brown fox jumps over the lazy dog.',
};

export default function Dashboard(data) {
  console.log({ data });

  return (
    <AuthenticatedLayout header={<Header {...messages} />}>
      <Head title="Dashboard" />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
          <div className="p-6 text-gray-900 dark:text-gray-100">
            You're logged in!
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
