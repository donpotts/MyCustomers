import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Modal, Platform } from 'react-native';
import { useTheme as usePaperTheme, Text } from 'react-native-paper';
import { WebSideNav } from './WebSideNav';
import { MobileHeader } from './MobileHeader';
import { CustomDrawerContent } from './CustomDrawerContent';
import { useSideNav } from '../contexts/SideNavContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMobileDrawer } from '../hooks/useMobileDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isOpen, close } = useSideNav();
  useMobileDrawer(); // Handle mobile-specific drawer behavior
  const [currentRoute, setCurrentRoute] = useState(route.name);
  const theme = usePaperTheme();
  
  const { width, height } = Dimensions.get('window');
  const isWeb = width > 768;
  const isSmallScreen = width <= 480;
  
  // Update current route when navigation changes
  useEffect(() => {
    setCurrentRoute(route.name);
  }, [route.name]);

  // Only show WebSideNav for authenticated screens, not Login/Register
  const shouldShowSideNav = isWeb && !['Login', 'Register'].includes(currentRoute);
  const shouldShowMobileHeader = !isWeb && !['Login', 'Register'].includes(currentRoute);

  // Get screen title based on route
  const getScreenTitle = () => {
    switch (currentRoute) {
      case 'Dashboard': return 'Dashboard';
      case 'CustomerList': return 'Customers';
      case 'Users': return 'Users';
      case 'AddCustomer': return 'Add Customer';
      case 'CustomerDetail': return 'Customer Details';
      default: return 'My Customers';
    }
  };

  const contentStyle = {
    marginLeft: shouldShowSideNav && isOpen ? 280 : 0, // Keep desktop behavior unchanged
    paddingTop: shouldShowSideNav ? 64 : (shouldShowMobileHeader ? 64 : 0),
    flex: 1,
    height: isWeb ? '100vh' : height,
    backgroundColor: theme.colors.background,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {shouldShowSideNav && (
        <WebSideNav navigation={navigation} currentRoute={currentRoute} />
      )}
      {shouldShowMobileHeader && (
        <MobileHeader title={getScreenTitle()} navigation={navigation} />
      )}
      
      {/* Mobile drawer overlay */}
      {shouldShowMobileHeader && isOpen && (
        <View style={styles.drawerOverlay}>
          <View style={[styles.drawer, { backgroundColor: theme.colors.surface, width: isSmallScreen ? width * 0.85 : 280 }]}>
            <CustomDrawerContent navigation={navigation} />
          </View>
          <TouchableWithoutFeedback onPress={close}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
        </View>
      )}
      
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    height: '100%',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});