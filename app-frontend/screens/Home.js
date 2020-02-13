import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import MathFormulaeComponent from ''

export default class Home extends Component {
  render() {
    return (
        // <WebView
        //   originWhitelist={['*']}
        //   source={test}
        //   javaScriptEnabled={true}
        // />
        <View>
          <Text>Math component here</Text>
          <MathFormulaeComponent />
        </View>
    );
  }
}

export const HomepageTabNavigator = createBottomTabNavigator({
  Home,
  questionSwitchNavigator,
  Favourites,
  profileNavigator
});
