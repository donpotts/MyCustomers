import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  TextInput,
  ActivityIndicator,
  Switch,
  Surface,
  useTheme as usePaperTheme,
  Chip,
} from 'react-native-paper';
import { User, UpdateUserDto } from '../types/User';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

interface EditUserScreenProps {
  navigation: any;
  route: {
    params: {
      userId: string;
    };
  };
}

export const EditUserScreen: React.FC<EditUserScreenProps> = ({ navigation, route }) => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  
  const { user: currentUser, isAuthenticated } = useAuth();
  const theme = usePaperTheme();
  const { userId } = route.params;

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (isAuthenticated && currentUser) {
          const currentUserData = await userService.getCurrentUser();
          setCurrentUserIsAdmin(currentUserData.isAdmin);
          if (!currentUserData.isAdmin) {
            Alert.alert(
              'Access Denied',
              'You do not have permission to edit users.',
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
    if (!currentUserIsAdmin) return;
    
    try {
      setLoading(true);
      const userData = await userService.getUser(userId);
      setUser(userData);
      setEmail(userData.email);
      setIsAdmin(userData.isAdmin);
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('Error', 'Failed to load user details. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [userId, currentUserIsAdmin, navigation]);

  useEffect(() => {
    if (currentUserIsAdmin) {
      fetchUser();
    }
  }, [fetchUser, currentUserIsAdmin]);

  const validateForm = useCallback(() => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    if (password.trim() && password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password.trim() && password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    return true;
  }, [email, password, confirmPassword]);

  const handleUpdateUser = useCallback(async () => {
    if (!validateForm() || !currentUserIsAdmin || !user) return;

    try {
      setSaving(true);

      const updateData: UpdateUserDto = {
        newEmail: email.trim() !== user.email ? email.trim() : undefined,
        newPassword: password.trim() || undefined,
        isAdmin: isAdmin !== user.isAdmin ? isAdmin : undefined,
      };

      // Check if there are any changes
      if (!updateData.newEmail && !updateData.newPassword && updateData.isAdmin === undefined) {
        Alert.alert('No Changes', 'No changes were made to the user.');
        return;
      }

      await userService.updateUser(userId, updateData);

      Alert.alert(
        'Success',
        'User updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('UserDetail', { userId: userId }),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating user:', error);
      let errorMessage = 'Failed to update user. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          errorMessage = 'A user with this email address already exists.';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your input and try again.';
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  }, [validateForm, currentUserIsAdmin, user, email, password, isAdmin, userId, navigation]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!currentUserIsAdmin) {
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
  const hasEmailChanged = email.trim() !== user.email;
  const hasPasswordChanged = password.trim().length > 0;
  const hasRoleChanged = isAdmin !== user.isAdmin;
  const hasChanges = hasEmailChanged || hasPasswordChanged || hasRoleChanged;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
            <Title style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
              Edit User
            </Title>
            <Text style={[styles.headerDescription, { color: theme.colors.onSurfaceVariant }]}>
              Update user information and permissions for {user.email}
            </Text>
            {isCurrentUser && (
              <Chip
                icon="account-check"
                mode="outlined"
                style={styles.currentUserChip}
              >
                Current User
              </Chip>
            )}
          </Surface>

          <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                User Information
              </Title>

              <TextInput
                label="Email Address *"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                disabled={saving}
                error={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              />

              <TextInput
                label="New Password (leave blank to keep current)"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                disabled={saving}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={password.length > 0 && password.length < 6}
              />

              {password.trim().length > 0 && (
                <TextInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                  disabled={saving}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                  error={confirmPassword.length > 0 && password !== confirmPassword}
                />
              )}

              <View style={styles.switchContainer}>
                <View style={styles.switchLabelContainer}>
                  <Text style={[styles.switchLabel, { color: theme.colors.onSurface }]}>
                    Administrator Role
                  </Text>
                  <Text style={[styles.switchDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Grant admin privileges to this user
                  </Text>
                </View>
                <Switch
                  value={isAdmin}
                  onValueChange={setIsAdmin}
                  disabled={saving}
                />
              </View>

              {isAdmin && !user.isAdmin && (
                <View style={styles.adminWarning}>
                  <Chip
                    icon="alert"
                    mode="outlined"
                    style={[styles.warningChip, { borderColor: theme.colors.primary }]}
                  >
                    This user will gain full system access
                  </Chip>
                </View>
              )}

              {!isAdmin && user.isAdmin && (
                <View style={styles.adminWarning}>
                  <Chip
                    icon="alert"
                    mode="outlined"
                    style={[styles.warningChip, { borderColor: theme.colors.error }]}
                  >
                    This user will lose admin privileges
                  </Chip>
                </View>
              )}
            </Card.Content>
          </Card>

          <Card style={[styles.actionsCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  style={styles.actionButton}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleUpdateUser}
                  style={styles.actionButton}
                  loading={saving}
                  disabled={saving || !email.trim() || !hasChanges}
                  icon="content-save"
                >
                  Save Changes
                </Button>
              </View>
              {!hasChanges && (
                <Text style={[styles.noChangesText, { color: theme.colors.onSurfaceVariant }]}>
                  No changes to save
                </Text>
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
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
  headerCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  currentUserChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  formCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionsCard: {
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 8,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  adminWarning: {
    marginTop: 8,
    alignItems: 'center',
  },
  warningChip: {
    backgroundColor: 'transparent',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  noChangesText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
});