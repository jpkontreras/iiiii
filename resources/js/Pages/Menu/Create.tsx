import { FileUploader, FileWithPreview } from '@/Components/FileUploader';
import { Header } from '@/Components/Header';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Restaurant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { FormEvent, useState } from 'react';

interface Props extends PageProps {
  restaurant: Restaurant;
}

type TemplateType = 'standard' | 'qr_code' | 'digital_display';

interface FormData {
  name: string;
  description: string;
  template_type: TemplateType;
  is_active: boolean;
  file: File | null;
}

export default function Create({ restaurant }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);

  const { data, setData, post, processing, errors } = useForm<FormData>({
    name: '',
    description: '',
    template_type: 'standard',
    is_active: true,
    file: null,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    (Object.keys(data) as Array<keyof FormData>).forEach((key) => {
      const value = data[key];
      if (value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    uploadedFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    post(route('restaurants.menus.store', restaurant.id));
  };

  const handleFilesAdded = (files: FileWithPreview[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemoved = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <Header
          title={__('menu.create')}
          subtitle={__('menu.manage_menus_for', {
            restaurant: restaurant.name,
          })}
        />
      }
    >
      <Head title={__('menu.create')} />

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left Column - 2/6 width */}
              <div className="lg:w-2/6">
                <div className="space-y-6">
                  <div>
                    <InputLabel htmlFor="name" value={__('menu.name')} />
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
                      value={__('menu.description_optional')}
                    />
                    <textarea
                      id="description"
                      value={data.description}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData('description', e.target.value)}
                      rows={6}
                    />
                    <InputError message={errors.description} className="mt-2" />
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
                        value={__('menu.is_active')}
                        className="ml-2"
                      />
                    </div>
                    <InputError message={errors.is_active} className="mt-2" />
                  </div>
                </div>
              </div>

              {/* Right Column - 4/6 width */}
              <div className="lg:w-4/6">
                <FileUploader
                  files={uploadedFiles}
                  onFilesAdded={handleFilesAdded}
                  onFileRemoved={handleFileRemoved}
                  maxFiles={10}
                  maxSize={10 * 1024 * 1024} // 10MB
                  accept={[
                    '.jpg',
                    '.jpeg',
                    '.png',
                    '.pdf',
                    '.xlsx',
                    '.xls',
                    '.csv',
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={processing} className="ml-4">
                {__('menu.create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
