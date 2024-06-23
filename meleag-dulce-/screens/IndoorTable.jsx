import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSocket } from "../utils/socketContext";
import styles from "../styles/styles";

const IndoorTable = ({ navigation }) => {
  const [dates, setDates] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("requestIndoorDates");

    socket.once("responseData", (data) => {
      setDates(data);
    });
  }, []);

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className='p-2 mt-3'>
        <View
          className='bg-meleagYellow p-5 rounded-xl mb-3 '
          style={styles.shadow}
        >
          <Text className='text-white text-2xl font-bold'>
            Tabel date colectate
          </Text>
        </View>
        {dates.map((item, index) => (
          <View
            key={index}
            className={`p-5 rounded-xl mt-3 ${
              index % 2 === 0 ? "bg-meleagGray" : "bg-meleagYellow"
            }`}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("IndoorData", { date: item })}
            >
              <Text className='text-white text-center text-lg font-bold'>
                {item}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndoorTable;
