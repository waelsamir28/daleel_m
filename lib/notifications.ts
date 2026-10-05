import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const ADMIN_PUSH_TOKEN_KEY = "genzor-admin-push-token";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: true }),
});

export async function registerAdminForPushNotifications() {
  if (Platform.OS === "web") return null;
  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;
  if (status !== "granted") status = (await Notifications.requestPermissionsAsync()).status;
  if (status !== "granted") return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await AsyncStorage.setItem(ADMIN_PUSH_TOKEN_KEY, token);
  return token;
}

/** يستخدم حالياً كتجربة مجانية على الجهاز نفسه. للإرسال بين الأجهزة، يرسل الخادم الطلب إلى Expo Push API باستخدام التوكن المحفوظ. */
export async function notifyAdminOnNewSubmission(name: string) {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: { title: "طلب مهنة جديد", body: `وصل طلب جديد من: ${name}`, data: { type: "professional_submission" } },
    trigger: null,
  });
}
