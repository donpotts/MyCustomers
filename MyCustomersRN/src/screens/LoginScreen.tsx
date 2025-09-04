import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
  Text,
  Card,
  Divider,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { login, isAuthenticated, isLoading } = useAuth();
  const theme = usePaperTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Dashboard');
    }
  }, [isAuthenticated, navigation]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email.trim(), formData.password);
      
      if (result.success) {
        Alert.alert('Success', 'Login successful! Welcome back.');
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login. Please try again.');
      console.error('Login error:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
      bounces={true}
      alwaysBounceVertical={true}
      scrollEnabled={true}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <Card style={[styles.loginCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👤</Text>
            </View>
            
            <Title style={[styles.title, { color: theme.colors.onSurface }]}>Login</Title>

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              disabled={isLoading}
              left={<TextInput.Icon icon="email" />}
            />
            {errors.email && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.email}</Text>}

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              style={styles.input}
              secureTextEntry
              error={!!errors.password}
              disabled={isLoading}
              left={<TextInput.Icon icon="lock" />}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />
            {errors.password && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.password}</Text>}

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={isLoading}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider style={styles.divider} />

            <View style={styles.registerSection}>
              <Text style={[styles.registerText, { color: theme.colors.onSurfaceVariant }]}>Don't have an account?</Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
                disabled={isLoading}
              >
                Register here
              </Button>
            </View>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    minHeight: '100%',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 20,
    paddingBottom: 60,
    minHeight: '100%',
  },
  loginCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    elevation: 4,
  },
  cardContent: {
    padding: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 28,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
  divider: {
    marginVertical: 24,
  },
  registerSection: {
    alignItems: 'center',
  },
  registerText: {
    marginBottom: 8,
  },
});