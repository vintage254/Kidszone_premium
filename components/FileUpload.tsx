"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import ImageKit from "imagekit";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UploadCloud, FileText, X } from 'lucide-react';

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch('/api/imagekit');

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  onUploadStateChange?: (isLoading: boolean) => void;
  value?: string;
}

const truncateFileName = (fileName: string | undefined, startLen = 10, endLen = 10): string => {
  if (!fileName) return '';
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) { // No extension
    if (fileName.length > startLen + endLen + 3) {
      return `${fileName.substring(0, startLen)}...${fileName.substring(fileName.length - endLen)}`;
    }
    return fileName;
  }
  const name = fileName.slice(0, dotIndex);
  const extension = fileName.slice(dotIndex);
  if (name.length > startLen + endLen + 3) {
    return `${name.substring(0, startLen)}...${name.substring(name.length - endLen)}${extension}`;
  }
  return fileName;
};

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  onUploadStateChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [fileUrl, setFileUrl] = useState<string | null>(value ?? null);

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFileUrl(null);
    onFileChange("");
  };
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    onUploadStateChange?.(false);
    console.log(error);

    toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} upload failed`, {
      description: `Your ${type} could not be uploaded. Please try again.`,
    });
  };

  const onSuccess = (res: any) => {
    setFileUrl(res.url);
    onFileChange(res.url);
    onUploadStateChange?.(false);

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`, {
      description: "File uploaded successfully!",
    });
  };

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "Please upload a file that is less than 20MB in size",
        });

        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "Please upload a file that is less than 50MB in size",
        });
        return false;
      }
    }

    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => {
          setProgress(0);
          onUploadStateChange?.(true);
        }}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);

          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      {!fileUrl && (
        <button
          className={cn("upload-btn", styles.button)}
          onClick={(e) => {
            e.preventDefault();
            if (ikUploadRef.current) {
              // @ts-ignore
              ikUploadRef.current?.click();
            }
          }}
        >
          <UploadCloud className="mr-2" />
          <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        </button>
      )}

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {fileUrl && (
        <div className="mt-4 w-full max-w-xs">
          {type === 'image' && !fileUrl.endsWith('.pdf') ? (
            <IKImage src={fileUrl} alt="Uploaded image preview" width={200} height={200} className="rounded-md object-cover" />
          ) : type === 'video' ? (
            <IKVideo src={fileUrl} width="200" controls className="rounded-md" />
          ) : fileUrl.endsWith('.pdf') ? (
            <div className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-dark-400">
              <div className="flex items-center">
                <FileText className="mr-2 h-8 w-8 text-blue-500" />
                                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title={fileUrl.split('/').pop()}
                  className="ml-2 text-sm text-blue-500 hover:underline"
                >
                  {truncateFileName(fileUrl.split('/').pop())}
                </a>
              </div>
              <button onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-300">
                <X size={16} />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
