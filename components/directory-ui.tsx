import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { Category, Professional } from "@/constants/directory";
import { useDirectory } from "@/lib/directory-context";

export const C = { navy: "#0c376f", blue: "#167bd8", sky: "#e9f6ff", ink: "#102b4e", muted: "#6d7f95", orange: "#f59e0b", green: "#19a974", border: "#d8e6f3", white: "#ffffff", black: "#101114", red: "#df3e57" };

export function Icon({ name, size = 24, color = C.blue }: { name: string; size?: number; color?: string }) {
  return <MaterialCommunityIcons name={name as never} size={size} color={color} />;
}

export function Header({ title = "دليل المهن والخدمات", showBack = false }: { title?: string; showBack?: boolean }) {
  return (
    <View style={styles.header}>
      {showBack ? <Pressable onPress={() => router.back()} style={styles.headerAction}><Icon name="arrow-right" size={25} color={C.navy} /></Pressable> : <View style={styles.headerAction} />}
      <View style={styles.brandRow}>
        <Image source={{ uri: "/manus-storage/async-images/2QTPKOiwVygvcr4biPe4aI/image-1.webp" }} style={styles.headerArt} resizeMode="contain" />
        <View style={styles.pinLogo}><Icon name="map-marker-radius" size={25} color={C.white} /></View>
        <View><Text style={styles.brandTitle}>{title}</Text><Text style={styles.brandSub}>كل ما تحتاجه .. في مكان واحد</Text></View>
      </View>
      <Pressable onPress={() => router.push("/admin-login" as never)} style={styles.headerAction}><Icon name="shield-account-outline" size={24} color={C.navy} /></Pressable>
    </View>
  );
}

export function SectionTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return <View style={styles.sectionTitle}><View><Text style={styles.sectionText}>{title}</Text>{subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}</View>{action ? <Pressable onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}</View>;
}

export function Marquee({ text, active }: { text: string; active: boolean }) {
  const [x] = useState(() => new Animated.Value(-240));
  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(x, { toValue: 260, duration: 8500, useNativeDriver: Platform.OS !== "web" }),
      Animated.timing(x, { toValue: -260, duration: 0, useNativeDriver: Platform.OS !== "web" }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [active, x]);
  if (!active) return null;
  return <View style={styles.marquee}><Icon name="bullhorn-outline" size={19} color={C.orange} /><View style={styles.marqueeClip}><Animated.Text numberOfLines={1} style={[styles.marqueeText, { transform: [{ translateX: x }] }]}>{text}</Animated.Text></View></View>;
}

export function AdBanner() {
  const { advertising } = useDirectory();
  if (!advertising.isActive) return null;
  return <View style={styles.adBanner}><View style={styles.adBadge}><Icon name="bullhorn" size={22} color={C.white} /><Text style={styles.adBadgeText}>مساحة إعلانية</Text></View><View style={styles.adCopy}><Text style={styles.adTitle}>{advertising.title}</Text><Text style={styles.adContact}>{advertising.contact}</Text></View><Icon name="arrow-left-top" size={30} color={C.orange} /></View>;
}

export function CategoryCard({ category }: { category: Category }) {
  return <Pressable onPress={() => router.push(`/category/${category.id}` as never)} style={({ pressed }) => [styles.categoryCard, { borderTopColor: category.color }, pressed && { transform: [{ scale: 0.97 }] }]}><View style={[styles.categoryIcon, { backgroundColor: `${category.color}18` }]}><Icon name={category.icon} size={30} color={category.color} /></View><Text style={styles.categoryName}>{category.name}</Text><Text style={styles.categoryHint}>تصفح الآن</Text></Pressable>;
}

export function ProfessionalCard({ professional, compact = false }: { professional: Professional; compact?: boolean }) {
  const { specialties, favorites, toggleFavorite, recordContact } = useDirectory();
  const specialty = specialties.find((item) => item.id === professional.specialtyId);
  const rating = professional.ratingCount ? (professional.ratingTotal ?? 0) / professional.ratingCount : 0;
  return <Pressable onPress={() => router.push(`/professional/${professional.id}` as never)} style={({ pressed }) => [styles.professionalCard, compact && styles.compactProfessional, pressed && { opacity: 0.88 }]}><View style={styles.professionalTop}>{professional.imageUri ? <Image source={{ uri: professional.imageUri }} style={styles.avatarImage} /> : <View style={[styles.avatar, { backgroundColor: professional.active ? C.sky : "#f3f4f6" }]}><Icon name={specialty?.icon ?? "briefcase-outline"} size={27} color={professional.active ? C.blue : C.muted} /></View>}<View style={styles.professionalInfo}><Text style={styles.professionalName}>{professional.name}</Text><Text style={styles.professionalSpecialty}>{specialty?.name ?? "خدمة متنوعة"}</Text></View><Pressable onPress={(event) => { event.stopPropagation(); toggleFavorite(professional.id); }} hitSlop={8}><Icon name={favorites.includes(professional.id) ? "heart" : "heart-outline"} size={23} color={favorites.includes(professional.id) ? C.red : C.muted} /></Pressable>{professional.verified ? <View style={styles.verified}><Icon name="check-decagram" size={15} color={C.green} /><Text style={styles.verifiedText}>موثق</Text></View> : null}</View><Text numberOfLines={2} style={styles.professionalDesc}>{professional.description}</Text><View style={styles.detailLine}><Icon name="map-marker-outline" size={17} color={C.blue} /><Text style={styles.detailText}>{professional.address}</Text></View><View style={styles.detailLine}><Icon name="star" size={16} color={C.orange} /><Text style={styles.detailText}>{rating ? `${rating.toFixed(1)} تقييم` : "لم يحصل على تقييم"} · {professional.contactCount ?? 0} تواصل</Text></View><View style={styles.callRow}><Text style={styles.phone}>{professional.phone}</Text><Pressable onPress={() => { recordContact(professional.id); Linking.openURL(`tel:${professional.phone}`); }} style={styles.callButton}><Icon name="phone" size={18} color={C.white} /><Text style={styles.callText}>اتصال</Text></Pressable></View></Pressable>;
}

export function PrimaryButton({ title, onPress, icon = "arrow-left", variant = "primary" }: { title: string; onPress: () => void; icon?: string; variant?: "primary" | "dark" | "outline" | "danger" }) {
  const background = variant === "dark" ? C.black : variant === "danger" ? C.red : variant === "outline" ? C.white : C.blue;
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor: background }, variant === "outline" && styles.outlineButton, pressed && styles.buttonPressed]}><Text style={[styles.primaryButtonText, variant === "outline" && { color: C.blue }]}>{title}</Text><Icon name={icon} size={19} color={variant === "outline" ? C.blue : C.white} /></Pressable>;
}

export function Footer() {
  return <View style={styles.footer}><View style={styles.footerBrand}><View style={styles.footerLogo}><Icon name="map-marker-radius" size={24} color={C.white} /></View><View><Text style={styles.footerTitle}>دليل المهن والخدمات</Text><Text style={styles.footerSub}>قرية جنزور · خدمة محلية موثوقة</Text></View></View><View style={styles.footerDivider} /><Text style={styles.footerRights}>جميع الحقوق محفوظة لمكتب الجمال للدعاية والاعلان</Text><Pressable onPress={() => Linking.openURL("https://wa.me/201222355769")} style={({ pressed }) => [styles.footerWhatsapp, pressed && styles.buttonPressed]}><Icon name="whatsapp" size={18} color={C.white} /><Text style={styles.footerWhatsappText}>واتساب 01222355769</Text></Pressable></View>;
}

export function EmptyState({ title, message }: { title: string; message: string }) { return <View style={styles.empty}><Icon name="clipboard-text-outline" size={42} color={C.blue} /><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyText}>{message}</Text></View>; }

export function StatCard({ label, value, icon, color = C.blue }: { label: string; value: string | number; icon: string; color?: string }) { return <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: `${color}18` }]}><Icon name={icon} size={23} color={color} /></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7fbff" },
  content: { padding: 16, paddingBottom: 34 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 11, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerAction: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  brandRow: { flexDirection: "row-reverse", alignItems: "center", gap: 9 },
  pinLogo: { width: 42, height: 42, borderRadius: 16, backgroundColor: C.blue, alignItems: "center", justifyContent: "center", shadowColor: C.blue, shadowOpacity: 0.28, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  headerArt: { width: 55, height: 43, marginRight: -9, marginLeft: -4 },
  brandTitle: { fontSize: 18, fontWeight: "900", color: C.navy, textAlign: "right" },
  brandSub: { fontSize: 11, fontWeight: "600", color: C.muted, textAlign: "right", marginTop: 1 },
  sectionTitle: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 10 },
  sectionText: { fontSize: 20, fontWeight: "900", color: C.ink, textAlign: "right" },
  sectionSub: { fontSize: 13, color: C.muted, textAlign: "right", marginTop: 3 },
  sectionAction: { color: C.blue, fontSize: 14, fontWeight: "800" },
  marquee: { height: 38, borderRadius: 14, backgroundColor: C.navy, flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 12, gap: 9, overflow: "hidden" },
  marqueeClip: { flex: 1, overflow: "hidden", height: 24, justifyContent: "center" },
  marqueeText: { color: C.white, fontSize: 13, fontWeight: "700", textAlign: "right", width: 520 },
  adBanner: { borderRadius: 20, backgroundColor: C.black, padding: 15, marginTop: 14, flexDirection: "row-reverse", alignItems: "center", gap: 10, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  adBadge: { minWidth: 124, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 14, backgroundColor: C.orange, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-2deg" }], shadowColor: C.orange, shadowOpacity: 0.45, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
  adBadgeText: { color: C.white, fontSize: 13, fontWeight: "900", marginTop: 3 },
  adCopy: { flex: 1, alignItems: "flex-end" },
  adTitle: { color: C.white, fontSize: 16, fontWeight: "900", textAlign: "right" },
  adContact: { color: "#ffda8a", fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "right" },
  categoryCard: { width: 140, minHeight: 142, backgroundColor: C.white, borderRadius: 22, padding: 12, alignItems: "center", borderTopWidth: 4, marginLeft: 10, shadowColor: "#3c6790", shadowOpacity: 0.1, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  categoryIcon: { width: 62, height: 62, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  categoryName: { fontSize: 15, fontWeight: "900", color: C.ink, textAlign: "center" },
  categoryHint: { fontSize: 11, color: C.muted, marginTop: 5 },
  professionalCard: { backgroundColor: C.white, borderRadius: 20, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: C.border, shadowColor: "#42739e", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  compactProfessional: { marginBottom: 10 },
  professionalTop: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  avatar: { width: 53, height: 53, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarImage: { width: 53, height: 53, borderRadius: 18 },
  professionalInfo: { flex: 1, alignItems: "flex-end" },
  professionalName: { fontSize: 17, fontWeight: "900", color: C.ink, textAlign: "right" },
  professionalSpecialty: { fontSize: 13, color: C.blue, fontWeight: "700", textAlign: "right", marginTop: 3 },
  verified: { flexDirection: "row-reverse", gap: 3, alignItems: "center", backgroundColor: "#e8faf1", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 4 },
  verifiedText: { fontSize: 11, color: C.green, fontWeight: "800" },
  professionalDesc: { fontSize: 13, color: C.muted, lineHeight: 21, textAlign: "right", marginTop: 12 },
  detailLine: { flexDirection: "row-reverse", gap: 5, alignItems: "center", marginTop: 10 },
  detailText: { flex: 1, fontSize: 13, color: C.muted, textAlign: "right" },
  callRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 12, borderTopWidth: 1, borderTopColor: "#edf2f7", paddingTop: 10 },
  phone: { fontSize: 15, fontWeight: "800", color: C.navy, letterSpacing: 0.3 },
  callButton: { backgroundColor: C.blue, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 8, flexDirection: "row-reverse", alignItems: "center", gap: 5 },
  callText: { color: C.white, fontSize: 13, fontWeight: "900" },
  primaryButton: { minHeight: 48, borderRadius: 16, paddingHorizontal: 18, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 },
  outlineButton: { borderWidth: 1, borderColor: C.blue },
  primaryButtonText: { color: C.white, fontSize: 15, fontWeight: "900" },
  buttonPressed: { opacity: 0.84, transform: [{ scale: 0.97 }] },
  footer: { backgroundColor: C.navy, borderRadius: 22, padding: 18, marginTop: 24, alignItems: "center" },
  footerBrand: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  footerLogo: { width: 43, height: 43, borderRadius: 16, backgroundColor: C.blue, alignItems: "center", justifyContent: "center" },
  footerTitle: { color: C.white, fontSize: 16, fontWeight: "900", textAlign: "right" },
  footerSub: { color: "#bad8ef", fontSize: 11, marginTop: 3, textAlign: "right" },
  footerDivider: { width: "100%", height: 1, backgroundColor: "#ffffff22", marginVertical: 14 },
  footerRights: { color: "#d7e8f7", fontSize: 11, textAlign: "center", lineHeight: 19 },
  footerWhatsapp: { marginTop: 12, borderRadius: 12, backgroundColor: C.green, paddingHorizontal: 14, paddingVertical: 9, flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  footerWhatsappText: { color: C.white, fontSize: 12, fontWeight: "900" },
  empty: { alignItems: "center", paddingVertical: 44, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 19, fontWeight: "900", color: C.ink, marginTop: 10 },
  emptyText: { color: C.muted, fontSize: 14, lineHeight: 23, textAlign: "center", marginTop: 5 },
  statCard: { flex: 1, minWidth: 98, backgroundColor: C.white, borderRadius: 18, paddingVertical: 13, paddingHorizontal: 8, alignItems: "center", borderWidth: 1, borderColor: C.border },
  statIcon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: "900", color: C.navy, marginTop: 5 },
  statLabel: { fontSize: 12, color: C.muted, fontWeight: "700", marginTop: 2, textAlign: "center" },
});
