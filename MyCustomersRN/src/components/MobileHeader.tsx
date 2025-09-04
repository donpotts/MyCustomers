import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import { useSideNav } from '../contexts/SideNavContext';

interface MobileHeaderProps {
  title: string;
  navigation: any;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, navigation }) => {
  const paperTheme = usePaperTheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isOpen, toggle } = useSideNav();

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: paperTheme.colors.primary }]}>
      <Appbar.Action 
        icon="menu" 
        onPress={toggle}
        iconColor={paperTheme.colors.onPrimary}
      />
      <Appbar.Content 
        title={title}
        titleStyle={[styles.title, { color: paperTheme.colors.onPrimary }]}
      />
      <Appbar.Action 
        icon={isDarkMode ? "weather-night" : "weather-sunny"} 
        onPress={toggleTheme}
        iconColor={paperTheme.colors.onPrimary}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});