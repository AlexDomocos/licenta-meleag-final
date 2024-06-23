import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect } from "react";
import Animated from "react-native-reanimated";
import { FadeInUp, FadeInDown } from "react-native-reanimated";
import { useSocket } from "../utils/socketContext";

const Home = ({ navigation }) => {
  return (
    <View className='flex-1 bg-white'>
      <ImageBackground
        source={require("../images/background.png")}
        className='flex-1 justify-center'
      >
        <View className='absolute w-full h-full inset-0 bg-black opacity-40' />
        <Animated.View
          entering={FadeInUp.delay(100)}
          className='items-center mt-20'
        >
          <Image
            source={require("../images/logo.png")}
            style={{ width: 300, height: 300 }}
            className='mt-20'
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(100)}
          className='items-center mt-10 px-5'
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Actions");
            }}
            className='bg-yellow-400 py-4 px-10 rounded-full'
          >
            <Text className='text-2xl text-gray-800 font-bold'>Start</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default Home;
