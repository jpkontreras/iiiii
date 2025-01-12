import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Message } from '@/components/ui/message';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout authentication>
      <Head title="Register" />
      <div className="flex flex-col justify-start">
        <h3 className="font-dmsans text-5xl">Welcome Back</h3>
        <div className="flex flex-row gap-x-1">
          <p className="text-xs uppercase text-muted-foreground">
            Already have an account?
          </p>
          <Link
            href={route('login')}
            className="rounded-md text-xs uppercase text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
          >
            sign-in
          </Link>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-y-4">
        <div>
          <Label htmlFor="name" className="font-dmsans">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            autoFocus
            onChange={(e) => setData('name', e.target.value)}
            required
          />
          <Message message={errors.name} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="email" className="font-dmsans">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            required
          />
          <Message message={errors.email} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password" className="font-dmsans">
            Password
          </Label>

          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
            required
          />
          <Message message={errors.password} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password_confirmation" className="font-dmsans">
            Confirm Password
          </Label>

          <Input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            required
          />
          <Message message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4 flex flex-col items-center gap-y-4">
          <Button
            className="font-dmsans w-full text-base"
            disabled={processing}
          >
            Create Your Account
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
