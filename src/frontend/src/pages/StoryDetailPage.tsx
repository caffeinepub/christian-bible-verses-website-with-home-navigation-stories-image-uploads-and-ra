import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStories } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import ImageUploadSection from '../components/story/ImageUploadSection';

export default function StoryDetailPage() {
  const { storyId } = useParams({ from: '/stories/$storyId' });
  const navigate = useNavigate();
  const { data: stories, isLoading, error } = useGetStories();

  const storyIndex = parseInt(storyId, 10);
  const story = stories?.[storyIndex];

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-32 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-24 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/stories' })}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stories
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Story not found. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/stories' })}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stories
        </Button>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-serif text-3xl mb-4">
              {story.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadSection
              currentImage={story.image}
              storyIndex={storyIndex}
              isStory={true}
              title="Story Image"
            />

            <Separator />

            <div>
              <h3 className="font-serif text-xl font-semibold mb-4">Scripture</h3>
              <div className="space-y-6">
                {story.verses.map((verse, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-sm font-medium text-primary">
                      {verse.reference}
                    </p>
                    <p className="verse-text text-foreground leading-relaxed">
                      {verse.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-serif text-xl font-semibold mb-3">Summary</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {story.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
