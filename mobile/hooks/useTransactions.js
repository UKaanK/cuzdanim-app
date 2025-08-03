// react custom hook file
import { useCallback, useState } from "react";
import {Alert} from 'react-native'

const API_URL = "https://wallet-api-4m20.onrender.com/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState({ income: 0, expenses: 0 });

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);

      // Calculate monthly summary
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let monthlyIncome = 0;
      let monthlyExpenses = 0;

      data.forEach((transaction) => {
        const transactionDate = new Date(transaction.created_at);
        if (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          if (transaction.amount > 0) {
            monthlyIncome += transaction.amount;
          } else {
            monthlyExpenses += transaction.amount;
          }
        }
      });

      setMonthlySummary({ income: monthlyIncome, expenses: monthlyExpenses });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // Refresh data after deletion
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, monthlySummary, isLoading, loadData, deleteTransaction };
};