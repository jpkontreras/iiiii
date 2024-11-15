import { cn } from '@/lib/utils';
import { __ } from 'laravel-translator';
import {
  File,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileUp,
  ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';

export interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
}

interface FileUploaderProps {
  /**
   * Array of accepted file types (e.g., ['.jpg', '.pdf'])
   */
  accept?: string[];
  /**
   * Maximum number of files allowed
   */
  maxFiles?: number;
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Custom validation function
   */
  validate?: (file: File) => boolean;
  /**
   * Callback when files are added
   */
  onFilesAdded: (files: FileWithPreview[]) => void;
  /**
   * Callback when a file is removed
   */
  onFileRemoved: (index: number) => void;
  /**
   * Currently uploaded files
   */
  files: FileWithPreview[];
  /**
   * Custom title for the uploader
   */
  title?: string;
  /**
   * Custom description for the uploader
   */
  description?: string;
  /**
   * Custom optional for the uploader
   */
  optional?: string;
  /**
   * Custom class name for the container
   */
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUploader({
  accept = [
    '.jpg',
    '.jpeg',
    '.png',
    '.pdf',
    '.xlsx',
    '.xls',
    '.csv',
    '.zip',
    '.rar',
    '.json',
    '.xml',
  ],
  maxFiles = Infinity,
  maxSize = 50 * 1024 * 1024, // 50MB default
  validate,
  onFilesAdded,
  onFileRemoved,
  files,
  title = __('menu.import_title'),
  description = __('menu.import_description'),
  optional = __('menu.upload_optional_message'),
  className,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

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

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      // You might want to show a toast or error message here
      return;
    }

    const validFiles = newFiles.filter((file) => {
      const isValidType = accept.some((type) =>
        file.name.toLowerCase().endsWith(type.toLowerCase()),
      );
      const isValidSize = file.size <= maxSize;
      const passesCustomValidation = validate ? validate(file) : true;

      return isValidType && isValidSize && passesCustomValidation;
    });

    const filesWithPreviews = validFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      if (file.type.includes('image')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      fileWithPreview.uploadProgress = 100; // Simulated upload progress
      return fileWithPreview;
    });

    onFilesAdded(filesWithPreviews);
  };

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (type.includes('image')) {
      return <ImageIcon className="h-10 w-10 text-purple-500" />;
    }
    if (type.includes('pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    }
    if (
      type.includes('excel') ||
      type.includes('spreadsheet') ||
      name.endsWith('.csv')
    ) {
      return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    }
    if (name.endsWith('.zip') || name.endsWith('.rar')) {
      return <FileArchive className="h-10 w-10 text-yellow-500" />;
    }
    if (name.endsWith('.json') || name.endsWith('.xml')) {
      return <FileCode className="h-10 w-10 text-blue-500" />;
    }
    return <File className="h-10 w-10 text-gray-500" />;
  };

  return (
    <div
      className={cn(
        'min-h-[600px] rounded-lg bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6',
        className,
      )}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Upload className="h-8 w-8 text-indigo-600" />
        </div>
        <div className="ml-4">
          <h3 className="flex flex-row gap-x-2 text-lg font-medium text-gray-900">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          {maxFiles !== Infinity && (
            <p className="mt-1 text-sm font-bold text-gray-500">
              {__('menu.max_files_allowed', { count: maxFiles })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex-1">
        <div
          className={cn(
            'relative flex min-h-[400px] rounded-lg border-2 border-dashed p-8 transition-all duration-200',
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-gray-300 hover:border-gray-400',
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {files.length === 0 ? (
            <div className="flex h-full flex-1 flex-col items-center justify-center self-center">
              <FileUp className="h-16 w-16 text-indigo-400" />
              <div className="mt-4 text-center">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
                >
                  {__('menu.upload_file')}
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileInput}
                    accept={accept.join(',')}
                  />
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  {__('menu.drag_drop')}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {__('menu.supported_formats')}
                </p>
                <p className="mt-4 font-montserrat text-xs text-gray-700">
                  {optional}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-50">
                          {getFileIcon(file)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => onFileRemoved(index)}
                          className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {file.type || 'Unknown type'}
                        </span>
                      </div>
                      {typeof file.uploadProgress !== 'undefined' && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                              style={{
                                width: `${file.uploadProgress}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <label
                  htmlFor="file-upload-more"
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Add more files
                  <input
                    id="file-upload-more"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileInput}
                    accept={accept.join(',')}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 *
 */
