import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
  Text,
  Card,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { Customer } from '../types/Customer';
import { customerService } from '../services/customerService';
import { useAuth } from '../contexts/AuthContext';

interface CustomerDetailScreenProps {
  navigation: any;
  route: {
    params: {
      customerId: string;
    };
  };
}

export const CustomerDetailScreen: React.FC<CustomerDetailScreenProps> = ({ navigation, route }) => {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firstName: '',
    lastName: '',
    number: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { isAuthenticated } = useAuth();
  const theme = usePaperTheme();

  const loadCustomer = async () => {
    try {
      const fetchedCustomer = await customerService.getCustomer(customerId);
      setCustomer(fetchedCustomer);
      setFormData({
        name: fetchedCustomer.name,
        email: fetchedCustomer.email,
        firstName: fetchedCustomer.firstName || '',
        lastName: fetchedCustomer.lastName || '',
        number: fetchedCustomer.number || '',
        notes: fetchedCustomer.notes || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load customer details');
      console.error('Error loading customer:', error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
      return;
    }
    loadCustomer();
  }, [customerId, isAuthenticated, navigation]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !customer) {
      return;
    }

    setSaving(true);
    try {
      await customerService.updateCustomer(customerId, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        number: formData.number.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        updatedDate: new Date().toISOString(),
      });

      // Navigate back immediately and trigger refresh
      navigation.navigate('CustomerList', { refresh: true });
    } catch (error) {
      Alert.alert('Error', 'Failed to update customer');
      console.error('Error updating customer:', error);
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading customer details...</Text>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.centered}>
        <Text>Customer not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.webContainer}>
        <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <Title style={[styles.title, { color: theme.colors.onSurface }]}>Edit Customer</Title>

            <TextInput
              label="Full Name *"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              style={styles.input}
              error={!!errors.name}
              disabled={saving}
              mode="outlined"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <View style={styles.rowContainer}>
              <TextInput
                label="First Name (Optional)"
                value={formData.firstName}
                onChangeText={(value) => updateFormData('firstName', value)}
                style={[styles.input, styles.halfInput]}
                disabled={saving}
                mode="outlined"
              />
              <TextInput
                label="Last Name (Optional)"
                value={formData.lastName}
                onChangeText={(value) => updateFormData('lastName', value)}
                style={[styles.input, styles.halfInput]}
                disabled={saving}
                mode="outlined"
              />
            </View>

            <TextInput
              label="Email Address *"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              disabled={saving}
              mode="outlined"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              label="Phone Number *"
              value={formData.number}
              onChangeText={(value) => updateFormData('number', value)}
              style={styles.input}
              keyboardType="phone-pad"
              disabled={saving}
              mode="outlined"
            />

            <TextInput
              label="Notes"
              value={formData.notes}
              onChangeText={(value) => updateFormData('notes', value)}
              style={styles.input}
              multiline
              numberOfLines={4}
              disabled={saving}
              mode="outlined"
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="text"
                onPress={() => navigation.navigate('CustomerList')}
                style={styles.cancelButton}
                disabled={saving}
                textColor={theme.colors.error}
              >
                CANCEL
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                disabled={saving}
              >
                {saving ? <ActivityIndicator size="small" color="white" /> : 'UPDATE CUSTOMER'}
              </Button>
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
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  formCard: {
    width: '100%',
    elevation: 8,
    borderRadius: 12,
  },
  cardContent: {
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 16,
  },
  saveButton: {
    paddingHorizontal: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});