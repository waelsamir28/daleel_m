import { ScrollView, View } from "react-native";
import { Header, ProfessionalCard, styles } from "@/components/directory-ui";
import { useDirectory } from "@/lib/directory-context";
export default function LatestScreen() { const { professionals } = useDirectory(); const latest = [...professionals].filter((item) => item.active).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")); return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content}><Header title="آخر الإضافات" showBack />{latest.map((item) => <ProfessionalCard key={item.id} professional={item} />)}</ScrollView></View>; }
