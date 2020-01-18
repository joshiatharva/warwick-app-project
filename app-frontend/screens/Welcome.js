import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import Login from './components/Login';

export default class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="Login" onPress={() => this.props.navigation.navigate('Login')} />
        <Button title="Haven't got an account? Register here!" onPress={() => alert('Signup!')} />
      </View>
    );
  }
}

export const AppSwitchNavigator = createSwitchNavigator({
    Welcome: Welcome,
    Login: Login,
    Homepage: HomepageDrawerNavigator,
});