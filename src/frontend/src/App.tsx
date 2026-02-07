import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import DailyVersePage from './pages/DailyVersePage';
import TestamentPage from './pages/TestamentPage';
import VerseDetailPage from './pages/VerseDetailPage';

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const storiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stories',
  component: StoriesPage,
});

const storyDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stories/$storyId',
  component: StoryDetailPage,
});

const dailyVerseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-verse',
  component: DailyVersePage,
});

const oldTestamentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/old-testament',
  component: () => <TestamentPage testament="old" />,
});

const newTestamentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-testament',
  component: () => <TestamentPage testament="new" />,
});

const verseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verse/$verseId',
  component: VerseDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storiesRoute,
  storyDetailRoute,
  dailyVerseRoute,
  oldTestamentRoute,
  newTestamentRoute,
  verseDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

