import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LogoScreen from "./screens/LogoScreen";
import ForgotPasswordScreen from "./screens/FogotPassword";
import PlayScreen from "./screens/PlayScreen";
import SongItem from "./screens/ListSong";
import ArtistDetailScreen from "./screens/ArtistDetailScreen";
import AlbumDetailScreen from "./screens/AlbumDetail";
import ListArtistScreen from "./screens/ListArtist";
import ListSongPlaylistScreen from "./screens/ListSongPlaylist";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import ListAlbum from "./screens/ListAlbum";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogoScreen">
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LogoScreen" component={LogoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListSong" component={SongItem} options={{ headerShown: false }} />
        <Stack.Screen name="ListArtist" component={ListArtistScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListAlbum" component={ListAlbum} options={{ headerShown: false }} />
        <Stack.Screen name="PlayScreen" component={PlayScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListSongPlaylist" component={ListSongPlaylistScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
