import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useCallback, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, monthlySummary, isLoading, loadData, deleteTransaction } = useTransactions(
    user.id
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = (id) => {
    Alert.alert("İşlem Sil", "Bu işlemi silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  if (isLoading && !refreshing) return <PageLoader />;

  const ListHeader = () => (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.headerLeft}>
         
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Merhaba,</Text>
            <Text style={styles.usernameText}>
              Umut Kaan
            </Text>
          </View>
        </View>
        {/* RIGHT */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Yeni İşlem</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>

      <BalanceCard summary={summary} monthlySummary={monthlySummary} />

      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.sectionTitle}>Son İşlemler</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.content}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}