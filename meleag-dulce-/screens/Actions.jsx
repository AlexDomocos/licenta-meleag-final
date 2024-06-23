import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { InformationCircleIcon } from "react-native-heroicons/mini";
import Animated from "react-native-reanimated";
import { FadeInLeft, FadeInRight } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useSocket } from "../utils/socketContext";
import styles from "../styles/styles";
import Toast from "../components/Toast";
 
const Actions = ({ navigation }) => {
  const width = Dimensions.get("window").width;
  const image1 = require("../images/image1.png");
  const image2 = require("../images/image2.png");
  const image3 = require("../images/image3.png");
  const image4 = require("../images/image4.png");
  const image5 = require("../images/image5.png");
  const image6 = require("../images/image6.png");
  const [data, setData] = useState([]);
  const [soarelui, setSoarelui] = useState(false);
  const [salcam, setSalcam] = useState(false);
  const [autonom, setAutonom] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const imageData = [
    {
      id: 1,
      title: "Item 1",
      description: "Description for Item 1",
      imageUrl: image1,
    },
    {
      id: 2,
      title: "Item 2",
      description: "Description for Item 2",
      imageUrl: image2,
    },
    {
      id: 3,
      title: "Item 3",
      description: "Description for Item 3",
      imageUrl: image3,
    },
    {
      id: 4,
      title: "Item 4",
      description: "Description for Item 4",
      imageUrl: image4,
    },
    {
      id: 5,
      title: "Item 5",
      description: "Description for Item 5",
      imageUrl: image5,
    },
    {
      id: 6,
      title: "Item 6",
      description: "Description for Item 6",
      imageUrl: image6,
    },
  ];
  const socket = useSocket();
  const showToast = (message) => {
    setToast({ message: message, visible: true });
    setTimeout(() => {
      setToast({ visible: false });
    }, 1500); // Show toast for 3 seconds
  };
 
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("command_to_arduino", "READTEMP");
    socket.on("fromArduino", (newData) => {
      const messageData = newData.slice(0, -1);
 
      if (messageData === "Received STARTSALCAM command. Starting motor.") {
        showToast("Cules salcâm pornit!");
      } else if (
        messageData === "Received STOPSALCAM command. Stopping motor."
      ) {
        showToast("Cules salcâm oprit!");
      } else if (messageData === "Autonomous mode activated.") {
        showToast("Mod autonom activat!");
      } else if (
        messageData ===
        "Autonomous mode deactivated. Returning motor to original position."
      ) {
        showToast("Mod autonom dezactivat!");
      } else if (
        messageData === "Received STARTFLOAREASOARELUI command. Starting motor."
      ) {
        showToast("Cules floare pornit!");
      } else if (
        messageData === "Received STOPFLOAREASOARELUI command. Stopping motor."
      ) {
        showToast("Cules floare oprit!");
      } else {
        let infoData = newData.split(",");
        if (infoData.length === 4) {
          infoData[3] = infoData[3].slice(0, -1);
          setData(infoData);
        }
        if (infoData[2] < 12) {
          showToast("Temperatură scăzută!");
        }
        if (infoData[2] > 40) {
          showToast("Temperatură ridicată!");
        }
      }
    });
  }, []);
 
  const sendCommand = (command) => {
    socket.emit("command_to_arduino", command);
  };
 
  const onPressSalcam = () => {
    setSalcam(!salcam);
    if (salcam) {
      sendCommand("STOPSALCAM");
    } else {
      sendCommand("STARTSALCAM");
    }
  };
 
  const onPressAutonom = () => {
    setAutonom(!autonom);
    if (autonom) {
      sendCommand("STOPAUTONOMOUS");
    } else {
      sendCommand("STARTAUTONOMOUS");
    }
  };
 
  const onPressSoarelui = () => {
    setSoarelui(!soarelui);
    if (soarelui) {
      sendCommand("STOPFLOAREASOARELUI");
      showToast();
    } else {
      sendCommand("STARTFLOAREASOARELUI");
    }
  };
 
  return (
    <SafeAreaView className='h-full'>
      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={() => setToast({ visible: false })}
      />
 
      <Animated.View className='flex flex-row mt-5 pl-3 mb-5 '>
        <InformationCircleIcon color={"#ffc600"} size={36} className='' />
        <Text className=' text-meleagGray font-semibold text-4xl ml-2'>
          Panou control
        </Text>
      </Animated.View>
      <View style={styles.shadow} className='w-full p-2 pb-0 '>
        <View className='bg-meleagYellow rounded-md p-5'>
          <Text className='text-white text-xl font-bold text-center'>
            Temperatură(°C) & Umiditate(%)
          </Text>
        </View>
      </View>
      <Animated.View className='flex flex-row'>
        <Animated.View
          style={styles.shadow}
          entering={FadeInLeft.delay(300)}
          className=' p-2 h-full w-1/2'
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("IndoorTable");
            }}
          >
            <View className='bg-meleagYellow p-5 rounded-xl'>
              <Text className='text-white text-lg font-bold'> Interior </Text>
              <View className='mt-3'>
                <Text className='text-white text-2xl font-bold ml-2 mb-3'>
                  {data[0]} °C
                </Text>
                <Text className='text-white text-2xl font-bold ml-2'>
                  {data[1]} %
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={styles.shadow}
          entering={FadeInRight.delay(300)}
          className=' p-2 h-full w-1/2'
        >
          <TouchableOpacity onPress={() => navigation.navigate("OutdoorTable")}>
            <View className='bg-meleagYellow p-5 rounded-xl'>
              <Text className='text-white text-lg font-bold'> Exterior </Text>
              <View className='mt-3'>
                <Text className='text-white text-2xl font-bold ml-2 mb-3'>
                  {data[2]} °C
                </Text>
                <Text className='text-white text-2xl font-bold ml-2'>
                  {data[3]} %
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <Animated.View
        entering={FadeInLeft.delay(300)}
        className='bg-meleagGray p-3 pt-5 pb-5 mt-2 rounded-xl flex flex-row w-96 mx-auto'
      >
        <View className='w-1/2 flex mx-auto'>
          <TouchableOpacity
            style={styles.shadow}
            disabled={soarelui || autonom}
            onPress={() => onPressSalcam()}
            className={`${salcam ? "bg-meleagYellow" : "bg-white"} ${
              soarelui || autonom ? "opacity-25" : "opacity-100"
            } p-5 flex rounded-md mr-2`}
          >
            <Text
              className={`mx-auto ${salcam ? "text-white" : "text-meleagGray"}`}
            >
              Cules Salcam
            </Text>
          </TouchableOpacity>
        </View>
        <View className='w-1/2'>
          <TouchableOpacity
            style={styles.shadow}
            onPress={() => onPressSoarelui()}
            disabled={salcam || autonom}
            className={`${soarelui ? "bg-meleagYellow" : "bg-white"} ${
              salcam || autonom ? "opacity-25" : "opacity-100"
            } p-5 flex rounded-md mr-2`}
          >
            <Text
              className={`mx-auto ${
                soarelui ? "text-white" : "text-meleagGray"
              }`}
            >
              Cules Floare
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeInRight.delay(300)}
        style={styles.shadow}
        className={`${autonom ? "bg-meleagGray" : "bg-meleagYellow"} 
        ${
          salcam || soarelui ? "opacity-25" : "opacity-100"
        } w-96  mx-auto mt-4 p-2 rounded-xl`}
      >
        <TouchableOpacity
          onPress={() => onPressAutonom()}
          disabled={soarelui || salcam}
          className={`${
            autonom ? "bg-meleagYellow" : "bg-white"
          }  p-5 flex rounded-md `}
        >
          <Text
            className={`mx-auto ${
              autonom ? "text-white" : "text-meleagGray"
            } text-center text-4xl font-semibold`}
          >
            Cules Autonom
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View className='mt-4' style={styles.shadow}>
        <Carousel
          loop
          width={width}
          height={width / 2}
          autoPlay={true}
          data={imageData}
          scrollAnimationDuration={1000}
          autoPlayInterval={5000}
          renderItem={({ item }) => (
            <View
              className='rounded-md'
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Image
                source={item.imageUrl}
                style={{ width: "97%", height: "100%" }}
                resizeMode='cover'
                className='rounded-xl mx-auto'
              />
            </View>
          )}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
 
export default Actions;