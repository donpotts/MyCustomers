import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  ActivityIndicator,
  Searchbar,
  Surface,
  IconButton,
  Dialog,
  Portal,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { Customer } from '../types/Customer';
import { customerService } from '../services/customerService';
import { useAuth } from '../contexts/AuthContext';

interface CustomerListScreenProps {
  navigation: any;
  route?: {
    params?: {
      refresh?: boolean;
    };
  };
}

export const CustomerListScreen: React.FC<CustomerListScreenProps> = ({ navigation, route }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true); // Default to grid view
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Default to 6 items per page
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];
  const { user, logout, isAuthenticated } = useAuth();
  const theme = usePaperTheme();
  
  const { width } = windowDimensions;
  const isWeb = width > 768;
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Fixed card widths for multiple cards per row like Blazor (wider cards)
  const cardWidth = isWeb && !isGridView ? 350 : width - 32;

  const loadCustomers = useCallback(async () => {
    try {
      const fetchedCustomers = await customerService.getCustomers(0,1000);
      setCustomers(fetchedCustomers);
      setFilteredCustomers(fetchedCustomers);
    } catch (error) {
      Alert.alert('Error', 'Failed to load customers');
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterCustomers = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer => {
      const searchString = query.toLowerCase();
      const displayName = customer.firstName && customer.lastName 
        ? `${customer.firstName} ${customer.lastName}` 
        : customer.name;
      
      return (
        displayName.toLowerCase().includes(searchString) ||
        customer.email.toLowerCase().includes(searchString) ||
        (customer.number && customer.number.toLowerCase().includes(searchString)) ||
        (customer.notes && customer.notes.toLowerCase().includes(searchString))
      );
    });

    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [customers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterCustomers(query);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  
  // Debug logging
  console.log('Pagination Debug:', {
    totalCustomers: filteredCustomers.length,
    pageSize,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedCount: paginatedCustomers.length
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadCustomers();
    } finally {
      setRefreshing(false);
    }
  }, [loadCustomers]);

  const handleDeleteCustomer = useCallback((customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!customerToDelete) return;
    
    setIsDeleting(true);
    const customerName = customerToDelete.firstName && customerToDelete.lastName 
      ? `${customerToDelete.firstName} ${customerToDelete.lastName}` 
      : customerToDelete.name;

    try {
      await customerService.deleteCustomer(customerToDelete.id);
      await loadCustomers();
      // Close dialog and reset state
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
      
      // Show success message using Alert for web compatibility
      // if (Platform.OS === 'web') {
      //   window.alert(`${customerName} has been deleted successfully.`);
      // } else {
      //   Alert.alert('Success', `${customerName} has been deleted successfully.`);
      // }
    } catch (error) {
      console.error('Error deleting customer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete customer';
      
      // Show error message
      if (Platform.OS === 'web') {
        window.alert(`Failed to delete ${customerName}. ${errorMessage}`);
      } else {
        Alert.alert('Error', `Failed to delete ${customerName}. ${errorMessage}`);
      }
    } finally {
      setIsDeleting(false);
    }
  }, [customerToDelete, loadCustomers]);

  const cancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setCustomerToDelete(null);
    setIsDeleting(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
      return;
    }
    loadCustomers();
  }, [loadCustomers, isAuthenticated, navigation]);

  // Listen for route params to refresh data
  useEffect(() => {
    if (route?.params?.refresh) {
      loadCustomers();
      // Clear the refresh param
      navigation.setParams({ refresh: false });
    }
  }, [route?.params?.refresh, loadCustomers, navigation]);

  // Use focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCustomers();
    });

    return unsubscribe;
  }, [navigation, loadCustomers]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    const displayName = item.firstName && item.lastName 
      ? `${item.firstName} ${item.lastName}` 
      : item.name;

    if (isWeb && isGridView) {
      // Table row layout for web grid view
      return (
        <View style={[styles.tableRow, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }]}>
          <View style={styles.nameColumn}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.tableCellText, { color: theme.colors.onSurface }]}>
              {displayName}
            </Text>
          </View>
          <Text style={[styles.tableCellText, styles.emailColumn, { color: theme.colors.primary }]}>
            {item.email}
          </Text>
          <Text style={[styles.tableCellText, styles.phoneColumn, { color: theme.colors.onSurfaceVariant }]}>
            {item.number || '-'}
          </Text>
          <Text style={[styles.tableCellText, styles.notesColumn, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
            {item.notes || '-'}
          </Text>
          <Text style={[styles.tableCellText, styles.dateColumn, { color: theme.colors.onSurfaceVariant }]}>
            {new Date(item.createdDate).toLocaleDateString()}
          </Text>
          <View style={styles.actionsColumn}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={(event) => {
                event?.stopPropagation();
                handleDeleteCustomer(item);
              }}
              iconColor={theme.colors.error}
            />
          </View>
        </View>
      );
    }

    // Card layout for mobile or card view
    const cardStyle = isWeb && !isGridView
      ? [styles.customerCard, styles.customerCardWeb, { backgroundColor: theme.colors.surface, width: cardWidth, maxWidth: cardWidth }]
      : [styles.customerCard, { backgroundColor: theme.colors.surface }];

    return (
      <Card style={cardStyle}>
        <Card.Content style={isWeb && !isGridView ? styles.customerContentWeb : styles.customerContent}>
          <View style={isWeb && !isGridView ? styles.customerHeaderWeb : styles.customerHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.customerInfo}>
              <Title style={[styles.customerName, { color: theme.colors.onSurface }]}>
                {displayName}
              </Title>
              <Text style={[styles.customerEmail, { color: theme.colors.primary }]}>
                {item.email}
              </Text>
              {item.number && (
                <Text style={[styles.customerPhone, { color: theme.colors.onSurfaceVariant }]}>
                  {item.number}
                </Text>
              )}
              {item.notes && (
                <Text style={[styles.customerNotes, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                  {item.notes}
                </Text>
              )}
              <Text style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>
                Added: {new Date(item.createdDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card.Content>
        
        <Card.Actions style={isWeb && !isGridView ? styles.customerActionsWeb : styles.customerActions}>
          <Button
            mode="text"
            icon="pencil"
            onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}
            textColor={theme.colors.primary}
            style={styles.actionButton}
          >
            Edit
          </Button>
          <Button
            mode="text"
            icon="delete"
            onPress={(event) => {
              event?.stopPropagation();
              handleDeleteCustomer(item);
            }}
            textColor={theme.colors.error}
            style={styles.actionButton}
          >
            Delete
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <Title style={[styles.pageTitle, { color: theme.colors.onSurface }]}>
            Customers
          </Title>
          <View style={styles.headerActions}>
            {isWeb && (
              <View style={styles.viewToggle}>
                <IconButton
                  icon={isGridView ? "view-list" : "view-grid"}
                  size={24}
                  onPress={() => setIsGridView(!isGridView)}
                  iconColor={theme.colors.onSurfaceVariant}
                  style={styles.viewToggleButton}
                />
              </View>
            )}
            <Button
              mode="contained"
              icon="plus"
              onPress={() => navigation.navigate('AddCustomer')}
              style={styles.addCustomerButton}
            >
              ADD CUSTOMER
            </Button>
          </View>
        </View>
        
        <Searchbar
          placeholder="Search customers..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={{ color: theme.colors.onSurfaceVariant }}
          iconColor={theme.colors.onSurfaceVariant}
        />
        
        {/* Table Header for Grid View */}
        {isWeb && isGridView && (
          <View style={[styles.tableHeader, { backgroundColor: theme.colors.surfaceVariant, borderBottomColor: theme.colors.outline }]}>
            <Text style={[styles.tableHeaderText, styles.nameColumn, { color: theme.colors.onSurfaceVariant }]}>Name</Text>
            <Text style={[styles.tableHeaderText, styles.emailColumn, { color: theme.colors.onSurfaceVariant }]}>Email</Text>
            <Text style={[styles.tableHeaderText, styles.phoneColumn, { color: theme.colors.onSurfaceVariant }]}>Phone</Text>
            <Text style={[styles.tableHeaderText, styles.notesColumn, { color: theme.colors.onSurfaceVariant }]}>Notes</Text>
            <Text style={[styles.tableHeaderText, styles.dateColumn, { color: theme.colors.onSurfaceVariant }]}>Created</Text>
            <Text style={[styles.tableHeaderText, styles.actionsColumn, { color: theme.colors.onSurfaceVariant }]}>Actions</Text>
          </View>
        )}
      </Surface>

      {/* Scrollable Content Container */}
      <View style={styles.scrollContainer}>
        <FlatList
          data={paginatedCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            isWeb && !isGridView ? styles.listCardView : styles.list, 
            isWeb && isGridView && styles.webTableList
          ]}
          style={styles.flatListStyle}
          numColumns={1}
          key={isGridView ? 'grid' : 'card'}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery ? `No customers found matching "${searchQuery}"` : 'No customers found'}
              </Text>
              {!searchQuery && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddCustomer')}
                  style={styles.addButton}
                >
                  Add First Customer
                </Button>
              )}
            </View>
          }
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          removeClippedSubviews={false}
        />
      </View>
      
      {/* Pagination Controls */}
      {filteredCustomers.length > 0 && (
        <Surface style={[styles.paginationContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.paginationInfo}>
            <Text style={[styles.paginationText, { color: theme.colors.onSurfaceVariant }]}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length}
            </Text>
          </View>
          
          <View style={styles.paginationControls}>
            {/* Page Size Selector */}
            <View style={styles.pageSizeContainer}>
              <Text style={[styles.pageSizeLabel, { color: theme.colors.onSurfaceVariant }]}>Per page:</Text>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  mode={pageSize === size ? "contained" : "outlined"}
                  compact
                  onPress={() => handlePageSizeChange(size)}
                  style={styles.pageSizeButton}
                >
                  {size}
                </Button>
              ))}
            </View>
            
            {/* Page Navigation */}
            <View style={styles.pageNavigation}>
              <Button
                mode="outlined"
                compact
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={styles.pageButton}
              >
                Previous
              </Button>
              
              <Text style={[styles.pageText, { color: theme.colors.onSurfaceVariant }]}>
                Page {currentPage} of {totalPages}
              </Text>
              
              <Button
                mode="outlined"
                compact
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={styles.pageButton}
              >
                Next
              </Button>
            </View>
          </View>
        </Surface>
      )}

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={cancelDelete} style={styles.dialog}>
          <Dialog.Icon icon="delete-alert" size={60} />
          <Dialog.Title style={styles.dialogTitle}>Delete Customer</Dialog.Title>
          <Dialog.Content style={styles.dialogContentContainer}>
            <Text style={[styles.dialogContent, { color: theme.colors.onSurface }]}>
              Are you sure you want to delete{' '}
              <Text style={[styles.customerNameInDialog, { color: theme.colors.primary }]}>
                {customerToDelete?.firstName && customerToDelete?.lastName 
                  ? `${customerToDelete.firstName} ${customerToDelete.lastName}`
                  : customerToDelete?.name
                }
              </Text>
              {'?'}
            </Text>
            <Text style={[styles.warningText, { color: theme.colors.error }]}>
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button 
              mode="text" 
              onPress={cancelDelete}
              disabled={isDeleting}
              textColor={theme.colors.onSurfaceVariant}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={confirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  flatListStyle: {
    flex: 1,
    flexGrow: 1,
    minHeight: 0,
  },
  webTableList: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewToggle: {
    marginRight: 16,
  },
  viewToggleButton: {
    margin: 0,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addCustomerButton: {
    elevation: 0,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 8,
  },
  list: {
    padding: 20,
    paddingTop: 16,
    flexGrow: 1,
  },
  listCardView: {
    padding: 20,
    paddingTop: 16,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  customerCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
    minHeight: 200,
  },
  customerCardWeb: {
    marginHorizontal: 15,
    marginBottom: 24,
    minHeight: 220,
  },
  customerContent: {
    paddingBottom: 8,
    flex: 1,
  },
  customerContentWeb: {
    padding: 16,
    paddingBottom: 8,
    flex: 1,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  customerHeaderWeb: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 13,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 13,
    marginBottom: 2,
  },
  customerNotes: {
    fontSize: 14,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  customerActions: {
    paddingTop: 0,
    paddingHorizontal: 8,
    justifyContent: 'flex-end',
  },
  customerActionsWeb: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
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
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    marginTop: 10,
  },
  // Pagination styles
  paginationContainer: {
    padding: 16,
    elevation: 4,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexShrink: 0,
  },
  paginationInfo: {
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 14,
    textAlign: 'center',
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageSizeLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  pageSizeButton: {
    marginHorizontal: 2,
    minWidth: 40,
  },
  pageNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButton: {
    marginHorizontal: 4,
  },
  pageText: {
    fontSize: 14,
    marginHorizontal: 12,
  },
  // Table styles
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 72,
  },
  tableCellText: {
    fontSize: 14,
  },
  nameColumn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailColumn: {
    flex: 2,
  },
  phoneColumn: {
    flex: 1.5,
  },
  notesColumn: {
    flex: 2,
  },
  dateColumn: {
    flex: 1.5,
  },
  actionsColumn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // Delete Dialog styles
  dialog: {
    alignSelf: 'center',
    maxWidth: 400,
    width: '90%',
    minWidth: 320,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dialogContentContainer: {
    paddingHorizontal: 24,
  },
  dialogContent: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  customerNameInDialog: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  dialogActions: {
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});