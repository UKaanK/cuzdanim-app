import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";
import { API_URL } from "../../constants/api";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { id: "food", name: "Yiyecek & İçecek", icon: "fast-food" },
  { id: "shopping", name: "Alışveriş", icon: "cart" },
  { id: "transportation", name: "Ulaşım", icon: "car" },
  { id: "entertainment", name: "Eğlence", icon: "film" },
  { id: "bills", name: "Faturalar", icon: "receipt" },
  { id: "income", name: "Gelir", icon: "cash" },
  { id: "other", name: "Diğer", icon: "ellipsis-horizontal" },
];

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle category selection when switching between income and expense.
  useEffect(() => {
    // If switching to income, automatically select the 'Gelir' category.
    if (!isExpense) {
      setSelectedCategory("Gelir");
    } else {
      // If switching to expense, clear any previous selection.
      setSelectedCategory("");
    }
  }, [isExpense]);

  const formatAmount = (text) => {
    // 1. Sanitize the input: allow only digits and a single comma.
    const sanitizedText = text.replace(/[^0-9,]/g, "");
    const parts = sanitizedText.split(",");

    // 2. Validate format: ensure at most one comma and two decimal places.
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
      return; // Exit if input is invalid
    }

    // 3. Set the raw value for calculations (e.g., "150000.50")
    const integerPart = parts[0] || "";
    const decimalPart = parts[1];
    const rawValue = integerPart + (decimalPart !== undefined ? `.${decimalPart}` : "");
    setAmount(rawValue);

    // 4. Format the integer part with thousand separators for display
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // 5. Reconstruct the display string (e.g., "150.000,50")
    const newDisplayAmount =
      decimalPart !== undefined
        ? `${formattedInteger},${decimalPart}`
        : formattedInteger;

    setDisplayAmount(newDisplayAmount);
  };

  const handleCreate = async () => {
    // validations
    if (!title.trim()) return Alert.alert("Hata", "Lütfen bir işlem başlığı girin");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Hata", "Lütfen geçerli bir tutar girin");
      return;
    }
    if (!selectedCategory) return Alert.alert("Hata", "Lütfen bir kategori seçin");

    setIsLoading(true);
    try {
      // Format the amount (negative for expenses, positive for income)
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id.toString(),
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error || "İşlem oluşturulamadı");
      }

      Alert.alert("Başarılı", "İşlem başarıyla oluşturuldu");
      router.back();
    } catch (error) {
      Alert.alert("Hata", error.message || "İşlem oluşturulamadı");
      console.error("Error creating transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni İşlem</Text>
        <TouchableOpacity
          style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>{isLoading ? "Kaydediliyor..." : "Kaydet"}</Text>
          {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.typeSelector}>
          {/* EXPENSE SELECTOR */}
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name="arrow-down-circle"
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>
              Gider
            </Text>
          </TouchableOpacity>

          {/* INCOME SELECTOR */}
          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
              Gelir
            </Text>
          </TouchableOpacity>
        </View>

        {/* AMOUNT CONTAINER */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₺</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0,00"
            placeholderTextColor={COLORS.textLight}
            value={displayAmount}
            onChangeText={formatAmount}
            keyboardType="decimal-pad"
          />
        </View>

        {/* INPUT CONTAINER */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="İşlem Başlığı"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* TITLE */}
        <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Kategori
        </Text>

        <View style={styles.categoryGrid}>
          {CATEGORIES.filter((c) => (isExpense ? c.id !== "income" : c.id === "income")).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.name && styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};
export default CreateScreen;