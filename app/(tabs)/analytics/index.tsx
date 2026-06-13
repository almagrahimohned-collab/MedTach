import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { useStore } from '../../../src/store';
import { LineChart } from 'react-native-chart-kit';
export default function Analytics() {
  const { completedCases, totalPoints } = useStore();
  const acc = completedCases.length > 0 ? Math.round(completedCases.reduce((a, c) => a + c.score, 0) / completedCases.length) : 0;
  const cd = completedCases.slice(-7).map(c => c.score);
  const lb = completedCases.slice(-7).map((_, i) => `#${i + 1}`);
  return (<ScrollView style={s.c}><Text style={s.t}>Analytics</Text><View style={s.rw}><View style={s.s}><Text style={s.sv}>{completedCases.length}</Text><Text style={s.sl}>Cases</Text></View><View style={s.s}><Text style={s.sv}>{totalPoints}</Text><Text style={s.sl}>Points</Text></View><View style={s.s}><Text style={s.sv}>{acc}%</Text><Text style={s.sl}>Accuracy</Text></View></View>{cd.length>1&&(<View style={s.cc}><Text style={s.ct}>Performance</Text><LineChart data={{labels:lb,datasets:[{data:cd}]}} width={Dimensions.get('window').width-32} height={200} chartConfig={{backgroundColor:'#0A0E1A',backgroundGradientFrom:'#1E293B',backgroundGradientTo:'#1E293B',decimalPlaces:0,color:(o=1)=>`rgba(56,189,248,${o})`,labelColor:()=>'#94A3B8'}} bezier style={{borderRadius:12}}/></View>)}</ScrollView>);
}
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#0A0E1A' }, t: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', padding: 20 }, rw: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 }, s: { flex: 1, backgroundColor: '#1E293B', padding: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#334155' }, sv: { color: '#F8FAFC', fontSize: 22, fontWeight: '800' }, sl: { color: '#94A3B8', fontSize: 10, marginTop: 2 }, cc: { marginHorizontal: 16, backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155' }, ct: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 10 } });
