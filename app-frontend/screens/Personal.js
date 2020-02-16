import React, { Component } from 'react';
import { StyleSheet, Text, View,  FlatList, AsyncStorage, Picker, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert } from 'react-native';

export default class Personal extends Component {
    constructor(props) {
      super(props);
    }
  
    async componentDidMount() {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch("http://192.168.0.12:3000/user/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      let res = await response.json();
  
    }
  
    render() {
      return (
        <View>
          <Text>Data Preferences</Text>
        </View>
      );
    }
}