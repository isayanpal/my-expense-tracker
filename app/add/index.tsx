import { CATEGORIES } from "@/src/constants/categories";
import { COLORS, RADIUS, SPACING } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  FileText,
  Layers,
} from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddTransaction() {
  const router = useRouter();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  async function save() {
    if (!amount) return;

    await supabase.from("transactions").insert({
      type,
      category: type === "expense" ? category : null,
      amount: Number(amount),
      description,
      date: dayjs(date).format("YYYY-MM-DD"),
    });

    setAmount("");
    setDescription("");
    setDate(new Date());
    setCategory(CATEGORIES[0]);
    setType("income");

    router.back();
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* SEGMENTED CONTROL FOR TYPE */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            type === "expense" && styles.segmentBtnActive,
          ]}
          onPress={() => setType("expense")}
        >
          <Text
            style={[
              styles.segmentText,
              type === "expense" && styles.segmentTextActive,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            type === "income" && styles.segmentBtnActive,
          ]}
          onPress={() => setType("income")}
        >
          <Text
            style={[
              styles.segmentText,
              type === "income" && styles.segmentTextActive,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
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

        {/* CATEGORY (Only for Expense) */}
        {type === "expense" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputWrapper}>
              <Layers size={20} color={COLORS.primary} style={styles.icon} />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={setCategory}
                  style={styles.picker}
                >
                  {CATEGORIES.map((c) => (
                    <Picker.Item
                      key={c}
                      label={c}
                      value={c}
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        )}

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

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.btn, !amount && { opacity: 0.5 }]}
        onPress={save}
        disabled={!amount}
      >
        <Text style={styles.btnText}>Save Transaction</Text>
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
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: SPACING.xs,
    borderRadius: RADIUS.l,
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: SPACING.s,
    alignItems: "center",
    borderRadius: RADIUS.m,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.surface,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.m,
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
  pickerContainer: {
    flex: 1,
    marginLeft: -8,
  },
  picker: {
    // Style adjustments for Android/iOS picker
  },
  pickerItem: {
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
});
