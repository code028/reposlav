import React from 'react';
import { UploadCloud } from 'lucide-react'; // Lucide icon
import clsx from 'clsx';

// Definišemo FileWithProgress
type FileWithProgress = {
  file: File;
  progress: number;
  isUploading: boolean;
};

// Definišemo propove za FileUpload komponentu
type FileUploadProps = {
  onFileUpload: (files: FileWithProgress[]) => void;
  onCancelFile: (index: number) => void; // Dodajemo onCancelFile prop
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onCancelFile }) => {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      const filesArray = Array.from(files).map((file) => ({
        file,
        progress: 0,
        isUploading: true,
      }));
      onFileUpload(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files).map((file) => ({
        file,
        progress: 0,
        isUploading: true,
      }));
      onFileUpload(filesArray);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div
        className={clsx(
          'border-2 border-dashed border-gray-300 p-10 rounded-lg w-full max-w-lg',
          dragActive && 'border-indigo-500'
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-gray-500">
          <UploadCloud className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold">Превуците и пустите фајлове овде</p>
          <p className="mt-2">или</p>
          <label htmlFor="fileUpload" className="cursor-pointer mt-2">
            <span className="px-4 py-2 bg-black bg-opacity-80 text-white rounded-lg hover:bg-opacity-100">
              Отпремите са рачунара
            </span>
            <input
              id="fileUpload"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              required
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
