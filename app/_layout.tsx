import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { I18nManager, Platform } from "react-native";
import { ThemeProvider } from "@/lib/theme-provider";
import { SafeAreaFrameContext, SafeAreaInsetsContext, SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";
import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { DirectoryProvider } from "@/lib/directory-context";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };
export const unstable_settings = { anchor: "(tabs)" };

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;
  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);
  useEffect(() => {
    initManusRuntime();
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.dir = "rtl";
      if (!document.querySelector('link[rel="manifest"]')) {
        const manifest = document.createElement("link");
        manifest.rel = "manifest";
        manifest.href = "/manifest.json";
        document.head.appendChild(manifest);
      }
      if (!document.querySelector('meta[name="theme-color"]')) {
        const theme = document.createElement("meta");
        theme.name = "theme-color";
        theme.content = "#0c376f";
        document.head.appendChild(theme);
      }
      if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);
  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => { setInsets(metrics.insets); setFrame(metrics.frame); }, []);
  useEffect(() => { if (Platform.OS !== "web") return; const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate); return () => unsubscribe(); }, [handleSafeAreaUpdate]);
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } }));
  const [trpcClient] = useState(() => createTRPCClient());
  const providerInitialMetrics = useMemo(() => ({ ...(initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame }), insets: { ...initialInsets, top: Math.max(initialInsets.top, 16), bottom: Math.max(initialInsets.bottom, 12) } }), [initialInsets, initialFrame]);
  const content = <GestureHandlerRootView style={{ flex: 1 }}><trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><DirectoryProvider><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="oauth/callback" /></Stack></DirectoryProvider><StatusBar style="auto" /></QueryClientProvider></trpc.Provider></GestureHandlerRootView>;
  if (Platform.OS === "web") return <ThemeProvider><SafeAreaProvider initialMetrics={providerInitialMetrics}><SafeAreaFrameContext.Provider value={frame}><SafeAreaInsetsContext.Provider value={insets}>{content}</SafeAreaInsetsContext.Provider></SafeAreaFrameContext.Provider></SafeAreaProvider></ThemeProvider>;
  return <ThemeProvider><SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider></ThemeProvider>;
}
