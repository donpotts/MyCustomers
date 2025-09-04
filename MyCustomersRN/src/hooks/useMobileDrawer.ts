import { useEffect } from 'react';
import { Platform, BackHandler } from 'react-native';
import { useSideNav } from '../contexts/SideNavContext';

export const useMobileDrawer = () => {
  const { isOpen, close } = useSideNav();

  // Handle Android back button when drawer is open
  useEffect(() => {
    if (Platform.OS === 'android' && isOpen) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        close();
        return true; // Prevent default back behavior
      });

      return () => backHandler.remove();
    }
  }, [isOpen, close]);

  // Prevent body scrolling when drawer is open on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const body = document.body;
      if (isOpen) {
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
        body.style.height = '100%';
      } else {
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.height = '';
      }

      return () => {
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.height = '';
      };
    }
  }, [isOpen]);

  return {
    isOpen,
    close,
  };
};