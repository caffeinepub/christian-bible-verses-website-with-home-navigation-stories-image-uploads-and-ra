import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, BookOpen, Sparkles, ScrollText } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const navigationOptions = [
    {
      title: 'Daily Verse',
      description: 'Discover today\'s inspiring verse',
      icon: Sparkles,
      path: '/daily-verse',
      gradient: 'from-accent/20 to-accent/5',
    },
    {
      title: 'Bible Stories',
      description: 'Explore timeless stories of faith',
      icon: ScrollText,
      path: '/stories',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      title: 'Old Testament',
      description: 'Browse verses from ancient scriptures',
      icon: Book,
      path: '/old-testament',
      gradient: 'from-chart-2/20 to-chart-2/5',
    },
    {
      title: 'New Testament',
      description: 'Read the teachings of Christ',
      icon: BookOpen,
      path: '/new-testament',
      gradient: 'from-chart-4/20 to-chart-4/5',
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Sacred Verses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the timeless wisdom of Scripture through daily verses, inspiring stories, and sacred texts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.path}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2"
                onClick={() => navigate({ to: option.path })}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="font-serif text-2xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-primary font-medium">
                    Explore →
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

