import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Message } from '@/components/ui/message';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout authentication>
      <Head title="Log in" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <div className="flex flex-col justify-start">
        <h3 className="font-dmsans text-5xl">Welcome Back</h3>
        <div className="flex flex-row gap-x-1">
          <p className="text-xs uppercase text-muted-foreground">
            dont have an account?
          </p>
          <Link
            href={route('register')}
            className="rounded-md text-xs uppercase text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
          >
            register
          </Link>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-y-4">
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
            autoFocus
            onChange={(e) => setData('email', e.target.value)}
          />
          <Message message={errors.email} className="mt-2" />

          {/* <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
            onChange={(e) => setData('email', e.target.value)}
          />

          <InputError message={errors.email} className="mt-2" /> */}
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
            autoComplete="current-password"
            onChange={(e) => setData('password', e.target.value)}
          />
          <Message message={errors.password} className="mt-2" />

          {/* <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={(e) => setData('password', e.target.value)}
          />

          <InputError message={errors.password} className="mt-2" /> */}
        </div>

        <div className="mt-2 flex flex-row justify-between">
          <div className="flex items-center">
            <Checkbox
              name="remember"
              checked={data.remember}
              onCheckedChange={(checked) => {
                if (checked !== 'indeterminate') {
                  setData('remember', checked);
                }
              }}
            />
            <Label className="ms-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </Label>
          </div>
          {canResetPassword && (
            <Link
              href={route('password.request')}
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
            >
              Forgot your password?
            </Link>
          )}
        </div>

        <div className="mt-2 flex flex-col items-center gap-y-4">
          <Button className="ms-4 w-full uppercase" disabled={processing}>
            Log in
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
