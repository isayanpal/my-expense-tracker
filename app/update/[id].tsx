import { COLORS, RADIUS, SPACING } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  FileText,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function UpdateTransaction() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    supabase
      .from("transactions")
      .select("amount, description, date")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setAmount(String(data.amount));
        setDescription(data.description ?? "");
        setDate(new Date(data.date));
      });
  }, [id]);

  async function update() {
    await supabase
      .from("transactions")
      .update({
        amount: Number(amount),
        description,
        date: dayjs(date).format("YYYY-MM-DD"),
      })
      .eq("id", id);

    router.back();
  }

  function remove() {
    Alert.alert("Delete transaction?", "This cannot be undone", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("transactions").delete().eq("id", id);
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* INPUT GROUP */}
      <View style={styles.formCard}>
        {/* AMOUNT */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputWrapper}>
            <CircleDollarSign
              size={20}
              color={COLORS.primary}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        {/* DATE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.dateText}>
              {dayjs(date).format("DD MMM YYYY")}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* DESCRIPTION */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputWrapper}>
            <FileText size={20} color={COLORS.primary} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* UPDATE BUTTON */}
      <TouchableOpacity style={styles.btn} onPress={update}>
        <Text style={styles.btnText}>Update Transaction</Text>
      </TouchableOpacity>

      {/* DELETE BUTTON */}
      <TouchableOpacity onPress={remove} style={styles.deleteBtn}>
        <Trash2 size={20} color={COLORS.danger} style={styles.deleteIcon} />
        <Text style={styles.deleteText}>Delete Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? SPACING.xxl : SPACING.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.l,
  },
  backBtn: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.m,
    marginTop: SPACING.l,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.m,
    paddingHorizontal: SPACING.m,
    height: 50,
    borderWidth: 1,
    borderColor: "transparent",
  },
  icon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    height: "100%",
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: RADIUS.round,
    alignItems: "center",
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: COLORS.surface,
    fontWeight: "600",
    fontSize: 16,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.m,
    marginTop: SPACING.s,
    gap: SPACING.xs,
  },
  deleteIcon: {
    opacity: 0.8,
  },
  deleteText: {
    color: COLORS.danger,
    fontWeight: "600",
    fontSize: 16,
  },
});
