import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Surface,
  Button,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { customerService } from '../services/customerService';
import { Customer } from '../types/Customer';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const { user, isAuthenticated } = useAuth();
  const theme = usePaperTheme();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, navigation]);

  // Use focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadDashboardData = async () => {
    try {
      const fetchedCustomers = await customerService.getCustomers(0, 1000);
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate this month's new customers
  const thisMonth = new Date();
  const firstDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  
  const stats = {
    totalCustomers: customers.length,
    newThisMonth: customers.filter(c => new Date(c.createdDate) >= firstDayOfMonth).length,
    activeCustomers: customers.length, // For now, all customers are considered active
    growthRate: customers.length > 0 ? Math.round((customers.filter(c => new Date(c.createdDate) >= firstDayOfMonth).length / customers.length) * 100) : 0,
    recentCustomers: customers
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 5),
  };

  // Dimension calculations
  const { width } = windowDimensions;
  const isWeb = width > 768;
  // Use a fixed card width so dashboard stat cards match customer card sizing
  const cardWidth = 350;

  return (
    <ScrollView style={[styles.container, styles.scrollView, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
        <Title style={[styles.pageTitle, { color: theme.colors.onSurface }]}>
          Dashboard
        </Title>

        <View style={styles.statsContainer}>
          {/* Total Customers Card */}
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface, flexBasis: cardWidth, maxWidth: cardWidth, alignSelf: 'flex-start' }]}>
            <Card.Content style={styles.statContent}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextSection}>
                  <Text style={[styles.statLabel, { color: theme.colors.primary }]}>
                    Total Customers
                  </Text>
                  <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                    {stats.totalCustomers}
                  </Text>
                </View>
                <Text style={[styles.cardIcon, { color: theme.colors.primary }]}>👥</Text>
              </View>
            </Card.Content>
          </Card>

          {/* New This Month Card */}
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface, flexBasis: cardWidth, maxWidth: cardWidth, alignSelf: 'flex-start' }]}>
            <Card.Content style={styles.statContent}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextSection}>
                  <Text style={[styles.statLabel, { color: '#FF69B4' }]}>
                    New This Month
                  </Text>
                  <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                    {stats.newThisMonth}
                  </Text>
                </View>
                <Text style={[styles.cardIcon, { color: '#FF69B4' }]}>📈</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Active Customers Card */}
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface, flexBasis: cardWidth, maxWidth: cardWidth, alignSelf: 'flex-start' }]}>
            <Card.Content style={styles.statContent}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextSection}>
                  <Text style={[styles.statLabel, { color: '#4CAF50' }]}>
                    Active Customers
                  </Text>
                  <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                    {stats.activeCustomers}
                  </Text>
                </View>
                <Text style={[styles.cardIcon, { color: '#4CAF50' }]}>✅</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Growth Rate Card */}
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface, flexBasis: cardWidth, maxWidth: cardWidth, alignSelf: 'flex-start' }]}>
            <Card.Content style={styles.statContent}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextSection}>
                  <Text style={[styles.statLabel, { color: '#2196F3' }]}>
                    Growth Rate
                  </Text>
                  <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                    +{stats.growthRate}%
                  </Text>
                </View>
                <Text style={[styles.cardIcon, { color: '#2196F3' }]}>📊</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Recent Customers Section */}
        {stats.recentCustomers.length > 0 && (
          <Surface style={[styles.recentSection, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Recent Customers
              </Title>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('CustomerList')}
                textColor={theme.colors.primary}
                style={styles.viewAllButton}
              >
                VIEW ALL
              </Button>
            </View>
            
            {stats.recentCustomers.map((customer, index) => {
              const displayName = customer.firstName && customer.lastName 
                ? `${customer.firstName} ${customer.lastName}` 
                : customer.name;
              
              return (
                <View key={customer.id}>
                  <View style={styles.recentCustomerItem}>
                    <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                      <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                        {displayName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    
                    <View style={styles.customerDetails}>
                      <Text style={[styles.customerName, { color: theme.colors.onSurface }]}>
                        {displayName}
                      </Text>
                      <Text style={[styles.customerEmail, { color: theme.colors.primary }]}>
                        {customer.email}
                      </Text>
                    </View>
                    
                    <Text style={[styles.customerDate, { color: theme.colors.onSurfaceVariant }]}>
                      {new Date(customer.createdDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: '2-digit', 
                        year: 'numeric' 
                      })}
                    </Text>
                  </View>
                  
                  {index < stats.recentCustomers.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
                  )}
                </View>
              );
            })}
          </Surface>
        )}
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  statsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: 32,
  },
  statCard: {
    elevation: 4,
  marginBottom: 16,
  marginHorizontal: 12,
    borderRadius: 8,
    minHeight: 120,
    minWidth: 160,
  flexGrow: 0,
  flexShrink: 0,
  },
  statContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextSection: {
    flex: 1,
  },
  cardIcon: {
    fontSize: 32,
    marginLeft: 16,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  recentSection: {
    padding: 24,
    borderRadius: 12,
    elevation: 2,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllButton: {
    marginRight: -8,
  },
  recentCustomerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
  },
  customerDate: {
    fontSize: 14,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});