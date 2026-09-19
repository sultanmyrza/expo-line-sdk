import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import APIPage from './screen/APIPage';
import HomePage from './screen/HomePage';
import { accentColor, textColor } from './theme';

type Tab = 'user' | 'api';

export default function App() {
  const [tab, setTab] = useState<Tab>('user');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.appBar}>
        <Text style={styles.title}>LINE SDK</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'user' && styles.tabActive]}
            onPress={() => setTab('user')}
            activeOpacity={0.7}>
            <Text style={styles.tabText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'api' && styles.tabActive]}
            onPress={() => setTab('api')}
            activeOpacity={0.7}>
            <Text style={styles.tabText}>API</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.page, tab !== 'user' && styles.hidden]}>
        <HomePage />
      </View>
      <View style={[styles.page, tab !== 'api' && styles.hidden]}>
        <APIPage />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eee',
  },
  appBar: {
    backgroundColor: accentColor,
  },
  title: {
    color: textColor,
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: textColor,
  },
  tabText: {
    color: textColor,
    fontSize: 16,
    fontWeight: '600',
  },
  page: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
