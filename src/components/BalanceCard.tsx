import { COLORS, RADIUS, SHADOWS, SPACING } from "@/src/constants/theme";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  income: number;
  expense: number;
};

export default function BalanceCard({ income, expense }: Props) {
  const balance = income - expense;

  return (
    <View style={styles.card}>
      <View style={styles.balanceContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Total Balance</Text>
          <Wallet size={20} color={COLORS.surface} opacity={0.8} />
        </View>
        <Text style={styles.balance}>₹ {balance}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.stat}>
          <View
            style={[styles.icon, { backgroundColor: COLORS.success + "20" }]}
          >
            <TrendingUp size={16} color={COLORS.success} />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.income}>₹{income}</Text>
          </View>
        </View>

        <View style={styles.stat}>
          <View
            style={[styles.icon, { backgroundColor: COLORS.danger + "20" }]}
          >
            <TrendingDown size={16} color={COLORS.danger} />
          </View>
          <View>
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={styles.expense}>₹{expense}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    padding: SPACING.l,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.m,
    ...SHADOWS.medium,
  },
  balanceContainer: {
    marginBottom: SPACING.l,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.surface,
    opacity: 0.8,
    fontSize: 14,
    fontWeight: "500",
  },
  balance: {
    color: COLORS.surface,
    fontSize: 32,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: SPACING.l,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
  },
  stat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.s,
  },
  icon: {
    padding: 8,
    borderRadius: RADIUS.round,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  income: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  expense: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
