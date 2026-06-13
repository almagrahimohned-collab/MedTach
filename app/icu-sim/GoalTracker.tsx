import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GoalTrackerProps {
  goals: string[];
  completedGoals: string[];
}

export default function GoalTracker({ goals, completedGoals }: GoalTrackerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Treatment Goals</Text>
      {goals.map((goal, i) => {
        const done = completedGoals.includes(goal);
        return (
          <View key={i} style={styles.goalRow}>
            <Ionicons 
              name={done ? 'checkmark-circle' : 'ellipse-outline'} 
              size={18} 
              color={done ? '#10B981' : '#64748B'} 
            />
            <Text style={[styles.goalText, done && styles.goalDone]}>{goal}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  goalText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  goalDone: {
    color: '#10B981',
    textDecorationLine: 'line-through',
  },
});
