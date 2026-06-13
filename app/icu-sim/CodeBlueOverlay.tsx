import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface CodeBlueProps {
  active: boolean;
  onComplete?: () => void;
}

export default function CodeBlueOverlay({ active, onComplete }: CodeBlueProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      slideAnim.setValue(-300);
      flashAnim.setValue(0);
      return;
    }

    // Slide in CODE BLUE banner
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Red flash
    const flash = Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    flash.start();

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onComplete?.());
    }, 3000);

    return () => {
      pulse.stop();
      flash.stop();
      clearTimeout(timer);
    };
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Red flash background */}
      <Animated.View style={[styles.flash, { opacity: flashAnim }]} />
      
      {/* CODE BLUE Banner */}
      <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
        <Animated.Text style={[styles.title, { opacity: pulseAnim }]}>
          ⚡ CODE BLUE ⚡
        </Animated.Text>
        <Text style={styles.subtitle}>Cardiac Arrest Protocol Activated</Text>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>00:00</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EF4444',
  },
  banner: {
    marginTop: 80,
    backgroundColor: '#1A0000',
    borderWidth: 3,
    borderColor: '#EF4444',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    width: '90%',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FCA5A5',
    fontWeight: '600',
  },
  timerBox: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EF4444',
    fontFamily: 'monospace',
  },
});
