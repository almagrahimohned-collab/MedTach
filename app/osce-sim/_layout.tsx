import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * OSCE Simulator Layout
 * 
 * Navigation Stack:
 * 1. index    - Welcome/Dashboard screen
 * 2. station  - Active OSCE station (where student performs)
 * 3. results  - Post-station feedback and scoring
 */
export default function OSCELayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0E1A' },
          animation: 'fade',
          animationDuration: 200,
        }}
      >
        {/* Welcome/Dashboard Screen */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Active Station Screen */}
        <Stack.Screen
          name="station"
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent accidental back during station
            animation: 'slide_from_right',
          }}
        />

        {/* Results/Feedback Screen */}
        <Stack.Screen
          name="results"
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
