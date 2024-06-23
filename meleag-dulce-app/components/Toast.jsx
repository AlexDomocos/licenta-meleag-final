import React, { useEffect, useCallback } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

const Toast = ({ message, visible, onDismiss }) => {
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      });
    } else {
      translateY.value = withTiming(-500, {
        duration: 500,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleAnimationEnd = useCallback(() => {
    if (!visible) {
      onDismiss();
    }
  }, [visible, onDismiss]);

  return (
    <Animated.View
      style={[animatedStyle]}
      className='border-[0.5px] border-meleagGray absolute top-14 left-5 right-5 bg-meleagYellow text-white p-4 rounded-lg z-50'
      onAnimationEnd={handleAnimationEnd}
    >
      <Text className='text-white text-lg'>{message}</Text>
    </Animated.View>
  );
};

export default Toast;
