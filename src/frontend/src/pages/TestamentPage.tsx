import { useNavigate } from '@tanstack/react-router';
import { useGetVersesByTestament } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Book, AlertCircle } from 'lucide-react';
import { Testament } from '../backend';

interface TestamentPageProps {
  testament: 'old' | 'new';
}

export default function TestamentPage({ testament }: TestamentPageProps) {
  const navigate = useNavigate();
  const testamentEnum = testament === 'old' ? Testament.old : Testament.new_;
  const { data: verses, isLoading, error } = useGetVersesByTestament(testamentEnum);

  const title = testament === 'old' ? 'Old Testament' : 'New Testament';
  const description = testament === 'old' 
    ? 'Ancient scriptures of faith and covenant'
    : 'The teachings and life of Jesus Christ';

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-16 w-full" />
                </CardHeader>
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
              Failed to load verses. Please try again later.
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
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {verses && verses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verses.map((verse, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2"
                onClick={() => navigate({ 
                  to: '/verse/$verseId', 
                  params: { verseId: `${testament}-${index}` } 
                })}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Book className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-serif text-lg mb-2">
                        {verse.reference}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-3">
                        {verse.text}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No verses available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

