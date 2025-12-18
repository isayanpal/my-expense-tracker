import { COLORS, RADIUS, SHADOWS, SPACING } from "@/src/constants/theme";
import { Transaction } from "@/src/types/transaction";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  transaction: Transaction;
  onPress: () => void;
};

import dayjs from "dayjs";

export default function TransactionCard({ transaction, onPress }: Props) {
  const isExpense = transaction.type === "expense";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        {isExpense ? (
          <ArrowDownLeft size={24} color={COLORS.danger} />
        ) : (
          <ArrowUpRight size={24} color={COLORS.success} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.category}>
            {transaction.category ?? "Income"}
          </Text>
          {transaction.description && (
            <Text style={styles.desc}>{transaction.description}</Text>
          )}
          <Text style={styles.date}>
            {dayjs(transaction.date).format("DD MMM, YYYY")}
          </Text>
        </View>
      </View>

      <Text style={[styles.amount, isExpense && styles.expense]}>
        ₹ {transaction.amount}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    marginBottom: SPACING.s,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...SHADOWS.small,
  },
  category: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.text,
  },
  desc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    opacity: 0.7,
  },
  amount: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.success,
  },
  expense: {
    color: COLORS.danger,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.m,
  },
  textContainer: {
    gap: 0,
  },
});
