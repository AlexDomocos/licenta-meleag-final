import Home from "./screens/Home";
import Actions from "./screens/Actions";
import IndoorData from "./screens/IndoorData";
import IndoorTable from "./screens/IndoorTable";
import OutdoorTable from "./screens/OutdoorTable";
import OutdoorData from "./screens/OutdoorData";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SocketProvider } from "./utils/socketContext";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName='Home' // Set the initial route to "Home"
        >
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Actions' component={Actions} />
          <Stack.Screen name='IndoorTable' component={IndoorTable} />
          <Stack.Screen name='IndoorData' component={IndoorData} />
          <Stack.Screen name='OutdoorTable' component={OutdoorTable} />
          <Stack.Screen name='OutdoorData' component={OutdoorData} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
}
