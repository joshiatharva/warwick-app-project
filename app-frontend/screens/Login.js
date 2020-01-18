import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import Search from './components/Search';
import Questions from './components/Questions';
import Local from './components/Local';
import Profile from './components/Profile';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  sendData = () => {
    const data = this.state;
    fetch('localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success === true) {
        const id_token = res.id_token;
        AsyncStorage.setItem('id', id_token);
        this.props.navigator.navigate('Home');
      } else {
        alert(res.message);
      }
    }).catch((err) => alert(err));
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput placeholder='Username' value="username" onChangeText={(username) => this.setState(username)} />
        <TextInput placeholder='Password' value="password" secureTextEntry={true} onChangeText={(password) => this.setState(password)} />
        <Button 
          title="Signin" 
          onPress={this.sendData.bind(this)}
          // onPress={this.props.navigation.navigate("Home")}
        />
      </View>
    );
  }
}

const HomepageTabNavigator = createBottomTabNavigator({
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
  