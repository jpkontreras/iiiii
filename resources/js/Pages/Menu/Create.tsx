import { Header } from '@/Components/Header';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { PageProps, Restaurant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  File,
  FileText,
  FileUp,
  ImageIcon,
  Table,
  Upload,
  X,
} from 'lucide-react';
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

interface FileWithPreview extends File {
  preview?: string;
}

const templateTypes = [
  {
    id: 'standard' as const,
    name: 'menu.standard',
    description: 'menu.standard_description',
    icon: FileText,
  },
  {
    id: 'qr_code' as const,
    name: 'menu.qr_code',
    description: 'menu.qr_code_description',
    icon: ImageIcon,
  },
  {
    id: 'digital_display' as const,
    name: 'menu.digital_display',
    description: 'menu.digital_display_description',
    icon: Table,
  },
];

export default function Create({ restaurant }: Props) {
  const [dragActive, setDragActive] = useState(false);
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

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const type = file.type.toLowerCase();
      return (
        type.includes('image') ||
        type.includes('pdf') ||
        type.includes('excel') ||
        type.includes('spreadsheet') ||
        file.name.endsWith('.csv')
      );
    });

    const filesWithPreviews = validFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      if (file.type.includes('image')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      return fileWithPreview;
    });

    setUploadedFiles((prev) => [...prev, ...filesWithPreviews]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    if (type.includes('image')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    if (type.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (
      type.includes('excel') ||
      type.includes('spreadsheet') ||
      file.name.endsWith('.csv')
    ) {
      return <Table className="h-8 w-8 text-green-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
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

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="p-6">
            <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {__('menu.import_title')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {__('menu.import_description')}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div
                  className={cn(
                    'relative rounded-lg border-2 border-dashed p-8 text-center',
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400',
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                        {__('menu.upload_file')}
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileInput}
                        accept=".jpg,.jpeg,.png,.pdf,.xlsx,.xls,.csv"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      {__('menu.drag_drop')}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {__('menu.supported_formats')}
                    </p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6">
                      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4"
                          >
                            <div className="flex items-center">
                              {getFileIcon(file)}
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  rows={3}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div>
                <InputLabel value={__('menu.template_type')} />
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {templateTypes.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        'relative rounded-lg border p-4',
                        data.template_type === template.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200',
                      )}
                    >
                      <label
                        htmlFor={`template-${template.id}`}
                        className="flex cursor-pointer flex-col"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {__(template.name)}
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          {__(template.description)}
                        </span>
                        <input
                          type="radio"
                          id={`template-${template.id}`}
                          name="template_type"
                          value={template.id}
                          checked={data.template_type === template.id}
                          onChange={(e) =>
                            setData(
                              'template_type',
                              e.target.value as TemplateType,
                            )
                          }
                          className="absolute right-2 top-2"
                        />
                      </label>
                    </div>
                  ))}
                </div>
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
                    value={__('menu.is_active')}
                    className="ml-2"
                  />
                </div>
                <InputError message={errors.is_active} className="mt-2" />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing} className="ml-4">
                  {__('menu.create')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
