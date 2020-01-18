import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome back!</Text>
      </View>
    );
  }
}

export const HomepageTabNavigator = createBottomTabNavigator({
    Home,
    Search,
    Questions,
    Local,
    Profile
    },{
    navigationOptions: ({ navigation }) => {
      const { pageName } = navigation.state.routes[navigation.state.index];
      return { headerTitle: pageName };
    }
});

export const HomepageStackNavigator = createStackNavigator({
    HomepageTabNavigator: HomepageTabNavigator,
    questionSwitchNavigator: questionSwitchNavigator
    
});
  
export const HomepageDrawerNavigator =  createDrawerNavigator({
    Homepage: {
      screen: HomepageStackNavigator
    }
});
