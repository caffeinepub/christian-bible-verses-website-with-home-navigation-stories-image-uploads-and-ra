import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Book, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileSetupDialog />
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Book className="h-6 w-6" />
              <span>Sacred Verses</span>
            </button>
            
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/daily-verse">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Daily Verse
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/stories">Stories</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/old-testament">Old Testament</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/new-testament">New Testament</Link>
              </Button>
            </nav>
          </div>
          
          <LoginButton />
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-muted/30 py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026. Built with love using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="font-serif italic">Faith • Hope • Love</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

