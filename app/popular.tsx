import { ScrollView, View } from "react-native";
import { Header, ProfessionalCard, styles } from "@/components/directory-ui";
import { useDirectory } from "@/lib/directory-context";
export default function PopularScreen() { const { professionals } = useDirectory(); const popular = [...professionals].filter((item) => item.active).sort((a, b) => (b.contactCount ?? 0) - (a.contactCount ?? 0)); return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content}><Header title="الأكثر تواصلاً" showBack />{popular.map((item) => <ProfessionalCard key={item.id} professional={item} />)}</ScrollView></View>; }
