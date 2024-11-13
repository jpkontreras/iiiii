import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Sidebar className="fixed">
          <SidebarHeader className="border-b border-border/50">
            <div className="flex items-center justify-center px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <img
                  src="/images/transparent2.svg"
                  className="bg- w-full rounded-3xl"
                  alt="Logo"
                />
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-5">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('dashboard')}
                  tooltip="Dashboard"
                >
                  <Link href={route('dashboard')}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('profile.edit')}
                  tooltip="Profile"
                >
                  <Link href={route('profile.edit')}>
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                  <Link href={route('logout')} method="post" as="button">
                    <LogOut />
                    <span>Log Out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex w-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 flex flex-row border-b bg-white shadow-sm dark:bg-gray-800">
            <SidebarTrigger />
            <div className="px-4 py-6 sm:px-6 lg:px-8">{header}</div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
