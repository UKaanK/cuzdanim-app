import { useClerk } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
    </TouchableOpacity>
  );
};