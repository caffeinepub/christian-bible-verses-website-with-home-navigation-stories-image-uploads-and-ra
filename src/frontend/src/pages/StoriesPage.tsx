import { useNavigate } from '@tanstack/react-router';
import { useGetStories } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, AlertCircle } from 'lucide-react';

export default function StoriesPage() {
  const navigate = useNavigate();
  const { data: stories, isLoading, error } = useGetStories();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load stories. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-3">
            Bible Stories
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore timeless stories of faith, courage, and divine wisdom
          </p>
        </div>

        {stories && stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground text-center">
              No stories are available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories?.map((story, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2"
                onClick={() => navigate({ to: '/stories/$storyId', params: { storyId: String(index) } })}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-serif text-xl mb-2">
                        {story.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {story.summary}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {story.verses.length} {story.verses.length === 1 ? 'verse' : 'verses'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
