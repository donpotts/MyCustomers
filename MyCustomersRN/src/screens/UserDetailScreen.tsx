import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  ActivityIndicator,
  Surface,
  IconButton,
  useTheme as usePaperTheme,
  Chip,
} from 'react-native-paper';
import { User } from '../types/User';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

interface UserDetailScreenProps {
  navigation: any;
  route: {
    params: {
      userId: string;
    };
  };
}

export const UserDetailScreen: React.FC<UserDetailScreenProps> = ({ navigation, route }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user: currentUser, isAuthenticated } = useAuth();
  const theme = usePaperTheme();
  const { userId } = route.params;

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (isAuthenticated && currentUser) {
          const currentUserData = await userService.getCurrentUser();
          setIsAdmin(currentUserData.isAdmin);
          if (!currentUserData.isAdmin) {
            Alert.alert(
              'Access Denied',
              'You do not have permission to view user details.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
            return;
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigation.goBack();
      }
    };

    if (isAuthenticated) {
      checkAdminStatus();
    } else {
      navigation.replace('Login');
    }
  }, [isAuthenticated, currentUser, navigation]);

  const fetchUser = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const userData = await userService.getUser(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('Error', 'Failed to load user details. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [userId, isAdmin, navigation]);

  useEffect(() => {
    if (isAdmin) {
      fetchUser();
    }
  }, [fetchUser, isAdmin]);

  const handleDeleteUser = useCallback(async () => {
    if (!user || !isAdmin) return;

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete user "${user.email}"?\n\nThis action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(user.id);
              Alert.alert('Success', 'User deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Users', { refresh: true }),
                },
              ]);
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user. Please try again.');
            }
          },
        },
      ],
    );
  }, [user, navigation, isAdmin]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {user && (
            <>
              <IconButton
                icon="pencil"
                size={24}
                onPress={() => navigation.navigate('EditUser', { userId: user.id })}
              />
              <IconButton
                icon="delete"
                size={24}
                onPress={handleDeleteUser}
              />
            </>
          )}
        </View>
      ),
    });
  }, [navigation, user, handleDeleteUser]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Checking permissions...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
          Loading user details...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: theme.colors.onSurfaceVariant }]}>
          User not found
        </Text>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const isCurrentUser = user.id === currentUser?.id;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* User Profile Card */}
        <Surface style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                {user.email.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Title style={[styles.profileName, { color: theme.colors.onSurface }]}>
                {user.email}
              </Title>
              <Chip
                icon={user.isAdmin ? 'shield-account' : 'account'}
                mode="outlined"
                style={styles.roleChip}
              >
                {user.isAdmin ? 'Administrator' : 'User'}
              </Chip>
              {isCurrentUser && (
                <Chip
                  icon="account-check"
                  mode="outlined"
                  style={[styles.currentUserChip, styles.roleChip]}
                >
                  Current User
                </Chip>
              )}
            </View>
          </View>
        </Surface>

        {/* User Details Card */}
        <Card style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              User Information
            </Title>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  User ID:
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user.id}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Email:
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user.email}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Role:
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user.isAdmin ? 'Administrator' : 'Standard User'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Permissions:
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {user.isAdmin ? 'Full Access' : 'Limited Access'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <Card style={[styles.actionsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Actions
            </Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('EditUser', { userId: user.id })}
                style={styles.actionButton}
                icon="pencil"
              >
                Edit User
              </Button>
              {!isCurrentUser && (
                <Button
                  mode="outlined"
                  onPress={handleDeleteUser}
                  style={[styles.actionButton, styles.deleteButton]}
                  buttonColor={theme.colors.errorContainer}
                  textColor={theme.colors.onErrorContainer}
                  icon="delete"
                >
                  Delete User
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  goBackButton: {
    marginTop: 16,
  },
  profileCard: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    marginBottom: 8,
  },
  roleChip: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  currentUserChip: {
    marginTop: 4,
  },
  detailsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: 120,
    marginRight: 12,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: 'transparent',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});