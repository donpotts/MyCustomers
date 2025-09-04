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
import { CreateUserDto } from '../types/User';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

interface CreateUserScreenProps {
  navigation: any;
}

export const CreateUserScreen: React.FC<CreateUserScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  
  const { user: currentUser, isAuthenticated } = useAuth();
  const theme = usePaperTheme();

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
              'You do not have permission to create users.',
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

    if (!password.trim()) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    return true;
  }, [email, password, confirmPassword]);

  const handleCreateUser = useCallback(async () => {
    if (!validateForm() || !currentUserIsAdmin) return;

    try {
      setLoading(true);

      const userData: CreateUserDto = {
        email: email.trim(),
        password: password,
        isAdmin: isAdmin,
      };

      await userService.createUser(userData);

      Alert.alert(
        'Success',
        'User created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Users', { refresh: true }),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating user:', error);
      let errorMessage = 'Failed to create user. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          errorMessage = 'A user with this email address already exists.';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your input and try again.';
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [validateForm, currentUserIsAdmin, email, password, isAdmin, navigation]);

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
              Create New User
            </Title>
            <Text style={[styles.headerDescription, { color: theme.colors.onSurfaceVariant }]}>
              Add a new user to the system with appropriate permissions.
            </Text>
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
                disabled={loading}
                error={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              />

              <TextInput
                label="Password *"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                disabled={loading}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={password.length > 0 && password.length < 6}
              />

              <TextInput
                label="Confirm Password *"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                disabled={loading}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                error={confirmPassword.length > 0 && password !== confirmPassword}
              />

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
                  disabled={loading}
                />
              </View>

              {isAdmin && (
                <View style={styles.adminWarning}>
                  <Chip
                    icon="alert"
                    mode="outlined"
                    style={[styles.warningChip, { borderColor: theme.colors.primary }]}
                  >
                    This user will have full system access
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
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleCreateUser}
                  style={styles.actionButton}
                  loading={loading}
                  disabled={loading || !email.trim() || !password.trim() || !confirmPassword.trim()}
                  icon="account-plus"
                >
                  Create User
                </Button>
              </View>
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
});