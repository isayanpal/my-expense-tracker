import { COLORS, RADIUS, SPACING } from "@/src/constants/theme";
import { Search } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Search size={20} color={COLORS.textSecondary} />
      <TextInput
        placeholder="Search by category or type"
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s, // slightly tighter vertical padding for better centering
    borderRadius: RADIUS.round, // Pill shape
    marginVertical: SPACING.m,
    gap: SPACING.s,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    height: "100%", // Take full height of container
    padding: 0, // Reset default padding
  },
});
