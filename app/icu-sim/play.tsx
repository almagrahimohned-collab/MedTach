import { useLocalSearchParams } from 'expo-router';
import ICUSimulator from './ICUSimulator';

export default function PlayScreen() {
  const { scenario } = useLocalSearchParams<{ scenario: string }>();
  
  // If no scenario param, fallback to septic_shock
  const scenarioId = scenario || 'septic_shock';
  
  return <ICUSimulator scenarioId={scenarioId} />;
}
