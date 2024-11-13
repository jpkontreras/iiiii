import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MenuItem, Menu as MenuType, PageProps, Restaurant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FileUp, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props extends PageProps {
  restaurant: Restaurant;
  menu: MenuType;
}

interface FormData {
  name: string;
  description: string;
  template_type: 'predefined' | 'custom';
  is_active: boolean;
  items: MenuItem[];
  items_to_delete: number[];
}

export default function Edit({ restaurant, menu }: Props) {
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors } = useForm<FormData>({
    name: menu.name,
    description: menu.description || '',
    template_type: menu.template_type,
    is_active: menu.is_active,
    items: menu.menuItems || [],
    items_to_delete: [],
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('restaurants.menus.update', [restaurant.id, menu.id]));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload for additional items
      // TODO: Implement file processing for additional items
    }
  };

  const addNewItem = () => {
    setData('items', [
      ...data.items,
      {
        id: 0, // Temporary ID for new items
        menu_id: menu.id,
        name: '',
        description: '',
        price: 0,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  };

  const updateItem = (index: number, field: keyof MenuItem, value: unknown) => {
    const updatedItems = [...data.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setData('items', updatedItems);
  };

  const removeItem = (index: number) => {
    const item = data.items[index];
    if (item.id) {
      setData('items_to_delete', [...data.items_to_delete, item.id]);
    }
    const updatedItems = data.items.filter((_, i) => i !== index);
    setData('items', updatedItems);
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit ${menu.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Edit Menu
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Update menu details and items
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <InputLabel htmlFor="name" value="Menu Name" />
                  <TextInput
                    id="name"
                    type="text"
                    value={data.name}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                  <InputLabel
                    htmlFor="description"
                    value="Description (Optional)"
                  />
                  <textarea
                    id="description"
                    value={data.description}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="template_type" value="Template Type" />
                  <select
                    id="template_type"
                    value={data.template_type}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) =>
                      setData(
                        'template_type',
                        e.target.value as FormData['template_type'],
                      )
                    }
                  >
                    <option value="custom">Custom</option>
                    <option value="predefined">Predefined</option>
                  </select>
                  <InputError message={errors.template_type} className="mt-2" />
                </div>

                <div>
                  <div className="flex items-center">
                    <input
                      id="is_active"
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    <InputLabel
                      htmlFor="is_active"
                      value="Active"
                      className="ml-2"
                    />
                  </div>
                  <InputError message={errors.is_active} className="mt-2" />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Menu Items
                    </h3>
                    <Button
                      type="button"
                      onClick={addNewItem}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {data.items.map((item, index) => (
                      <div
                        key={item.id || `new-${index}`}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            Item #{index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <InputLabel
                              htmlFor={`item-name-${index}`}
                              value="Name"
                            />
                            <TextInput
                              id={`item-name-${index}`}
                              type="text"
                              value={item.name}
                              className="mt-1 block w-full"
                              onChange={(e) =>
                                updateItem(index, 'name', e.target.value)
                              }
                              required
                            />
                          </div>

                          <div>
                            <InputLabel
                              htmlFor={`item-price-${index}`}
                              value="Price"
                            />
                            <TextInput
                              id={`item-price-${index}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.price}
                              className="mt-1 block w-full"
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  'price',
                                  parseFloat(e.target.value),
                                )
                              }
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <InputLabel
                              htmlFor={`item-description-${index}`}
                              value="Description (Optional)"
                            />
                            <textarea
                              id={`item-description-${index}`}
                              value={item.description}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              onChange={(e) =>
                                updateItem(index, 'description', e.target.value)
                              }
                              rows={2}
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              id={`item-available-${index}`}
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                              checked={item.is_available}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  'is_available',
                                  e.target.checked,
                                )
                              }
                            />
                            <InputLabel
                              htmlFor={`item-available-${index}`}
                              value="Available"
                              className="ml-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Import Additional Items
                  </h3>

                  <div
                    className={`rounded-lg border-2 border-dashed p-6 text-center ${
                      dragActive
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                      >
                        Upload a file
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf,.xlsx,.xls,.csv"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        or drag and drop
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Supported formats: Images, PDF, Excel, CSV
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={processing} className="ml-4">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
