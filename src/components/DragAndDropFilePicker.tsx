import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_FILES = [".png", ".jpg", ".jpeg", ".gif"];

interface DragAndDropFilePickerProps {
  onChange: (files: File | File[] | null) => void; // Can return a single file or an array
  multiple?: boolean; // Optional prop to allow multiple files
  maxFilesCount?: number;
  uploadedFiles?: { id: number; url: string }[];
}

const DragAndDropFilePicker = ({
  onChange,
  multiple = false, // Default to single file upload
  maxFilesCount = Infinity,
  uploadedFiles,
}: DragAndDropFilePickerProps) => {
  const [files, setFiles] = useState<File[]>([]); // Store files

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        if (files.length >= maxFilesCount) {
          toast.warning(`Maximum files count is ${maxFilesCount} !`);
          return;
        }

        if (acceptedFiles.length > maxFilesCount) {
          acceptedFiles = acceptedFiles.slice(0, maxFilesCount);

          toast.warning(`Maximum files count is ${maxFilesCount} !`);
        }

        // If multiple uploads are allowed, append new files to the existing list
        const updatedFiles = [...files, ...acceptedFiles];
        setFiles(updatedFiles);
        onChange(updatedFiles); // Pass the array of files
      } else {
        // If single upload is allowed, replace the existing file
        const singleFile = acceptedFiles[0]; // Only keep the first file
        setFiles(singleFile ? [singleFile] : []); // Store as an array for consistency
        onChange(singleFile || null); // Pass a single file or null
      }
    },
    [files, onChange, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": ALLOWED_FILES, // Accept only image files
    },
    multiple,
  });

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index); // Remove the file at the specified index
    setFiles(updatedFiles);
    if (multiple) {
      onChange(updatedFiles.length > 0 ? updatedFiles : []); // Pass the updated array
    } else {
      onChange(updatedFiles[0] || null); // Pass a single file or null
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors min-h-[175px] ${
          isDragActive
            ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/20"
            : "border-secondary-300 bg-secondary-50/50 dark:border-secondary-600 dark:bg-secondary-700/20"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="w-8 h-8 text-secondary-500 dark:text-secondary-400" />
          {isDragActive ? (
            <p className="text-primary-500 dark:text-primary-300">
              Drop the {multiple ? "images" : "image"} here...
            </p>
          ) : (
            <>
              <p className="text-secondary-700 dark:text-secondary-300">
                Drag & drop {multiple ? "images" : "an image"} here, or click to{" "}
                {multiple ? "select files" : "select a file"}
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Only (
                {ALLOWED_FILES.map((fileType) => `*${fileType}`).join(", ")})
                files are accepted
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3 flex-wrap bg-secondary-100/50 dark:bg-secondary-700/20 p-3 rounded-lg">
          {uploadedFiles?.map((file) => (
            <div key={file.id} className="relative">
              <img
                className="size-18 object-cover rounded-lg"
                src={file.url}
                alt=""
              />
              <button
                type="button"
                // onClick={() => removeFile(index)}
                className="absolute -top-2 -right-1 bg-secondary-200 hover:bg-secondary-300 transition-colors duration-200 rounded-full text-white"
              >
                <X className="size-4 cursor-pointer" />
              </button>
              <span
                className="absolute -top-1 -left-1 
                    size-3
                  bg-primary-300 
                    rounded-full"
              />
            </div>
          ))}
          {files.map((file, index) => (
            <div key={file.name} className="relative">
              <img
                className="size-18 object-cover rounded-lg"
                src={URL.createObjectURL(file)}
                alt=""
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-1 bg-secondary-200 hover:bg-secondary-300 transition-colors duration-200 rounded-full text-white"
              >
                <X className="size-4 cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragAndDropFilePicker;
