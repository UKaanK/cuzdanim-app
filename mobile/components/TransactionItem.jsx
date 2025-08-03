import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { formatCurrency, formatDate } from "../lib/utils";

// Kategorileri ve onlara karşılık gelen ikonları eşleştir
const CATEGORY_ICONS = {
  "Yiyecek & İçecek": "fast-food",
  Alışveriş: "cart",
  Ulaşım: "car",
  Eğlence: "film",
  Faturalar: "receipt",
  Gelir: "cash",
  Diğer: "ellipsis-horizontal",
};

export const TransactionItem = ({ item, onDelete }) => {
  const isIncome = parseFloat(item.amount) > 0;
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons name={CATEGORY_ICONS[item.category]} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(Math.abs(item.amount))}
          </Text>
          <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};