import { useEffect, useCallback } from 'react';
import { useAssetStore } from '../store/useAssetStore';
import type { ViewType } from '../types';

const VIEW_ORDER: ViewType[] = ['overview', 'floorMap', 'schedule', 'faultRanking', 'costTrend'];

export const useCarousel = () => {
  const { carousel, currentView, setCurrentView, setCarouselPaused } = useAssetStore();
  const { enabled, paused, interval } = carousel;

  const goToNext = useCallback(() => {
    const currentIndex = VIEW_ORDER.indexOf(currentView);
    const nextIndex = (currentIndex + 1) % VIEW_ORDER.length;
    setCurrentView(VIEW_ORDER[nextIndex]);
  }, [currentView, setCurrentView]);

  const goToPrev = useCallback(() => {
    const currentIndex = VIEW_ORDER.indexOf(currentView);
    const prevIndex = (currentIndex - 1 + VIEW_ORDER.length) % VIEW_ORDER.length;
    setCurrentView(VIEW_ORDER[prevIndex]);
  }, [currentView, setCurrentView]);

  useEffect(() => {
    if (!enabled || paused) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, paused, interval, goToNext]);

  const togglePause = useCallback(() => {
    setCarouselPaused(!paused);
  }, [paused, setCarouselPaused]);

  return {
    enabled,
    paused,
    interval,
    currentView,
    viewOrder: VIEW_ORDER,
    goToNext,
    goToPrev,
    togglePause
  };
};
