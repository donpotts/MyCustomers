import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  Surface,
  TouchableRipple,
  Switch,
  Divider,
  Button,
  Portal,
  Dialog,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSideNav } from '../contexts/SideNavContext';
import { userService } from '../services/userService';

interface CustomDrawerContentProps {
  navigation: any;
}

export const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({ navigation }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toggle, close } = useSideNav();
  const paperTheme = usePaperTheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

  const navigateAndClose = (routeName: string) => {
    close(); // Close the drawer
    navigation.navigate(routeName);
  };

  const handleLogout = async () => {
    close();
    setTimeout(async () => {
      await logout();
      navigation.replace('Login');
    }, 250); // Wait for drawer to close
  };

  const getActiveRoute = () => {
    try {
      const state = navigation.getState();
      if (state && state.routes && state.routes[state.index]) {
        return state.routes[state.index].name;
      }
    } catch (error) {
      console.warn('Could not get active route:', error);
    }
    return 'Dashboard'; // Default fallback
  };

  const activeRoute = getActiveRoute();

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.surface }]}>
      {/* Header */}
      <Surface style={[styles.header, { backgroundColor: paperTheme.colors.primary }]}>
        <TouchableRipple 
          onPress={toggle}
          style={styles.closeButton}
          rippleColor="rgba(255, 255, 255, 0.1)"
        >
          <View style={styles.closeButtonContent}>
            <Text style={[styles.closeButtonText, { color: paperTheme.colors.onPrimary }]}>
              ✕
            </Text>
          </View>
        </TouchableRipple>
        <Text style={[styles.headerTitle, { color: paperTheme.colors.onPrimary }]}>
          My Customers
        </Text>
        <TouchableRipple 
          onPress={toggleTheme}
          style={styles.themeToggle}
          rippleColor="rgba(255, 255, 255, 0.1)"
        >
          <View style={styles.themeToggleContent}>
            <Text style={[styles.themeToggleText, { color: paperTheme.colors.onPrimary }]}>
              {isDarkMode ? '🌙' : '☀️'}
            </Text>
          </View>
        </TouchableRipple>
      </Surface>

      <ScrollView style={styles.drawerContent}>
        <View style={styles.navigationItems}>
          <TouchableRipple
            onPress={() => navigateAndClose('Dashboard')}
            rippleColor={paperTheme.colors.primary}
            style={[styles.drawerItem, { backgroundColor: activeRoute === 'Dashboard' ? paperTheme.colors.primaryContainer : 'transparent' }]}
          >
            <View style={styles.drawerItemContent}>
              <Text style={[styles.icon, { color: activeRoute === 'Dashboard' ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant }]}>
                📊
              </Text>
              <Text style={[styles.drawerLabel, { color: activeRoute === 'Dashboard' ? paperTheme.colors.primary : paperTheme.colors.onSurface }]}>
                Dashboard
              </Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => navigateAndClose('CustomerList')}
            rippleColor={paperTheme.colors.primary}
            style={[styles.drawerItem, { backgroundColor: activeRoute === 'CustomerList' ? paperTheme.colors.primaryContainer : 'transparent' }]}
          >
            <View style={styles.drawerItemContent}>
              <Text style={[styles.icon, { color: activeRoute === 'CustomerList' ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant }]}>
                👥
              </Text>
              <Text style={[styles.drawerLabel, { color: activeRoute === 'CustomerList' ? paperTheme.colors.primary : paperTheme.colors.onSurface }]}>
                Customers
              </Text>
            </View>
          </TouchableRipple>

          {isAdmin && (
            <TouchableRipple
              onPress={() => navigateAndClose('Users')}
              rippleColor={paperTheme.colors.primary}
              style={[styles.drawerItem, { backgroundColor: activeRoute === 'Users' ? paperTheme.colors.primaryContainer : 'transparent' }]}
            >
              <View style={styles.drawerItemContent}>
                <Text style={[styles.icon, { color: activeRoute === 'Users' ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant }]}>
                  👤
                </Text>
                <Text style={[styles.drawerLabel, { color: activeRoute === 'Users' ? paperTheme.colors.primary : paperTheme.colors.onSurface }]}>
                  Users
                </Text>
              </View>
            </TouchableRipple>
          )}
        </View>
      </ScrollView>

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
          style={[styles.logoutButton, { backgroundColor: 'transparent' }]}
          contentStyle={styles.logoutContent}
          icon={() => <Text style={{ color: paperTheme.colors.error }}>🚪</Text>}
        >
          LOGOUT
        </Button>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44, // Account for status bar on mobile
    elevation: 4,
    minHeight: 64,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggle: {
    borderRadius: 20,
    padding: 8,
  },
  themeToggleContent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeToggleText: {
    fontSize: 18,
  },
  closeButton: {
    borderRadius: 20,
    padding: 8,
  },
  closeButtonContent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
  },
  navigationItems: {
    paddingTop: 8,
  },
  drawerItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
    marginRight: 16,
  },
  footer: {
    padding: 12,
    paddingBottom: 16,
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
    borderRadius: 8,
    padding: 12,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});