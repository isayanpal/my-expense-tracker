import { COLORS, RADIUS, SHADOWS, SPACING } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

const CHART_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
];

export default function Statistics() {
  const [weekly, setWeekly] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  function fetchData() {
    supabase.rpc("weekly_expense").then(({ data }) => {
      if (data) {
        setWeekly(
          data.map((d: any) => ({
            label: d.day,
            value: d.total,
            frontColor: COLORS.primary,
            spacing: 20,
            labelTextStyle: { color: COLORS.textSecondary, fontSize: 12 },
          }))
        );
      }
    });

    supabase
      .rpc("monthly_expense_by_category", {
        month: dayjs().format("YYYY-MM"),
      })
      .then(({ data }) => {
        if (data) {
          setMonthly(
            data.map((d: any, index: number) => ({
              value: d.total,
              text: d.category,
              color: CHART_COLORS[index % CHART_COLORS.length],
            }))
          );
        }
      });
  }

  const totalMonthly = monthly.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={styles.header}>Statistics</Text>

      {/* WEEKLY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Expenses</Text>
        <View style={{ alignItems: "center" }}>
          <BarChart
            data={weekly}
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor={COLORS.primary}
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{ color: COLORS.textSecondary }}
            xAxisLabelTextStyle={{ color: COLORS.textSecondary }}
            isAnimated
            hideRules
          />
        </View>
      </View>

      {/* MONTHLY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Breakdown</Text>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <PieChart
            data={monthly}
            donut
            sectionAutoFocus
            radius={120}
            innerRadius={80}
            innerCircleColor={COLORS.surface}
            centerLabelComponent={() => {
              return (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={styles.totalText}>{totalMonthly}</Text>
                  <Text style={styles.totalLabel}>Total</Text>
                </View>
              );
            }}
          />
        </View>

        {/* LEGEND */}
        <View style={styles.legendContainer}>
          {monthly.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.text}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    marginTop: SPACING.xl,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.l,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: SPACING.l,
    color: COLORS.text,
  },
  totalText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: "800",
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.s,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: SPACING.m,
    paddingRight: SPACING.s,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.round,
    marginRight: SPACING.s,
  },
  legendText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  legendValue: {
    fontWeight: "600",
    color: COLORS.text,
    fontSize: 14,
  },
});
