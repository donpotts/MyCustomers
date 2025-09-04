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
  Chip,
} from 'react-native-paper';
import { User } from '../types/User';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

interface UsersScreenProps {
  navigation: any;
  route?: {
    params?: {
      refresh?: boolean;
    };
  };
}

export const UsersScreen: React.FC<UsersScreenProps> = ({ navigation, route }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true); // Default to grid view
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Default to 6 items per page
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];
  const { user, logout, isAuthenticated } = useAuth();
  const theme = usePaperTheme();
  
  const { width } = windowDimensions;
  const isWeb = width > 768;

  // Fixed card widths for multiple cards per row like Blazor (wider cards)
  const cardWidth = isWeb && !isGridView ? 350 : width - 32;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (isAuthenticated && user) {
          const currentUser = await userService.getCurrentUser();
          setIsAdmin(currentUser.isAdmin);
          if (!currentUser.isAdmin) {
            Alert.alert(
              'Access Denied',
              'You do not have permission to access user management.',
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
  }, [isAuthenticated, user, navigation]);

  const loadUsers = useCallback(async () => {
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterUsers = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => {
      const searchString = query.toLowerCase();
      return (
        user.email.toLowerCase().includes(searchString)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [users]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterUsers(query);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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
      await loadUsers();
    } finally {
      setRefreshing(false);
    }
  }, [loadUsers]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
      return;
    }
    if (isAdmin) {
      loadUsers();
    }
  }, [loadUsers, isAuthenticated, isAdmin, navigation]);

  // Listen for route params to refresh data
  useEffect(() => {
    if (route?.params?.refresh) {
      loadUsers();
      // Clear the refresh param
      navigation.setParams({ refresh: false });
    }
  }, [route?.params?.refresh, loadUsers, navigation]);

  // Use focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAdmin) {
        loadUsers();
      }
    });

    return unsubscribe;
  }, [navigation, loadUsers, isAdmin]);

  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    const userName = userToDelete.email;

    try {
      await userService.deleteUser(userToDelete.id);
      await loadUsers();
      // Close dialog and reset state
      setShowDeleteDialog(false);
      setUserToDelete(null);
      
      // Show success message using Alert for web compatibility
      // if (Platform.OS === 'web') {
      //   window.alert(`${userName} has been deleted successfully.`);
      // } else {
      //   Alert.alert('Success', `${userName} has been deleted successfully.`);
      // }
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      
      // Show error message
      if (Platform.OS === 'web') {
        window.alert(`Failed to delete ${userName}. ${errorMessage}`);
      } else {
        Alert.alert('Error', `Failed to delete ${userName}. ${errorMessage}`);
      }
    } finally {
      setIsDeleting(false);
    }
  }, [userToDelete, loadUsers]);

  const cancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
    setIsDeleting(false);
  }, []);

  const renderUserItem = ({ item }: { item: User }) => {
    const displayName = item.email;
    const isCurrentUser = item.id === user?.id;

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
          <View style={styles.emailColumn}>
            <Chip 
              icon={item.isAdmin ? 'shield-account' : 'account'}
              mode="outlined"
              compact
              style={styles.roleChip}
              textStyle={{ fontSize: 12 }}
            >
              {item.isAdmin ? 'Admin' : 'User'}
            </Chip>
          </View>
          <Text style={[styles.tableCellText, styles.phoneColumn, { color: theme.colors.onSurfaceVariant }]}>
            {new Date(item.createdDate || Date.now()).toLocaleDateString()}
          </Text>
          <View style={styles.actionsColumn}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
              iconColor={theme.colors.primary}
            />
            {!isCurrentUser && (
              <IconButton
                icon="delete"
                size={20}
                onPress={(event) => {
                  event?.stopPropagation();
                  handleDeleteUser(item);
                }}
                iconColor={theme.colors.error}
              />
            )}
          </View>
        </View>
      );
    }

    // Card layout for mobile or card view
    const cardStyle = isWeb && !isGridView
      ? [styles.userCard, styles.userCardWeb, { backgroundColor: theme.colors.surface, width: cardWidth, maxWidth: cardWidth }]
      : [styles.userCard, { backgroundColor: theme.colors.surface }];

    return (
      <Card style={cardStyle}>
        <Card.Content style={isWeb && !isGridView ? styles.userContentWeb : styles.userContent}>
          <View style={isWeb && !isGridView ? styles.userHeaderWeb : styles.userHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <Title style={[styles.userName, { color: theme.colors.onSurface }]}>
                {displayName}
              </Title>
              <Chip 
                icon={item.isAdmin ? 'shield-account' : 'account'}
                mode="outlined"
                compact
                style={styles.roleChip}
              >
                {item.isAdmin ? 'Admin' : 'User'}
              </Chip>
              <Text style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>
                Added: {new Date(item.createdDate || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card.Content>
        
        <Card.Actions style={isWeb && !isGridView ? styles.userActionsWeb : styles.userActions}>
          <Button
            mode="text"
            icon="pencil"
            onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
            textColor={theme.colors.primary}
            style={styles.actionButton}
          >
            Edit
          </Button>
          {!isCurrentUser && (
            <Button
              mode="text"
              icon="delete"
              onPress={(event) => {
                event?.stopPropagation();
                handleDeleteUser(item);
              }}
              textColor={theme.colors.error}
              style={styles.actionButton}
            >
              Delete
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <Title style={[styles.pageTitle, { color: theme.colors.onSurface }]}>
            Users
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
              onPress={() => navigation.navigate('CreateUser')}
              style={styles.addUserButton}
            >
              ADD USER
            </Button>
          </View>
        </View>
        
        <Searchbar
          placeholder="Search users..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={{ color: theme.colors.onSurfaceVariant }}
          iconColor={theme.colors.onSurfaceVariant}
        />
        
        {/* Table Header for Grid View */}
        {isWeb && isGridView && (
          <View style={[styles.tableHeader, { backgroundColor: theme.colors.surfaceVariant, borderBottomColor: theme.colors.outline }]}>
            <Text style={[styles.tableHeaderText, styles.nameColumn, { color: theme.colors.onSurfaceVariant }]}>Email</Text>
            <Text style={[styles.tableHeaderText, styles.emailColumn, { color: theme.colors.onSurfaceVariant }]}>Role</Text>
            <Text style={[styles.tableHeaderText, styles.phoneColumn, { color: theme.colors.onSurfaceVariant }]}>Created</Text>
            <Text style={[styles.tableHeaderText, styles.actionsColumn, { color: theme.colors.onSurfaceVariant }]}>Actions</Text>
          </View>
        )}
      </Surface>

      {/* Scrollable Content Container */}
      <View style={styles.scrollContainer}>
        <FlatList
          data={paginatedUsers}
          renderItem={renderUserItem}
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
                {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found'}
              </Text>
              {!searchQuery && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('CreateUser')}
                  style={styles.addButton}
                >
                  Add First User
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
      {filteredUsers.length > 0 && (
        <Surface style={[styles.paginationContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.paginationInfo}>
            <Text style={[styles.paginationText, { color: theme.colors.onSurfaceVariant }]}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
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
          <Dialog.Title style={styles.dialogTitle}>Delete User</Dialog.Title>
          <Dialog.Content style={styles.dialogContentContainer}>
            <Text style={[styles.dialogContent, { color: theme.colors.onSurface }]}>
              Are you sure you want to delete{' '}
              <Text style={[styles.userNameInDialog, { color: theme.colors.primary }]}>
                {userToDelete?.email}
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
  addUserButton: {
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
  userCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
    minHeight: 200,
  },
  userCardWeb: {
    marginHorizontal: 15,
    marginBottom: 24,
    minHeight: 220,
  },
  userContent: {
    paddingBottom: 8,
    flex: 1,
  },
  userContentWeb: {
    padding: 16,
    paddingBottom: 8,
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userHeaderWeb: {
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  roleChip: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  userActions: {
    paddingTop: 0,
    paddingHorizontal: 8,
    justifyContent: 'flex-end',
  },
  userActionsWeb: {
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
    flex: 1.5,
  },
  phoneColumn: {
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
  userNameInDialog: {
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