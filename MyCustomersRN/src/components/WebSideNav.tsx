import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import {
  Text,
  Surface,
  TouchableRipple,
  Divider,
  Button,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSideNav } from '../contexts/SideNavContext';
import { userService } from '../services/userService';

interface WebSideNavProps {
  navigation: any;
  currentRoute: string;
}

const WebSideNavComponent: React.FC<WebSideNavProps> = ({ navigation, currentRoute }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isOpen, toggleSideNav } = useSideNav();
  const paperTheme = usePaperTheme();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (isAuthenticated && user) {
          const currentUser = await userService.getCurrentUser();
          setIsAdmin(currentUser.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);
  
  // Helper function to determine if a route should be highlighted (memoized)
  const isRouteActive = useCallback((route: string) => {
    if (route === 'CustomerList') {
      // Highlight CustomerList for customer-related screens
      return currentRoute === 'CustomerList' || currentRoute === 'AddCustomer' || currentRoute === 'CustomerDetail';
    }
    return currentRoute === route;
  }, [currentRoute]);

  const handleNavigation = useCallback((screen: string) => {
    navigation.navigate(screen);
    // Don't close sidenav when navigating
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigation.replace('Login');
  }, [logout, navigation]);

  const { width } = Dimensions.get('window');
  const isWeb = width > 768; // Consider as web if width > 768px
  
  // Memoize styles that depend on theme and state
  const sideNavStyle = useMemo(() => [
    styles.sideNav,
    {
      backgroundColor: paperTheme.colors.surface,
      transform: [{ translateX: isOpen ? 0 : -280 }],
      top: 64, // Below app bar
      height: 'calc(100vh - 64px)',
    }
  ], [paperTheme.colors.surface, isOpen]);

  const appBarStyle = useMemo(() => [
    styles.appBar, 
    { backgroundColor: paperTheme.colors.primary }
  ], [paperTheme.colors.primary]);

  return (
    <>
      {/* Top App Bar */}
      <Surface style={appBarStyle}>
        <View style={styles.appBarContent}>
          <Pressable 
            style={styles.hamburgerInAppBar}
            onPress={toggleSideNav}
          >
            <View style={[styles.hamburgerLine, { backgroundColor: paperTheme.colors.onPrimary }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: paperTheme.colors.onPrimary }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: paperTheme.colors.onPrimary }]} />
          </Pressable>
          
          <Text style={[styles.appBarTitle, { color: paperTheme.colors.onPrimary }]}>
            My Customers
          </Text>
          
          <TouchableRipple 
            onPress={toggleTheme}
            style={styles.themeToggleInAppBar}
            rippleColor="rgba(255, 255, 255, 0.3)"
            borderless
          >
            <Text style={[styles.themeToggleText, { color: paperTheme.colors.onPrimary }]}>
              {isDarkMode ? '🌙' : '☀️'}
            </Text>
          </TouchableRipple>
        </View>
      </Surface>

      {/* Side Navigation - Slides in/out completely */}
      <Surface style={sideNavStyle}>

        {/* Navigation Items */}
        <View style={styles.navItems}>
          <TouchableRipple
            onPress={() => handleNavigation('Dashboard')}
            style={[
              styles.navItem,
              isRouteActive('Dashboard') && { backgroundColor: paperTheme.colors.primaryContainer }
            ]}
            rippleColor={paperTheme.colors.primary}
          >
            <View style={styles.navItemContent}>
              <Text style={[styles.navIcon, { color: isRouteActive('Dashboard') ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant }]}>
                📊
              </Text>
              <Text style={[styles.navLabel, { 
                color: isRouteActive('Dashboard') ? paperTheme.colors.primary : paperTheme.colors.onSurface 
              }]}>
                Dashboard
              </Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => handleNavigation('CustomerList')}
            style={[
              styles.navItem,
              isRouteActive('CustomerList') && { backgroundColor: paperTheme.colors.primaryContainer }
            ]}
            rippleColor={paperTheme.colors.primary}
          >
            <View style={styles.navItemContent}>
              <Text style={[styles.navIcon, { color: isRouteActive('CustomerList') ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant }]}>
                👥
              </Text>
              <Text style={[styles.navLabel, { 
                color: isRouteActive('CustomerList') ? paperTheme.colors.primary : paperTheme.colors.onSurface 
              }]}>
                Customers
              </Text>
            </View>
          </TouchableRipple>

          {isAdmin && (
            <TouchableRipple
              onPress={() => handleNavigation('Users')}
              style={[
                styles.navItem,
                isRouteActive('Users') && { backgroundColor: paperTheme.colors.primaryContainer }
              ]}
              rippleColor={paperTheme.colors.primary}
            >
              <View style={styles.navItemContent}>
                <Text style={[styles.navIcon, { color: isRouteActive('Users') ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant }]}>
                  👤
                </Text>
                <Text style={[styles.navLabel, { 
                  color: isRouteActive('Users') ? paperTheme.colors.primary : paperTheme.colors.onSurface 
                }]}>
                  Users
                </Text>
              </View>
            </TouchableRipple>
          )}
        </View>

        {/* Footer with user info */}
        <View style={[styles.footer, { backgroundColor: paperTheme.colors.surfaceVariant }]}>
          <Divider style={{ marginBottom: 16 }} />
          
          <View style={styles.userSection}>
            <View style={[styles.userAvatar, { backgroundColor: paperTheme.colors.primary }]}>
              <Text style={[styles.userAvatarText, { color: paperTheme.colors.onPrimary }]}>
                {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={[styles.userEmail, { color: paperTheme.colors.onSurface }]} numberOfLines={1}>
                {user?.email}
              </Text>
              <Text style={[styles.userFullName, { color: paperTheme.colors.onSurfaceVariant }]} numberOfLines={1}>
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User'}
              </Text>
            </View>
          </View>

          <Button 
            mode="text"
            onPress={handleLogout}
            textColor={paperTheme.colors.error}
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            icon={() => <Text style={{ color: paperTheme.colors.error }}>🚪</Text>}
          >
            LOGOUT
          </Button>
        </View>
      </Surface>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    zIndex: 1001,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  appBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  hamburgerInAppBar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  themeToggleInAppBar: {
    borderRadius: 20,
    padding: 8,
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    marginVertical: 2,
    borderRadius: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sideNav: {
    position: 'absolute',
    left: 0,
    width: 280,
    top: 64,
    height: 'calc(100vh - 64px)',
    zIndex: 999,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggle: {
    borderRadius: 24,
    padding: 8,
    elevation: 2,
  },
  themeToggleText: {
    fontSize: 20,
  },
  navItems: {
    flex: 1,
    paddingTop: 8,
  },
  navItem: {
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  navIcon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
    marginRight: 16,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  userFullName: {
    fontSize: 12,
  },
  logoutButton: {
    alignSelf: 'center',
  },
  logoutButtonContent: {
    justifyContent: 'center',
  },
});

// Memoize the component to prevent unnecessary re-renders
export const WebSideNav = React.memo(WebSideNavComponent, (prevProps, nextProps) => {
  return prevProps.currentRoute === nextProps.currentRoute;
});