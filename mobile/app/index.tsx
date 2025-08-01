import { Link } from "expo-router";
import { Image } from "expo-image";
import { Text, View ,StyleSheet} from "react-native";

export default function Index() {
  return (
    //
    <View
      style={styles.container}
    >
      <Text style={styles.heading}>BARAN POLAT</Text>
      <Link href={"/about"}>About Us</Link>
      <View> 
        <Text> Hello</Text>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({

  container:{
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor:"purple"
  },
  heading:{
    fontSize:40,
    color:"blue"
  }
})