import { useGetDailyVerse } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function DailyVersePage() {
  const { data: verse, isLoading, error, refetch, isRefetching } = useGetDailyVerse();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load daily verse. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-3">
            Daily Verse
          </h1>
          <p className="text-lg text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <Card className="border-2 shadow-soft">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-primary text-center">
              {verse?.reference}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <blockquote className="verse-text text-center italic border-l-4 border-primary pl-6 py-4">
              "{verse?.text}"
            </blockquote>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
              <p>This verse is selected for today and will change tomorrow</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

