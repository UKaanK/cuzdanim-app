import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { formatCurrency } from "../lib/utils";


export const BalanceCard = ({ summary }) => {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Toplam Bakiye</Text>
      <Text style={[styles.balanceAmount]}>{formatCurrency(summary.balance)}</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Gelir</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income }, { fontSize: 14 }]}>
            +{formatCurrency(summary.income)}
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Gider</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense }, { fontSize: 14 }]}>
            -{formatCurrency(Math.abs(summary.expenses))}
          </Text>
        </View>
      </View>
    </View>
  );
};