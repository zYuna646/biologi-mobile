import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide tab bar since we only have one tab
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Biologi Edukasi',
        }}
      />
    </Tabs>
  );
}
