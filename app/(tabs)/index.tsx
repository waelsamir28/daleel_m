import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { AdBanner, C, CategoryCard, Footer, Header, Marquee, ProfessionalCard, SectionTitle, styles } from "@/components/directory-ui";
import { useDirectory } from "@/lib/directory-context";

export default function HomeScreen() {
  const { categories, specialties, professionals, advertising, memberCount } = useDirectory();
  const [query, setQuery] = useState(""); const [addressFilter, setAddressFilter] = useState("كل المناطق"); const [specialtyFilter, setSpecialtyFilter] = useState("كل التخصصات");
  const filtered = useMemo(() => {
    const value = query.trim();
    if (!value) return professionals.filter((item) => item.active && (addressFilter === "كل المناطق" || item.address === addressFilter) && (specialtyFilter === "كل التخصصات" || specialties.find((entry) => entry.id === item.specialtyId)?.name === specialtyFilter)).slice(0, 8);
    return professionals.filter((item) => {
      const category = categories.find((entry) => entry.id === item.categoryId)?.name ?? "";
      const specialty = specialties.find((entry) => entry.id === item.specialtyId)?.name ?? "";
      return `${item.name} ${item.phone} ${item.address} ${item.description} ${category} ${specialty}`.includes(value) && item.active && (addressFilter === "كل المناطق" || item.address === addressFilter) && (specialtyFilter === "كل التخصصات" || specialty === specialtyFilter);
    }).slice(0, 8);
  }, [addressFilter, categories, professionals, query, specialties, specialtyFilter]);
  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header />
      <View style={{ marginTop: 15, backgroundColor: C.blue, borderRadius: 25, padding: 20, overflow: "hidden" }}>
        <Image source={require("../../assets/images/ganzour-hero.png")} resizeMode="cover" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.32 }} />
        <View style={{ position: "absolute", inset: 0, backgroundColor: "#0755a8a8" }} />
        <View style={{ position: "absolute", right: -38, top: -35, width: 150, height: 150, borderRadius: 75, backgroundColor: "#ffffff18" }} />
        <Text style={{ color: C.white, fontSize: 25, fontWeight: "900", textAlign: "right", lineHeight: 34, maxWidth: "84%" }}>خدمتك أقرب مما تتخيل</Text>
        <Text style={{ color: "#d8f1ff", fontSize: 15, fontWeight: "700", textAlign: "right", marginTop: 5 }}>ابحث عن أفضل المهنيين والخدمات في جنزور</Text>
        <View style={{ backgroundColor: C.white, borderRadius: 16, height: 52, marginTop: 17, flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 13, gap: 8 }}>
          <MaterialCommunityIcons name="magnify" size={25} color={C.blue} />
          <TextInput value={query} onChangeText={setQuery} placeholder="ابحث عن مهنة أو اسم مقدم الخدمة..." placeholderTextColor="#7f93aa" style={{ flex: 1, fontSize: 14, color: C.ink, textAlign: "right" }} />
          {query ? <Pressable onPress={() => setQuery("")}><MaterialCommunityIcons name="close-circle" size={20} color={C.muted} /></Pressable> : null}
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 9, flexDirection: "row-reverse" }}><View style={{ flexDirection: "row-reverse", gap: 7 }}>{["كل المناطق", ...new Set(professionals.map((item) => item.address))].map((item) => <Pressable key={item} onPress={() => setAddressFilter(item)} style={{ borderRadius: 12, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: addressFilter === item ? C.navy : C.white, borderWidth: 1, borderColor: addressFilter === item ? C.navy : C.border }}><Text style={{ color: addressFilter === item ? C.white : C.ink, fontSize: 12, fontWeight: "800" }}>{item}</Text></Pressable>)}</View></ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4, flexDirection: "row-reverse" }}><View style={{ flexDirection: "row-reverse", gap: 7 }}>{["كل التخصصات", ...specialties.map((item) => item.name)].map((item) => <Pressable key={item} onPress={() => setSpecialtyFilter(item)} style={{ borderRadius: 12, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: specialtyFilter === item ? C.blue : C.white, borderWidth: 1, borderColor: specialtyFilter === item ? C.blue : C.border }}><Text style={{ color: specialtyFilter === item ? C.white : C.ink, fontSize: 12, fontWeight: "800" }}>{item}</Text></Pressable>)}</View></ScrollView>
      <Marquee text={advertising.marquee} active={advertising.isActive} />
      <AdBanner />
      <SectionTitle title="تصفح التصنيفات" subtitle="اختار القسم المناسب لخدمتك" action="عرض الكل" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4, paddingRight: 2 }} style={{ transform: [{ scaleX: -1 }] }}>
        <View style={{ flexDirection: "row", transform: [{ scaleX: -1 }] }}>{categories.map((category) => <CategoryCard key={category.id} category={category} />)}</View>
      </ScrollView>
      <View style={{ flexDirection: "row-reverse", gap: 10, marginTop: 17 }}>
        <View style={{ flex: 1, backgroundColor: "#eaf8f2", borderRadius: 17, padding: 13, alignItems: "flex-end" }}><Text style={{ color: C.green, fontSize: 22, fontWeight: "900" }}>{memberCount}+</Text><Text style={{ color: C.ink, fontSize: 12, fontWeight: "800", marginTop: 2 }}>عضو من أهل جنزور</Text></View>
        <Pressable onPress={() => router.push("/add-profession" as never)} style={{ flex: 1.45, backgroundColor: "#fff4db", borderRadius: 17, padding: 13, flexDirection: "row-reverse", alignItems: "center", gap: 9 }}><View style={{ width: 39, height: 39, borderRadius: 13, backgroundColor: C.orange, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="plus" size={24} color={C.white} /></View><View style={{ flex: 1, alignItems: "flex-end" }}><Text style={{ color: C.ink, fontSize: 14, fontWeight: "900" }}>أضف مهنتك</Text><Text style={{ color: C.muted, fontSize: 11, textAlign: "right", marginTop: 2 }}>بعد مراجعة الإدارة</Text></View></Pressable>
      </View>
      <SectionTitle title={query ? "نتائج البحث" : "خدمات مميزة"} subtitle={query ? `وجدنا ${filtered.length} نتيجة` : "أهل الخبرة في خدمتك"} />
      {!query ? <View style={{ flexDirection: "row-reverse", gap: 8, marginBottom: 9 }}><Pressable onPress={() => router.push("/latest" as never)} style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 10, alignItems: "center", borderWidth: 1, borderColor: C.border }}><Text style={{ color: C.blue, fontSize: 12, fontWeight: "900" }}>آخر الإضافات</Text></Pressable><Pressable onPress={() => router.push("/popular" as never)} style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 10, alignItems: "center", borderWidth: 1, borderColor: C.border }}><Text style={{ color: C.orange, fontSize: 12, fontWeight: "900" }}>الأكثر تواصلاً</Text></Pressable></View> : null}
      {filtered.length ? filtered.map((professional) => <ProfessionalCard key={professional.id} professional={professional} />) : <View style={{ backgroundColor: C.white, borderRadius: 18, padding: 28, alignItems: "center" }}><MaterialCommunityIcons name="magnify-close" size={40} color={C.muted} /><Text style={{ color: C.ink, fontSize: 16, fontWeight: "800", marginTop: 7 }}>لا توجد نتائج مطابقة</Text><Text style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>جرّب كلمة بحث أخرى</Text></View>}
      <Pressable onPress={() => router.push("/register" as never)} style={{ marginTop: 8, padding: 17, borderRadius: 19, backgroundColor: C.navy, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 10 }}><MaterialCommunityIcons name="account-plus-outline" size={28} color="#9ed8ff" /><View><Text style={{ color: C.white, fontSize: 15, fontWeight: "900", textAlign: "right" }}>انضم إلى مجتمع جنزور</Text><Text style={{ color: "#bad8ef", fontSize: 12, marginTop: 2, textAlign: "right" }}>سجّل عضويتك مجاناً</Text></View></View><MaterialCommunityIcons name="chevron-left" size={24} color={C.white} /></Pressable>
      <Footer />
    </ScrollView>
  </View>;
}
