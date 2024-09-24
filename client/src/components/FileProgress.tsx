import React, { useEffect } from 'react';
import { CircleX, DiamondMinus } from 'lucide-react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileLines, FaFileZipper, FaFilePowerpoint } from "react-icons/fa6";
import { BsFiletypeSql, BsFiletypeMp3, BsFiletypeMp4 } from "react-icons/bs";
import { SiGooglechrome } from "react-icons/si";

type FileWithProgress = {
  file: File;
  progress: number;
};

type FileProgressProps = {
  fileWithProgress: FileWithProgress;
  onCancel: () => void;
  onDelete: () => void;
};

// Niz dozvoljenih ekstenzija
const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.pptx', '.sql', '.mp3', '.mp4', '.zip', '.webp', '.txt'];

// Funkcija za određivanje ikone na osnovu ekstenzije fajla
const getFileIcon = (fileName: string) => {
  const iconClass = "w-6 h-6 object-contain";
  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

  switch (extension) {
    case ".pdf":
      return <FaFilePdf className={`${iconClass} text-white`} />;
    case ".doc":
    case ".docx":
      return <FaFileWord className={`${iconClass} text-white`} />;
    case ".jpg":
    case ".jpeg":
    case ".png":
      return <FaFileImage className={`${iconClass} text-white`} />;
    case ".pptx":
      return <FaFilePowerpoint className={`${iconClass} text-white`} />;
    case ".sql":
      return <BsFiletypeSql className={`${iconClass} text-white`} />;
    case ".mp3":
      return <BsFiletypeMp3 className={`${iconClass} text-white`} />;
    case ".mp4":
      return <BsFiletypeMp4 className={`${iconClass} text-white`} />;
    case ".zip":
      return <FaFileZipper className={`${iconClass} text-white`} />;
    case ".webp":
      return <SiGooglechrome className={`${iconClass} text-white`} />;
    default:
      return <FaFileLines className={`${iconClass} text-white`} />;
  }
};

// Funkcija za proveru validnosti ekstenzije
const isFileExtensionAllowed = (fileName: string) => {
  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return allowedExtensions.includes(extension);
};

const FileProgress: React.FC<FileProgressProps> = ({ fileWithProgress, onCancel, onDelete }) => {
  const isUploading = fileWithProgress.progress < 100;
  const isExtensionAllowed = isFileExtensionAllowed(fileWithProgress.file.name);

  // Funkcija za skraćivanje imena fajla
  const truncateFileName = (fileName: string, maxLength: number) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.slice(fileName.lastIndexOf("."));
    const baseName = fileName.slice(0, fileName.lastIndexOf("."));
    return `${baseName.slice(0, maxLength)}...${extension}`;
  };

  // Koristi useEffect za brisanje nepodržanih fajlova nakon 1 sekunde
  useEffect(() => {
    if (!isExtensionAllowed) {
      const timer = setTimeout(() => {
        onDelete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isExtensionAllowed, onDelete]);

  // Validacija ekstenzije pre prikaza
  if (!isExtensionAllowed) {
    return (
      <div className="p-3 rounded-lg bg-red-600 bg-opacity-80 shadow-md text-white">
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold">Неподржан фајл: {truncateFileName(fileWithProgress.file.name, 35)}</div>
          <button className="ml-4" onClick={onDelete}>
            <CircleX className="hover:text-red-400 transition" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-3 rounded-lg bg-black bg-opacity-80 shadow-md text-white">
      {/* Ime fajla sa blur efektom i opacity dok traje upload */}
      <div
        className={`relative z-0 flex justify-between items-center transition-all duration-300 ${
          isUploading ? 'backdrop-blur-sm opacity-80' : ''
        }`}
      >
        {/* Ikona za fajl bazirana na ekstenziji */}
        <div className="flex items-center space-x-2">
          <div className="px-2">
            {getFileIcon(fileWithProgress.file.name)}
          </div>
          <div className="text-sm font-semibold">{truncateFileName(fileWithProgress.file.name, 35)}</div>
        </div>
        {fileWithProgress.progress === 100 && (
          <button className="ml-4" onClick={onDelete}>
            <CircleX className="hover:text-red-400 transition" />
          </button>
        )}
      </div>

      {/* Progress bar iznad imena fajla */}
      {isUploading && (
        <>
          <div
            className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 pl-2 pr-11"
            style={{ width: '100%' }}
          >
            <div className="bg-black h-5 z-10 w-full rounded-full">
              <div
                className="bg-white h-full rounded-full z-20 transition-all duration-500 ease-in-out"
                style={{ width: `${fileWithProgress.progress}%` }}
              />
            </div>
          </div>
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={onCancel}
          >
            <DiamondMinus />
          </button>
        </>
      )}
    </div>
  );
};

export default FileProgress;
