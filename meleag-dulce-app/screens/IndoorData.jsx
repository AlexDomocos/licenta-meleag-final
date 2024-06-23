import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useSocket } from "../utils/socketContext";
import styles from "../styles/styles";

const IndoorTable = () => {
  const router = useRoute();
  const { date } = router.params;
  const [data, setData] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("requestIndoorDataFromDates", { date });

    socket.once("responseData", (data) => {
      setData(data);
    });
  }, []);

  function extractLocalTime(isoDateString) {
    const date = new Date(isoDateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  return (
    <SafeAreaView>
      <ScrollView className='p-2 mt-3 h-full '>
        <View
          className='bg-meleagYellow p-5 rounded-xl mb-3'
          style={styles.shadow}
        >
          <Text className='text-white text-xl font-bold text-center'>
            Temp | Umid | Ora
          </Text>
        </View>
        {data.map((item, index) => (
          <View
            key={index}
            className={`text-center bg-meleagYellow p-5 rounded-xl mt-3 ${
              index % 2 === 0 ? "bg-meleagGray" : ""
            }`}
          >
            <Text className='text-white text-lg font-bold text-center'>
              {item.temperature}°C | {item.humidity}% |{" "}
              {extractLocalTime(item.measuredAt)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default IndoorTable;
