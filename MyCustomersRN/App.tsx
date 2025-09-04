import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { SideNavProvider } from './src/contexts/SideNavContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { CustomerListScreen } from './src/screens/CustomerListScreen';
import { UsersScreen } from './src/screens/UsersScreen';
import { UserDetailScreen } from './src/screens/UserDetailScreen';
import { CreateUserScreen } from './src/screens/CreateUserScreen';
import { EditUserScreen } from './src/screens/EditUserScreen';
import { AddCustomerScreen } from './src/screens/AddCustomerScreen';
import { CustomerDetailScreen } from './src/screens/CustomerDetailScreen';
import { AppLayout } from './src/components/AppLayout';
import { Platform } from 'react-native';
import { setupWebEnvironment } from './src/utils/webSetup';

const Stack = createStackNavigator();

// Wrapper components that use AppLayout
const WrappedDashboard = ({ navigation, route }: any) => (
  <AppLayout>
    <DashboardScreen navigation={navigation} route={route} />
  </AppLayout>
);

const WrappedCustomerList = ({ navigation, route }: any) => (
  <AppLayout>
    <CustomerListScreen navigation={navigation} route={route} />
  </AppLayout>
);

const WrappedUsers = ({ navigation, route }: any) => (
  <AppLayout>
    <UsersScreen navigation={navigation} route={route} />
  </AppLayout>
);

const WrappedUserDetail = ({ navigation, route }: any) => (
  <AppLayout>
    <UserDetailScreen navigation={navigation} route={route} />
  </AppLayout>
);

const WrappedCreateUser = ({ navigation, route }: any) => (
  <AppLayout>
    <CreateUserScreen navigation={navigation} route={route} />
  </AppLayout>
);

const WrappedEditUser = ({ navigation, route }: any) => (
  <AppLayout>
    <EditUserScreen navigation={navigation} route={route} />
  </AppLayout>
);

const WrappedAddCustomer = ({ navigation, route }: any) => (
  <AppLayout>
    <AddCustomerScreen navigation={navigation} route={route} />
  </AppLayout>
);

const WrappedCustomerDetail = ({ navigation, route }: any) => (
  <AppLayout>
    <CustomerDetailScreen navigation={navigation} route={route} />
  </AppLayout>
);


// Root Stack with all screens
const RootStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        cardStyle: { backgroundColor: theme.colors.background },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        name="Dashboard"
        component={WrappedDashboard}
      />
      <Stack.Screen
        name="CustomerList"
        component={WrappedCustomerList}
      />
      <Stack.Screen
        name="Users"
        component={WrappedUsers}
      />
      <Stack.Screen
        name="UserDetail"
        component={WrappedUserDetail}
        options={{ 
          title: 'User Details',
          presentation: 'modal',
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <Stack.Screen
        name="CreateUser"
        component={WrappedCreateUser}
        options={{ 
          title: 'Create User',
          presentation: 'modal',
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <Stack.Screen
        name="EditUser"
        component={WrappedEditUser}
        options={{ 
          title: 'Edit User',
          presentation: 'modal',
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <Stack.Screen
        name="AddCustomer"
        component={WrappedAddCustomer}
        options={{ 
          title: 'Add Customer',
          presentation: 'modal',
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={WrappedCustomerDetail}
        options={{ 
          title: 'Customer Details',
          presentation: 'modal',
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </Stack.Navigator>
  );
};

// App with theme support
const AppContent = () => {
  const { theme, isDarkMode } = useTheme();

  // Initialize web environment
  useEffect(() => {
    if (Platform.OS === 'web') {
      setupWebEnvironment();
    }
  }, []);

  // Create navigation theme that matches Material Design theme
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      primary: theme.colors.primary,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <RootStack />
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SideNavProvider>
          <AppContent />
        </SideNavProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
