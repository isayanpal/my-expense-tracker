import { COLORS } from "@/src/constants/theme";
import { Tabs } from "expo-router";
import { ChartBar, Home } from "lucide-react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.surface,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="add/index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="update/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="statistics/index"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <ChartBar size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
