import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetVersesByTestament } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Testament } from '../backend';

export default function VerseDetailPage() {
  const { verseId } = useParams({ from: '/verse/$verseId' });
  const navigate = useNavigate();

  const [testament, indexStr] = verseId.split('-');
  const testamentEnum = testament === 'old' ? Testament.old : Testament.new_;
  const verseIndex = parseInt(indexStr, 10);

  const { data: verses, isLoading, error } = useGetVersesByTestament(testamentEnum);
  const verse = verses?.[verseIndex];

  const backPath = testament === 'old' ? '/old-testament' : '/new-testament';
  const testamentTitle = testament === 'old' ? 'Old Testament' : 'New Testament';

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-10 w-32 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !verse) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: backPath })}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {testamentTitle}
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Verse not found. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: backPath })}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {testamentTitle}
        </Button>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-serif text-3xl text-primary text-center mb-2">
              {verse.reference}
            </CardTitle>
            <div className="text-center text-sm text-muted-foreground">
              {testamentTitle}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            
            <blockquote className="verse-text text-center border-l-4 border-primary pl-6 py-4">
              "{verse.text}"
            </blockquote>

            {verse.image && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-semibold">Image</h3>
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={verse.image.getDirectURL()}
                      alt={verse.reference}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

