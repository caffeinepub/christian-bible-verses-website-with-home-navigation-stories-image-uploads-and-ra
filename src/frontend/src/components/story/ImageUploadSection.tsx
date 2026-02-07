import { useState } from 'react';
import { useAddStoryOrVerseImage, useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import PublicImage from './PublicImage';

interface ImageUploadSectionProps {
  currentImage?: ExternalBlob;
  storyIndex: number;
  isStory: boolean;
  title: string;
}

export default function ImageUploadSection({
  currentImage,
  storyIndex,
  isStory,
  title,
}: ImageUploadSectionProps) {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const addImage = useAddStoryOrVerseImage();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSelectedFile(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setError('');
    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addImage.mutateAsync({
        blob,
        isStory,
        index: BigInt(storyIndex),
      });

      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-semibold">{title}</h3>

      {currentImage ? (
        <div className="space-y-3">
          <div className="rounded-lg overflow-hidden border border-border">
            <PublicImage
              image={currentImage}
              alt={title}
              className="w-full h-auto"
            />
          </div>
          {isAdmin && !isAdminLoading && (
            <p className="text-sm text-muted-foreground">
              Upload a new image to replace the current one
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No image available
          </p>
        </div>
      )}

      {isAdmin && !isAdminLoading && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Select Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={addImage.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF (max 5MB)
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || addImage.isPending}
            className="w-full"
          >
            {addImage.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
