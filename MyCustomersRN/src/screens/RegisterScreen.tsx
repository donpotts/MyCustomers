import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
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

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { register, isAuthenticated, isLoading } = useAuth();
  const theme = usePaperTheme();
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Dashboard');
    }
  }, [isAuthenticated, navigation]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        Alert.alert(
          'Registration Successful',
          result.message || 'Registration successful! Please log in.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
      console.error('Registration error:', error);
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
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
      >
        <Card style={[styles.registerCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👥</Text>
            </View>
            
            <Title style={[styles.title, { color: theme.colors.onSurface }]}>Register</Title>

            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              style={styles.input}
              error={!!errors.firstName}
              disabled={isLoading}
              left={<TextInput.Icon icon="account" />}
            />
            {errors.firstName && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.firstName}</Text>}

            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              style={styles.input}
              error={!!errors.lastName}
              disabled={isLoading}
              left={<TextInput.Icon icon="account" />}
            />
            {errors.lastName && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.lastName}</Text>}

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
            />
            {errors.password && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.password}</Text>}

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              style={styles.input}
              secureTextEntry
              error={!!errors.confirmPassword}
              disabled={isLoading}
              left={<TextInput.Icon icon="lock" />}
              onSubmitEditing={handleRegister}
              returnKeyType="done"
            />
            {errors.confirmPassword && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.confirmPassword}</Text>}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              disabled={isLoading}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                'Create Account'
              )}
            </Button>

            <Divider style={styles.divider} />

            <View style={styles.loginSection}>
              <Text style={[styles.loginText, { color: theme.colors.onSurfaceVariant }]}>Already have an account?</Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                disabled={isLoading}
              >
                Login here
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 30,
    paddingBottom: 100,
  },
  registerCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    elevation: 4,
  },
  cardContent: {
    padding: 20,
    paddingVertical: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 10,
  },
  buttonContent: {
    height: 48,
  },
  divider: {
    marginVertical: 12,
  },
  loginSection: {
    alignItems: 'center',
  },
  loginText: {
    marginBottom: 8,
  },
});