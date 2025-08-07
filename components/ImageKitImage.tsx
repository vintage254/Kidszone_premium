"use client";

import { ImageKitProvider, IKImage } from "imagekitio-next";
import config from "@/lib/config";
import { FileText } from 'lucide-react';

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

interface ImageKitImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ImageKitImage = ({ src, alt, width, height, className }: ImageKitImageProps) => {
  if (!publicKey || !urlEndpoint) {
    return <div>ImageKit not configured.</div>;
  }

  if (src.endsWith('.pdf')) {
    return (
      <div className="flex items-center p-2 rounded-md bg-gray-100 dark:bg-dark-400 max-w-xs">
        <FileText className="mr-2 h-8 w-8 text-blue-500 flex-shrink-0" />
        <a 
          href={src} 
          target="_blank" 
          rel="noopener noreferrer" 
          title={src.split('/').pop()}
          className="ml-2 text-sm text-blue-500 hover:underline break-all"
        >
          {truncateFileName(src.split('/').pop())}
        </a>
      </div>
    );
  }
  
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKImage src={src} alt={alt} width={width} height={height} className={className} />
    </ImageKitProvider>
  );
};

export default ImageKitImage;
