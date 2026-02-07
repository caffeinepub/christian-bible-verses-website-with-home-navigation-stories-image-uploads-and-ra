import { useState, useEffect } from 'react';
import { ExternalBlob } from '../../backend';
import { AlertCircle } from 'lucide-react';

interface PublicImageProps {
  image: ExternalBlob;
  alt: string;
  className?: string;
}

export default function PublicImage({ image, alt, className = '' }: PublicImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = image.getDirectURL();

  // Reset error state when the image URL changes
  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 border border-border rounded-lg p-8 ${className}`}>
        <div className="text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Image failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
