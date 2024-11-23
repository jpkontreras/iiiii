import ApplicationLogo from '@/Components/ApplicationLogo';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
  BadgeCheck,
  Building2,
  ChevronsUpDown,
  CreditCard,
  Home,
  LogOut,
  Sparkles,
  UserIcon,
} from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const {
    breadcrumbs,
    auth: { user },
  } = usePage().props;

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <SidebarHeader className="p-6">
          <Link href="/">
            <ApplicationLogo />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href={route('dashboard')}
                  className="flex items-center space-x-3 px-6 py-3 text-base hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <Home className="h-6 w-6" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  // href={route('restaurants.index')}
                  className="flex items-center space-x-3 px-6 py-3 text-base hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <Building2 className="h-6 w-6" />
                  <span>Restaurants</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Uncomment these when you have created the corresponding routes
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={route('menus.index')} className="flex items-center space-x-3 px-6 py-3 text-base hover:bg-gray-200 dark:hover:bg-gray-800">
                    <Utensils className="h-6 w-6" />
                    <span>Menus</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={route('reservations.index')} className="flex items-center space-x-3 px-6 py-3 text-base hover:bg-gray-200 dark:hover:bg-gray-800">
                    <Calendar className="h-6 w-6" />
                    <span>Reservations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={route('orders.index')} className="flex items-center space-x-3 px-6 py-3 text-base hover:bg-gray-200 dark:hover:bg-gray-800">
                    <ClipboardList className="h-6 w-6" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={route('settings.index')} className="flex items-center space-x-3 px-6 py-3 text-base hover:bg-gray-200 dark:hover:bg-gray-800">
                    <Settings className="h-6 w-6" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              */}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={route('profile.edit')}
                        className="flex w-full items-center"
                      >
                        <UserIcon className="h-5 w-5" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center"
                      >
                        <LogOut />
                        Log out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>

          {/*   <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <UserIcon className="h-6 w-6 flex-shrink-0" />
                <span className="flex-grow truncate text-left">
                  {user.name}
                </span>
                <ChevronUp className="h-5 w-5 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-64">
              <DropdownMenuItem asChild>
                <Link
                  href={route('profile.edit')}
                  className="flex items-center space-x-3 px-4 py-2"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Log Out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <header className="bg-white shadow-sm dark:bg-gray-800">
            <div className="flex w-full items-center justify-between px-6 py-4">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4 text-gray-500 hover:text-gray-600 focus:text-gray-600 focus:outline-none" />
                <div className="px-6">
                  {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                </div>
              </div>
            </div>
            <Separator />
            {header}
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-6 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
