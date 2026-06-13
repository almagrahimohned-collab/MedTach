import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, Modal, Dimensions, ScrollView,
} from 'react-native';
import Svg, { Path, Line, Text as SvgText, Rect, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ECGData {
  rate: number;
  rhythm: string;
  findings: string;
  points: { x: number; y: number }[];
  stElevation?: { startX: number; endX: number; leads: string };
}

interface ECGViewerProps {
  visible: boolean;
  onClose: () => void;
  data: ECGData;
  title?: string;
}

// بيانات ECG افتراضية لحالة STEMI
const generateSTEMIWaveform = (): ECGData => {
  const points: { x: number; y: number }[] = [];
  const width = 800;
  const height = 300;
  const midY = height / 2;

  for (let x = 0; x < width; x++) {
    let y = midY;
    const t = x % 100;

    if (t < 10) {
      y = midY - 20;
    } else if (t < 15) {
      y = midY - 30;
    } else if (t < 20) {
      y = midY + 80;
    } else if (t < 30) {
      y = midY + 90;
    } else if (t < 35) {
      y = midY + 100;
    } else if (t < 45) {
      y = midY + 95;
    } else if (t < 55) {
      y = midY + 15;
    } else if (t < 65) {
      y = midY - 30;
    } else if (t < 75) {
      y = midY + 5;
    } else {
      y = midY - 10;
    }
    points.push({ x, y: 300 - y });
  }

  return {
    rate: 110,
    rhythm: 'Sinus Tachycardia',
    findings: 'ST Elevation in V1-V4 (Anteroseptal STEMI)',
    points,
    stElevation: { startX: 200, endX: 450, leads: 'V1-V4' },
  };
};

export default function ECGViewer({ visible, onClose, data, title }: ECGViewerProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [showMeasure, setShowMeasure] = useState(false);
  const [scale, setScale] = useState(1);
  const scrollRef = useRef<ScrollView>(null);

  const ecgData = data || generateSTEMIWaveform();
  const chartWidth = 800;
  const chartHeight = 320;

  const pathData = ecgData.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#94A3B8" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{title || 'ECG Viewer'}</Text>
            <Text style={styles.headerSubtitle}>
              HR: {ecgData.rate} bpm | {ecgData.rhythm}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.toolBtn, showGrid && styles.toolBtnActive]}
              onPress={() => setShowGrid(!showGrid)}
            >
              <Ionicons name="grid" size={18} color={showGrid ? '#0F172A' : '#94A3B8'} />
            </Pressable>
            <Pressable
              style={[styles.toolBtn, showMeasure && styles.toolBtnActive]}
              onPress={() => setShowMeasure(!showMeasure)}
            >
              <Ionicons name="resize" size={18} color={showMeasure ? '#0F172A' : '#94A3B8'} />
            </Pressable>
          </View>
        </View>

        {/* ECG Display */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <Svg width={chartWidth * scale} height={chartHeight * scale} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Background */}
            <Rect x={0} y={0} width={chartWidth} height={chartHeight} fill="#0A0E1A" />

            {/* Grid */}
            {showGrid && (
              <G stroke="#1E293B" strokeWidth="0.5">
                {Array.from({ length: 16 }, (_, i) => (
                  <Line key={`h${i}`} x1={0} y1={i * 20} x2={chartWidth} y2={i * 20} />
                ))}
                {Array.from({ length: 20 }, (_, i) => (
                  <Line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={chartHeight} />
                ))}
              </G>
            )}

            {/* Main ECG Line */}
            <Path
              d={pathData}
              stroke="#10B981"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* ST Elevation Highlight */}
            {ecgData.stElevation && (
              <G>
                <Rect
                  x={ecgData.stElevation.startX - 5}
                  y={chartHeight - 130}
                  width={ecgData.stElevation.endX - ecgData.stElevation.startX + 10}
                  height={100}
                  fill="#EF444420"
                  stroke="#EF4444"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <SvgText
                  x={ecgData.stElevation.startX + (ecgData.stElevation.endX - ecgData.stElevation.startX) / 2}
                  y={chartHeight - 140}
                  fill="#EF4444"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ST↑ {ecgData.stElevation.leads}
                </SvgText>
              </G>
            )}

            {/* Labels */}
            <SvgText x={10} y={20} fill="#64748B" fontSize="10">I</SvgText>
            <SvgText x={chartWidth - 20} y={20} fill="#64748B" fontSize="10">25mm/s</SvgText>
          </Svg>
        </ScrollView>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Normal Complex</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>ST Elevation</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="information-circle" size={14} color="#F59E0B" />
            <Text style={styles.legendText}>{ecgData.findings}</Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          <Pressable style={styles.controlBtn} onPress={() => setScale(Math.max(0.5, scale - 0.25))}>
            <Ionicons name="remove" size={20} color="#F8FAFC" />
          </Pressable>
          <Text style={styles.zoomText}>{Math.round(scale * 100)}%</Text>
          <Pressable style={styles.controlBtn} onPress={() => setScale(Math.min(2, scale + 0.25))}>
            <Ionicons name="add" size={20} color="#F8FAFC" />
          </Pressable>
          <View style={{ width: 20 }} />
          <Pressable style={styles.controlBtn} onPress={() => setScale(1)}>
            <Ionicons name="refresh" size={20} color="#F8FAFC" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, paddingTop: 50,
    backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B',
  },
  closeBtn: { padding: 4 },
  headerInfo: { flex: 1, marginLeft: 12 },
  headerTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '700' },
  headerSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  toolBtn: {
    padding: 8, borderRadius: 8,
    backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155',
  },
  toolBtnActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  scrollContainer: { flex: 1 },
  scrollContent: { padding: 20 },
  legend: {
    flexDirection: 'row', justifyContent: 'space-around',
    padding: 14, backgroundColor: '#1A1F2E', borderTopWidth: 1, borderTopColor: '#1E293B',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: '#94A3B8', fontSize: 11 },
  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 14, backgroundColor: '#1A1F2E', gap: 12,
    borderTopWidth: 1, borderTopColor: '#1E293B',
  },
  controlBtn: {
    padding: 10, borderRadius: 10,
    backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155',
  },
  zoomText: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', width: 50, textAlign: 'center' },
});
