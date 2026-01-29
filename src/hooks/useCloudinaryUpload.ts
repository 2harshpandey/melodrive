
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploadWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  apiKey: string;
  tags: string[];
  cropping: boolean;
  onSuccess: (result: any) => void;
}

const useCloudinaryUpload = (options: CloudinaryUploadWidgetOptions) => {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: options.cloudName,
          uploadPreset: options.uploadPreset,
          apiKey: options.apiKey,
          tags: options.tags,
          cropping: options.cropping,
          resource_type: 'video',
          client_allowed_formats: ['mp3', 'mp4'],
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            options.onSuccess(result.info);
          }
        }
      );
    }
  }, [options]);

  const open = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return { open };
};

export default useCloudinaryUpload;
