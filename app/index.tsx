import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS, RADIUS, SHADOWS, SPACING } from "@/src/constants/theme";
import { Plus } from "lucide-react-native";

import { supabase } from "@/src/lib/supabase";
import { Transaction } from "@/src/types/transaction";

import BalanceCard from "@/src/components/BalanceCard";
import SearchBar from "@/src/components/SearchBar";
import TransactionCard from "@/src/components/TransactionCard";

export default function HomeScreen() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // Auto-refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  async function fetchTransactions(searchText?: string) {
    let query = supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (searchText) {
      query = query.or(
        `category.ilike.%${searchText}%,type.ilike.%${searchText}%`
      );
    }

    const { data } = await query;
    if (!data) return;

    let incomeSum = 0;
    let expenseSum = 0;

    data.forEach((t) => {
      if (t.type === "income") incomeSum += Number(t.amount);
      else expenseSum += Number(t.amount);
    });

    setIncome(incomeSum);
    setExpense(expenseSum);
    setTransactions(data);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>Sayan</Text>
      </View>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={(text) => {
          setSearch(text);
          fetchTransactions(text);
        }}
      />

      {/* Balance */}
      <BalanceCard income={income} expense={expense} />

      {/* Transactions */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={() =>
              router.push({
                pathname: "/update/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add")}
        activeOpacity={0.8}
      >
        <Plus color={COLORS.surface} size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: SPACING.s,
    marginTop: SPACING.xl,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  username: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: SPACING.l,
    bottom: SPACING.l,
    width: 64,
    height: 64,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
  },
});
