import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface FluidEntry {
  id: string;
  time: number;
  type: 'input' | 'output';
  name: string;
  volume: number;
}

interface FluidBalanceProps {
  events: any[];
  activeOrders: any[];
  simTime: number;
  vitals: {
    urineOutput: number;
    cvp: number;
    map: number;
  };
  patientWeight?: number;
}

export default function FluidBalance({ events, activeOrders, simTime, vitals, patientWeight = 70 }: FluidBalanceProps) {
  const { entries, totalInput, totalOutput, balance, hourlyRate } = useMemo(() => {
    const entries: FluidEntry[] = [];
    let totalInput = 0;
    let totalOutput = 0;

    // Parse events for fluid orders
    for (const event of events) {
      const match = event.match(/\[(\d+)m\] (?:💊|💧) (.+)/);
      if (!match) continue;
      
      const time = parseInt(match[1]);
      const detail = match[2];
      
      // Detect fluid inputs
      const salineMatch = detail.match(/(\w+\s*\w*\s*\w+)\s+(\d+)mL/i);
      const ringerMatch = detail.match(/Ringer.*?(\d+)mL/i);
      const albuminMatch = detail.match(/Albumin.*?(\d+)mL/i);
      const bloodMatch = detail.match(/(?:Blood|PRBC|FFP).*?(\d+)mL/i);
      
      if (salineMatch || ringerMatch || albuminMatch || bloodMatch) {
        const volMatch = detail.match(/(\d+)\s*mL/);
        if (volMatch) {
          const volume = parseInt(volMatch[1]);
          totalInput += volume;
          entries.push({
            id: `in-${time}-${Math.random()}`,
            time,
            type: 'input',
            name: detail.substring(0, 30),
            volume,
          });
        }
      }
      
      // Detect urine output from events
      const uoMatch = detail.match(/urine.*?(\d+)/i);
      if (uoMatch) {
        const volume = parseInt(uoMatch[1]);
        totalOutput += volume;
        entries.push({
          id: `out-${time}-${Math.random()}`,
          time,
          type: 'output',
          name: 'Urine Output',
          volume,
        });
      }
    }

    // Add cumulative urine output based on current rate
    const estimatedUrine = Math.round(vitals.urineOutput * simTime / 60);
    totalOutput += estimatedUrine;

    // Active fluid orders that are running
    for (const order of activeOrders) {
      if (!order.running) continue;
      const fluidMatch = order.name.match(/Saline|Ringer|Albumin|Blood|PRBC|FFP/i);
      if (fluidMatch && order.type === 'infusion') {
        const rateMatch = order.dose.match(/(\d+)/);
        if (rateMatch) {
          const rate = parseInt(rateMatch[1]);
          const duration = simTime - order.startSimTime;
          const infused = Math.round(rate * duration / 60);
          if (infused > 0) {
            totalInput += infused;
            entries.push({
              id: `infusion-${order.id}`,
              time: simTime,
              type: 'input',
              name: `${order.name} (cont.)`,
              volume: infused,
            });
          }
        }
      }
    }

    const balance = totalInput - totalOutput;
    const hours = Math.max(1, simTime / 60);
    const hourlyRate = Math.round(balance / hours);

    return { entries: entries.sort((a, b) => b.time - a.time), totalInput, totalOutput, balance, hourlyRate };
  }, [events, activeOrders, simTime, vitals.urineOutput]);

  const balanceColor = balance > 2000 ? '#EF4444' : balance > 1000 ? '#F59E0B' : balance < -1000 ? '#F97316' : '#10B981';

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: '#38BDF8' }]}>
          <Text style={styles.summaryLabel}>Total In</Text>
          <Text style={[styles.summaryValue, { color: '#38BDF8' }]}>{totalInput}</Text>
          <Text style={styles.summaryUnit}>mL</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: '#F59E0B' }]}>
          <Text style={styles.summaryLabel}>Total Out</Text>
          <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>{totalOutput}</Text>
          <Text style={styles.summaryUnit}>mL</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: balanceColor }]}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.summaryValue, { color: balanceColor }]}>
            {balance > 0 ? '+' : ''}{balance}
          </Text>
          <Text style={styles.summaryUnit}>mL</Text>
        </View>
      </View>

      {/* Balance Bar */}
      <View style={styles.barSection}>
        <Text style={styles.barLabel}>
          Net: <Text style={{ color: balanceColor, fontWeight: '800' }}>{balance > 0 ? '+' : ''}{balance} mL</Text>
          {' '}({hourlyRate > 0 ? '+' : ''}{hourlyRate} mL/hr)
        </Text>
        <View style={styles.barContainer}>
          {/* Input bar */}
          <View style={[styles.bar, styles.inputBar, { width: `${Math.min(100, totalInput / (totalInput + totalOutput || 1) * 100)}%` }]}>
            <Text style={styles.barText}>{totalInput} in</Text>
          </View>
          {/* Output bar */}
          <View style={[styles.bar, styles.outputBar, { width: `${Math.min(100, totalOutput / (totalInput + totalOutput || 1) * 100)}%` }]}>
            <Text style={styles.barText}>{totalOutput} out</Text>
          </View>
        </View>
      </View>

      {/* Weight-based Context */}
      <View style={styles.contextRow}>
        <View style={styles.contextItem}>
          <Text style={styles.contextLabel}>mL/kg</Text>
          <Text style={styles.contextValue}>{Math.round(totalInput / patientWeight)}</Text>
        </View>
        <View style={styles.contextItem}>
          <Text style={styles.contextLabel}>Target (30mL/kg)</Text>
          <Text style={[styles.contextValue, { color: totalInput >= patientWeight * 30 ? '#10B981' : '#F59E0B' }]}>
            {patientWeight * 30}
          </Text>
        </View>
        <View style={styles.contextItem}>
          <Text style={styles.contextLabel}>U/O Rate</Text>
          <Text style={[styles.contextValue, { color: vitals.urineOutput >= 30 ? '#10B981' : vitals.urineOutput >= 15 ? '#F59E0B' : '#EF4444' }]}>
            {vitals.urineOutput}
          </Text>
          <Text style={styles.contextSub}>mL/hr</Text>
        </View>
        <View style={styles.contextItem}>
          <Text style={styles.contextLabel}>CVP</Text>
          <Text style={[styles.contextValue, { color: vitals.cvp > 15 ? '#EF4444' : vitals.cvp < 3 ? '#F59E0B' : '#10B981' }]}>
            {vitals.cvp}
          </Text>
          <Text style={styles.contextSub}>mmHg</Text>
        </View>
      </View>

      {/* Recent Entries */}
      <Text style={styles.sectionTitle}>📋 Recent Fluid Entries</Text>
      <View style={styles.entriesList}>
        {entries.slice(0, 15).map((entry, i) => (
          <View key={entry.id || i} style={styles.entryRow}>
            <View style={[styles.entryIndicator, { backgroundColor: entry.type === 'input' ? '#38BDF8' : '#F59E0B' }]} />
            <Text style={styles.entryTime}>{entry.time}m</Text>
            <Text style={styles.entryName} numberOfLines={1}>{entry.name}</Text>
            <Text style={[styles.entryVolume, { color: entry.type === 'input' ? '#38BDF8' : '#F59E0B' }]}>
              {entry.type === 'input' ? '+' : '-'}{entry.volume} mL
            </Text>
          </View>
        ))}
        {entries.length === 0 && (
          <Text style={styles.emptyText}>No fluid entries recorded yet</Text>
        )}
      </View>

      {/* Alerts */}
      {balance > 3000 && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>🚨 Positive fluid balance &gt;3L - risk of pulmonary edema</Text>
        </View>
      )}
      {balance < -1500 && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>⚠️ Negative fluid balance &gt;1.5L - risk of hypoperfusion</Text>
        </View>
      )}
      {vitals.cvp > 15 && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>⚠️ CVP elevated ({vitals.cvp} mmHg) - consider diuresis</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 6,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  summaryUnit: {
    fontSize: 8,
    color: '#64748B',
  },
  barSection: {
    gap: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  barContainer: {
    height: 24,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  bar: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  inputBar: {
    backgroundColor: '#38BDF8',
  },
  outputBar: {
    backgroundColor: '#F59E0B',
    position: 'absolute',
    right: 0,
  },
  barText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  contextRow: {
    flexDirection: 'row',
    gap: 6,
  },
  contextItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
  },
  contextLabel: {
    fontSize: 8,
    color: '#64748B',
  },
  contextValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  contextSub: {
    fontSize: 7,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  entriesList: {
    gap: 4,
    maxHeight: 200,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    padding: 6,
  },
  entryIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  entryTime: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    width: 30,
  },
  entryName: {
    flex: 1,
    fontSize: 11,
    color: '#CBD5E1',
  },
  entryVolume: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    padding: 12,
  },
  alert: {
    backgroundColor: '#EF444415',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  alertText: {
    fontSize: 11,
    color: '#FCA5A5',
    fontWeight: '600',
  },
});
