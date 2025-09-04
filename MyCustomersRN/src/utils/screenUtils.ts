import { Dimensions, Platform } from 'react-native';

export interface ScreenBreakpoints {
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isWeb: boolean;
  isMobile: boolean;
  sideNavWidth: number;
}

export const getScreenBreakpoints = (width?: number): ScreenBreakpoints => {
  const screenWidth = width || Dimensions.get('window').width;
  
  const isSmallScreen = screenWidth <= 480;
  const isMediumScreen = screenWidth > 480 && screenWidth <= 768;
  const isLargeScreen = screenWidth > 768;
  const isWeb = isLargeScreen;
  const isMobile = !isWeb;
  
  // Responsive sidebar width
  let sideNavWidth = 280;
  if (isSmallScreen) {
    sideNavWidth = Math.min(screenWidth * 0.85, 280);
  } else if (isMediumScreen) {
    sideNavWidth = 240;
  }
  
  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isWeb,
    isMobile,
    sideNavWidth,
  };
};

export const useResponsiveLayout = () => {
  const { width, height } = Dimensions.get('window');
  return {
    screenWidth: width,
    screenHeight: height,
    ...getScreenBreakpoints(width),
  };
};

// Platform-specific viewport height handling
export const getViewportHeight = (): string | number => {
  if (Platform.OS === 'web') {
    // Use CSS custom property for dynamic viewport height on mobile
    return '100vh';
  }
  return Dimensions.get('window').height;
};