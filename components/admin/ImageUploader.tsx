"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';

interface ImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const ImageUploader = ({ value = [], onChange }: ImageUploaderProps) => {
  // Ensure we always have an array
  const imageUrls = Array.isArray(value) ? value : [];
  
  console.log('📊 ImageUploader - Images count:', imageUrls.length);

  const handleUpload = useCallback((result: any, slotIndex?: number) => {
    if (result?.info?.secure_url) {
      const newUrl = result.info.secure_url;
      const currentImages = Array.isArray(value) ? value : [];
      
      console.log('🔄 Before upload - Current images from value prop:', currentImages);
      console.log('📤 New image URL:', newUrl);
      
      // Prevent duplicates
      if (currentImages.includes(newUrl)) {
        console.log('❌ Duplicate image detected, skipping');
        return;
      }

      let newImages: string[];
      
      if (typeof slotIndex === 'number' && slotIndex < currentImages.length) {
        // Replace specific slot
        newImages = [...currentImages];
        newImages[slotIndex] = newUrl;
        console.log('🔄 Replacing slot', slotIndex, 'with new image');
      } else {
        // Add to the end
        newImages = [...currentImages, newUrl];
        console.log('➕ Adding new image to end');
      }
      
      console.log('✅ Calling onChange with new images array:', newImages);
      onChange(newImages);
    }
  }, [value, onChange]);

  const handleRemove = useCallback((urlToRemove: string) => {
    const currentImages = Array.isArray(value) ? value : [];
    const newImages = currentImages.filter(url => url !== urlToRemove);
    onChange(newImages);
  }, [value, onChange]);

  // Create array of 4 slots
  const slots = Array.from({ length: 4 }, (_, index) => ({
    index,
    url: imageUrls[index] || null,
    isEmpty: !imageUrls[index]
  }));

  return (
    <div className="mb-4 w-full max-w-full overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-1">
        {slots.map((slot) => (
          <div key={`slot-${slot.index}`} className="relative w-full aspect-square min-w-0">
            {slot.url ? (
              // Show uploaded image
              <div className="relative w-full aspect-square rounded-md overflow-hidden border shadow-sm">
                <div className="z-10 absolute top-1 right-1">
                  <Button 
                    type="button" 
                    onClick={() => handleRemove(slot.url!)} 
                    variant="destructive" 
                    size="icon"
                    className="h-6 w-6 shadow-md hover:scale-105 transition-transform"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Image
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                  alt={`Product Image ${slot.index + 1}`}
                  src={slot.url}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
            ) : (
              // Show upload button
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kidszone_products"}
                options={{
                  multiple: false,
                  maxFiles: 1,
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                  maxFileSize: 5000000, // 5MB
                  sources: ["local", "camera"],
                }}
                onSuccess={(result) => handleUpload(result)}
                onClose={() => {
                  document.body.style.overflow = "auto";
                }}
              >
                {({ open, isLoading }) => (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => open?.()}
                    disabled={isLoading}
                    className="relative w-full aspect-square rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                  >
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500 text-center px-1">
                      {isLoading ? 'Uploading...' : `Image ${slot.index + 1}`}
                    </span>
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;