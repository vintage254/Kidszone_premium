"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '../ui/button';
import { Plus, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
  const onUpload = (result: any) => {
    const newUrl = result.info.secure_url;
    onChange([...value, newUrl]);
  };

  const onRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Product Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="YOUR_UPLOAD_PRESET">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button type="button" variant="secondary" onClick={onClick} disabled={value.length >= 4}>
              <Plus className="h-4 w-4 mr-2" />
              Upload an Image (up to 4)
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploader;
