import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

export default class DataUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
      question_id: null,
      correct: false
    }
  }

  componentDidMount(){
    let id = AsyncStorage.getItem("id");
    return fetch("localhost:3000/api/recordResult", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer' + id,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({this.state});
    }).catch((err) => console.log(err)).done();
  }
  render() {
    return (
      <View>
        <ActivityIndicator size="large" color="0000ff" />
        <Text style={styles.loading}>This will just be a minute.</Text>
      </View>
    );
  }
}