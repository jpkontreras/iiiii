import { Header } from '@/Components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  AlertTriangle,
  BarChart3,
  ChefHat,
  Clock,
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
} from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  hasMenu: boolean;
}

interface Props {
  restaurant: Restaurant;
}

export default function Dashboard({ restaurant }: Props) {
  return (
    <AuthenticatedLayout
      header={
        <Header
          title={__('dashboard.title', {
            name: restaurant.name,
          })}
          subtitle={__('dashboard.managing_restaurant', {
            name: restaurant.name,
          })}
        />
      }
    >
      <Head title={`${restaurant.name} - ${__('dashboard.title')}`} />

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {!restaurant.hasMenu && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="flex items-center gap-4 p-6">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">
                  {__('dashboard.warnings.no_menu_title')}
                </h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {__('dashboard.warnings.no_menu_description')}
                </p>
              </div>
              <Link
                href={route('restaurants.menus.create', {
                  restaurant: restaurant.id,
                })}
                className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
              >
                {__('dashboard.warnings.create_menu')}
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${!restaurant.hasMenu ? 'pointer-events-none opacity-50' : ''}`}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {__('dashboard.stats.total_revenue')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {restaurant.hasMenu ? (
                <>
                  <div className="text-2xl font-bold">$15,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    {__('dashboard.stats.from_last_month', { percent: '20.1' })}
                  </p>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  {__('dashboard.empty_states.revenue')}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {__('dashboard.stats.total_orders')}
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {restaurant.hasMenu ? (
                <>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    {__('dashboard.stats.since_last_hour', { count: '201' })}
                  </p>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  {__('dashboard.empty_states.orders')}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {__('dashboard.stats.active_tables')}
              </CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {restaurant.hasMenu ? (
                <>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    {__('dashboard.stats.tables_available', { count: '7' })}
                  </p>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  {__('dashboard.empty_states.tables')}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {__('dashboard.stats.staff_online')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {restaurant.hasMenu ? (
                <>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    {__('dashboard.stats.starting_next_shift', { count: '3' })}
                  </p>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  {__('dashboard.empty_states.staff')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          defaultValue="overview"
          className={`space-y-4 ${!restaurant.hasMenu ? 'pointer-events-none opacity-50' : ''}`}
        >
          <TabsList>
            <TabsTrigger value="overview">
              {__('dashboard.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {__('dashboard.tabs.orders')}
            </TabsTrigger>
            <TabsTrigger value="menu">{__('dashboard.tabs.menu')}</TabsTrigger>
            <TabsTrigger value="staff">
              {__('dashboard.tabs.staff')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Recent Orders */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>{__('dashboard.orders.recent_orders')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {restaurant.hasMenu ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {__('dashboard.orders.order_id')}
                          </TableHead>
                          <TableHead>{__('dashboard.orders.status')}</TableHead>
                          <TableHead>{__('dashboard.orders.items')}</TableHead>
                          <TableHead className="text-right">
                            {__('dashboard.orders.amount')}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">#4532</TableCell>
                          <TableCell>
                            <Badge>
                              {__('dashboard.orders.statuses.in_progress')}
                            </Badge>
                          </TableCell>
                          <TableCell>3</TableCell>
                          <TableCell className="text-right">$42.50</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#4531</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {__('dashboard.orders.statuses.completed')}
                            </Badge>
                          </TableCell>
                          <TableCell>1</TableCell>
                          <TableCell className="text-right">$15.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#4530</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {__('dashboard.orders.statuses.completed')}
                            </Badge>
                          </TableCell>
                          <TableCell>4</TableCell>
                          <TableCell className="text-right">$68.75</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                      <ShoppingBag className="mb-2 h-8 w-8" />
                      <p>{__('dashboard.empty_states.recent_orders')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>{__('dashboard.quick_actions.title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      // href={route('restaurants.menus.edit', {
                      //   restaurant: restaurant.id,
                      // })}
                      className="block"
                    >
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <ChefHat className="mb-2 h-6 w-6" />
                          <span className="text-sm font-medium">
                            {__('dashboard.quick_actions.update_menu')}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link
                      href={route('restaurants.reservations', {
                        restaurant: restaurant.id,
                      })}
                      className="block"
                    >
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <Clock className="mb-2 h-6 w-6" />
                          <span className="text-sm font-medium">
                            {__('dashboard.quick_actions.reservations')}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link
                      href={route('restaurants.reports', {
                        restaurant: restaurant.id,
                      })}
                      className="block"
                    >
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <BarChart3 className="mb-2 h-6 w-6" />
                          <span className="text-sm font-medium">
                            {__('dashboard.quick_actions.view_reports')}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link
                      href={route('restaurants.staff', {
                        restaurant: restaurant.id,
                      })}
                      className="block"
                    >
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <Users className="mb-2 h-6 w-6" />
                          <span className="text-sm font-medium">
                            {__('dashboard.quick_actions.manage_staff')}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{__('dashboard.orders.all_orders')}</CardTitle>
              </CardHeader>
              <CardContent>
                {restaurant.hasMenu ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{__('dashboard.orders.order_id')}</TableHead>
                        <TableHead>{__('dashboard.orders.customer')}</TableHead>
                        <TableHead>{__('dashboard.orders.status')}</TableHead>
                        <TableHead>{__('dashboard.orders.items')}</TableHead>
                        <TableHead>{__('dashboard.orders.table')}</TableHead>
                        <TableHead className="text-right">
                          {__('dashboard.orders.amount')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{/* Add more order rows here */}</TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <ShoppingBag className="mb-2 h-8 w-8" />
                    <p>{__('dashboard.empty_states.all_orders')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{__('dashboard.menu.management')}</CardTitle>
              </CardHeader>
              <CardContent>
                {restaurant.hasMenu ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Add menu items here */}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <ChefHat className="mb-2 h-8 w-8" />
                    <p>{__('dashboard.empty_states.menu')}</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link
                        href={route('restaurants.menus.create', {
                          restaurant: restaurant.id,
                        })}
                      >
                        {__('dashboard.warnings.create_menu')}
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{__('dashboard.staff.management')}</CardTitle>
              </CardHeader>
              <CardContent>
                {restaurant.hasMenu ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{__('dashboard.staff.name')}</TableHead>
                        <TableHead>{__('dashboard.staff.role')}</TableHead>
                        <TableHead>{__('dashboard.staff.status')}</TableHead>
                        <TableHead>{__('dashboard.staff.schedule')}</TableHead>
                        <TableHead className="text-right">
                          {__('dashboard.staff.actions')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{/* Add staff rows here */}</TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <Users className="mb-2 h-8 w-8" />
                    <p>{__('dashboard.empty_states.staff_management')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
