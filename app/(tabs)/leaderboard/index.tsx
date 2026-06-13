import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useStore } from '../../../src/store';
const R = [{ id: '1', name: 'Dr. Sarah', score: 8900 },{ id: '2', name: 'Dr. Khalid', score: 8450 },{ id: '3', name: 'Dr. Youssef', score: 7800 },{ id: '4', name: 'Dr. Layla', score: 6200 },{ id: '5', name: 'Dr. Omar', score: 5100 }];
export default function Leaderboard() {
  const { totalPoints } = useStore();
  const all = [...R, { id: 'me', name: 'Dr. You', score: totalPoints, isMe: true }].sort((a, b) => b.score - a.score);
  return (<View style={s.c}><Text style={s.t}>Leaderboard</Text><FlatList data={all} keyExtractor={i=>i.id} contentContainerStyle={{padding:16}} renderItem={({item,index})=>(<View style={[s.r,(item as any).isMe&&s.m]}><Text style={s.rk}>{index===0?'🥇':index===1?'🥈':index===2?'🥉':`#${index+1}`}</Text><Text style={[s.n,(item as any).isMe&&{color:'#38BDF8'}]}>{item.name}</Text><Text style={s.sc}>{item.score.toLocaleString()} pts</Text></View>)}/></View>);
}
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#0A0E1A' }, t: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', padding: 20 }, r: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: '#334155' }, m: { borderColor: '#38BDF8', backgroundColor: '#38BDF808' }, rk: { fontSize: 20, width: 44, color: '#F8FAFC', fontWeight: '700' }, n: { flex: 1, color: '#F8FAFC', fontSize: 14, fontWeight: '600' }, sc: { color: '#F59E0B', fontSize: 14, fontWeight: '700' } });
