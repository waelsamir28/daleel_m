import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { C, EmptyState, Header, ProfessionalCard, SectionTitle, styles } from "@/components/directory-ui";
import { useDirectory } from "@/lib/directory-context";

export default function SpecialtyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { specialties, categories, professionals } = useDirectory();
  const specialty = specialties.find((item) => item.id === id);
  const category = categories.find((item) => item.id === specialty?.categoryId);
  const results = professionals.filter((item) => item.specialtyId === id && item.active);
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content}><Header title={specialty?.name ?? "الخدمات"} showBack /><View style={{ marginTop: 15, flexDirection: "row-reverse", alignItems: "center", gap: 11 }}><View style={{ width: 50, height: 50, borderRadius: 17, backgroundColor: `${category?.color ?? C.blue}20`, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 25 }}>✦</Text></View><View style={{ flex: 1, alignItems: "flex-end" }}><Text style={{ color: C.ink, fontSize: 22, fontWeight: "900" }}>{specialty?.name}</Text><Text style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>{category?.name} · {results.length} نتيجة</Text></View></View><SectionTitle title="مقدمو الخدمة" subtitle="اختار مقدم الخدمة المناسب وتواصل معه" />{results.length ? results.map((professional) => <ProfessionalCard key={professional.id} professional={professional} />) : <EmptyState title="لا يوجد مسجلون بعد" message="يمكنك إضافة مهنتك وسيتم عرضها بعد مراجعة الإدارة." />}</ScrollView></View>;
}
