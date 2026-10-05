import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { C, Header, Icon, PrimaryButton, styles } from "@/components/directory-ui";
import { useDirectory } from "@/lib/directory-context";

const inputStyle = { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 15, height: 52, paddingHorizontal: 14, fontSize: 15, color: C.ink, textAlign: "right" as const, marginTop: 7 };
export default function AdminLoginScreen() {
  const { signInAdmin } = useDirectory();
  const [username, setUsername] = useState(""); const [password, setPassword] = useState("");
  const submit = () => { if (signInAdmin(username, password)) router.replace("/admin" as never); else Alert.alert("بيانات غير صحيحة", "اسم المستخدم أو كلمة المرور غير صحيحة."); };
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content}><Header title="دخول الإدارة" showBack /><View style={{ alignItems: "center", marginTop: 30 }}><View style={{ width: 82, height: 82, borderRadius: 29, backgroundColor: C.navy, alignItems: "center", justifyContent: "center" }}><Icon name="shield-lock" size={42} color={C.orange} /></View><Text style={{ color: C.ink, fontSize: 25, fontWeight: "900", marginTop: 14 }}>لوحة تحكم الإدارة</Text><Text style={{ color: C.muted, fontSize: 14, marginTop: 5 }}>هذه الصفحة متاحة للأدمن فقط</Text></View><View style={{ marginTop: 28 }}><Text style={{ color: C.ink, fontSize: 14, fontWeight: "800", textAlign: "right" }}>اسم الدخول</Text><TextInput value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="admin" placeholderTextColor={C.muted} style={inputStyle} /><Text style={{ color: C.ink, fontSize: 14, fontWeight: "800", textAlign: "right", marginTop: 16 }}>كلمة المرور</Text><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="admin" placeholderTextColor={C.muted} style={inputStyle} /></View><View style={{ marginTop: 22 }}><PrimaryButton title="تسجيل دخول آمن" icon="login" onPress={submit} /></View><View style={{ backgroundColor: "#eef6ff", borderRadius: 15, padding: 13, marginTop: 17, flexDirection: "row-reverse", gap: 8 }}><Icon name="information-outline" size={19} color={C.blue} /><Text style={{ flex: 1, color: C.muted, fontSize: 12, lineHeight: 20, textAlign: "right" }}>بيانات الدخول التجريبية: admin / admin. غيّرها قبل النشر العام.</Text></View></ScrollView></View>;
}
