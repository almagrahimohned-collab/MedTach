import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Achievement } from './achievements';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export default function AchievementPopup({ achievement, onDismiss }: AchievementPopupProps) {
  const translateY = useRef(new Animated.Value(150)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!achievement) return;

    // Entrance animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Sparkle animations
    const sparkle = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };

    sparkle(sparkle1, 0);
    sparkle(sparkle2, 300);
    sparkle(sparkle3, 600);

    // Auto dismiss
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 150, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onDismiss());
    }, 3500);

    return () => clearTimeout(timer);
  }, [achievement]);

  if (!achievement) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <Animated.View style={[styles.container, {
        transform: [{ translateY }, { scale }],
        opacity,
      }]}>
        {/* Sparkles */}
        <Animated.Text style={[styles.sparkle, styles.sparkle1, { opacity: sparkle1 }]}>✨</Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle2, { opacity: sparkle2 }]}>⭐</Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle3, { opacity: sparkle3 }]}>💫</Animated.Text>

        {/* Content */}
        <View style={styles.iconCircle}>
          <Text style={styles.emoji}>{achievement.emoji}</Text>
        </View>
        <Text style={styles.unlocked}>🏆 Achievement Unlocked!</Text>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    borderWidth: 3,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 250,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
  },
  sparkle1: { top: -20, left: 20 },
  sparkle2: { top: -15, right: 25 },
  sparkle3: { bottom: -20, left: '40%' },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F59E0B20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  emoji: {
    fontSize: 36,
  },
  unlocked: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
