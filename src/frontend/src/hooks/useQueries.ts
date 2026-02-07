import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Testament, UserProfile, ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalKey = identity?.getPrincipal().toString() || 'anonymous';

  return useQuery<boolean>({
    queryKey: ['isAdmin', principalKey],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetStories() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVersesByTestament(testament: Testament) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['verses', testament],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVersesByTestament(testament);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDailyVerse() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['dailyVerse'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyVerse();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useAddStoryOrVerseImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blob,
      isStory,
      index,
    }: {
      blob: ExternalBlob;
      isStory: boolean;
      index: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadStoryOrVerseImage(blob, isStory, index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['verses'] });
    },
  });
}
