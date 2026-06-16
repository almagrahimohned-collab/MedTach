import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Annotation {
  id: string;
  x: number;        // Percentage (0-100) from left
  y: number;        // Percentage (0-100) from top
  width?: number;   // Percentage
  height?: number;  // Percentage
  label: string;
  type: 'arrow' | 'circle' | 'box' | 'pointer';
  color?: string;
  description?: string;
}

interface AnnotatedImageProps {
  imageUrl: string;
  annotations: Annotation[];
  showAnnotations: boolean;  // Show after answer
  onAnnotationPress?: (annotation: Annotation) => void;
}

export default function AnnotatedImage({ 
  imageUrl, 
  annotations, 
  showAnnotations,
  onAnnotationPress 
}: AnnotatedImageProps) {
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  if (!showAnnotations) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      
      {/* Annotations overlay */}
      {annotations.map(annotation => {
        const isSelected = selectedAnnotation === annotation.id;
        
        return (
          <Pressable
            key={annotation.id}
            style={[
              styles.annotation,
              {
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: annotation.width ? `${annotation.width}%` : 30,
                height: annotation.height ? `${annotation.height}%` : 30,
                borderColor: isSelected ? '#38BDF8' : annotation.color || '#EF4444',
                backgroundColor: isSelected ? 'rgba(56,189,248,0.2)' : 'transparent',
              },
            ]}
            onPress={() => {
              setSelectedAnnotation(isSelected ? null : annotation.id);
              onAnnotationPress?.(annotation);
            }}
          >
            {/* Arrow pointer */}
            {annotation.type === 'arrow' && (
              <Ionicons 
                name="arrow-down" 
                size={24} 
                color={annotation.color || '#EF4444'} 
              />
            )}
            
            {/* Circle */}
            {annotation.type === 'circle' && (
              <View style={[
                styles.circle,
                { borderColor: annotation.color || '#EF4444' }
              ]} />
            )}
            
            {/* Box */}
            {annotation.type === 'box' && (
              <View style={[
                styles.box,
                { borderColor: annotation.color || '#EF4444' }
              ]} />
            )}
            
            {/* Label */}
            {annotation.type === 'pointer' && (
              <View style={styles.pointerContainer}>
                <View style={[styles.pointerDot, { backgroundColor: annotation.color || '#EF4444' }]} />
                <Text style={[styles.pointerLabel, { color: annotation.color || '#EF4444' }]}>
                  {annotation.label}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}

      {/* Description popup for selected annotation */}
      {selectedAnnotation && (
        <View style={styles.descriptionPopup}>
          <Text style={styles.descriptionText}>
            {annotations.find(a => a.id === selectedAnnotation)?.description || 
             annotations.find(a => a.id === selectedAnnotation)?.label}
          </Text>
        </View>
      )}

      {/* Show labels at bottom */}
      <View style={styles.labelsContainer}>
        {annotations.map(annotation => (
          <View key={annotation.id} style={styles.labelRow}>
            <View style={[styles.labelDot, { backgroundColor: annotation.color || '#EF4444' }]} />
            <Text style={styles.labelText}>{annotation.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  annotation: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  box: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  pointerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pointerLabel: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  descriptionPopup: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  descriptionText: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 20,
  },
  labelsContainer: {
    padding: 12,
    backgroundColor: '#1E293B',
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  labelText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
});

// ========== Pre-built annotation sets for common cases ==========
export const PNEUMONIA_ANNOTATIONS: Annotation[] = [
  {
    id: 'p1',
    x: 55, y: 45, width: 25, height: 20,
    label: 'Consolidation',
    type: 'box',
    color: '#EF4444',
    description: 'Right lower lobe consolidation with air bronchograms. This is the classic appearance of lobar pneumonia.'
  },
  {
    id: 'p2',
    x: 45, y: 60,
    label: 'Air Bronchograms',
    type: 'pointer',
    color: '#F59E0B',
    description: 'Air-filled bronchi surrounded by consolidated lung. Sign of alveolar (airspace) disease.'
  },
  {
    id: 'p3',
    x: 15, y: 10,
    label: 'Clear Left Lung',
    type: 'pointer',
    color: '#10B981',
    description: 'Left lung fields are clear. Unilateral consolidation suggests bacterial pneumonia rather than pulmonary edema.'
  },
];

export const PNEUMOTHORAX_ANNOTATIONS: Annotation[] = [
  {
    id: 'pt1',
    x: 55, y: 30, width: 35, height: 40,
    label: 'Pneumothorax',
    type: 'box',
    color: '#EF4444',
    description: 'Right-sided pneumothorax. Note the visceral pleural line and absence of lung markings peripherally.'
  },
  {
    id: 'pt2',
    x: 52, y: 35,
    label: 'Pleural Line',
    type: 'pointer',
    color: '#F59E0B',
    description: 'The thin white line is the visceral pleura. Lung markings stop at this line.'
  },
  {
    id: 'pt3',
    x: 75, y: 50,
    label: 'Collapsed Lung',
    type: 'pointer',
    color: '#38BDF8',
    description: 'The collapsed right lung is seen medially. Compare with the normal left lung.'
  },
];

export const STEMI_ECG_ANNOTATIONS: Annotation[] = [
  {
    id: 's1',
    x: 30, y: 20, width: 20, height: 15,
    label: 'ST Elevation V1-V4',
    type: 'box',
    color: '#EF4444',
    description: 'ST segment elevation in leads V1-V4 indicates acute anterior wall myocardial infarction. LAD artery occlusion.'
  },
  {
    id: 's2',
    x: 70, y: 60, width: 20, height: 15,
    label: 'Reciprocal Changes',
    type: 'box',
    color: '#F59E0B',
    description: 'ST depression in inferior leads (II, III, aVF) represents reciprocal changes, confirming true STEMI.'
  },
];

export const ANNOTATION_SETS: Record<string, Annotation[]> = {
  pneumonia: PNEUMONIA_ANNOTATIONS,
  pneumothorax: PNEUMOTHORAX_ANNOTATIONS,
  stemi: STEMI_ECG_ANNOTATIONS,
  cardiomegaly: [
    {
      id: 'c1',
      x: 40, y: 40, width: 30, height: 35,
      label: 'Enlarged Cardiac Silhouette',
      type: 'circle',
      color: '#EF4444',
      description: 'Cardiothoracic ratio >0.5 indicates cardiomegaly. Compare heart width to thoracic width.'
    },
  ],
  pleural_effusion: [
    {
      id: 'pe1',
      x: 50, y: 65, width: 40, height: 25,
      label: 'Pleural Effusion',
      type: 'box',
      color: '#EF4444',
      description: 'Blunting of costophrenic angle with meniscus sign. Typical of pleural effusion.'
    },
  ],
};
