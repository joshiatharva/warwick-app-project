import React, { Component } from 'react';
import { StyleSheet, Text, View,  FlatList, AsyncStorage, Picker, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert } from 'react-native';

export default class Account extends Component {
    render() {
      return (
        <View>
          <Button title="Edit" />
          <Text>My details: </Text>
          <Text>Personal Information:</Text>
          <Text>Username: {this.state.username}</Text>
          <Text>First Name: {this.state.firstname}</Text>
          <Text>Last Name: {this.state.lastname}</Text>
          <Text></Text>
        </View>
      );
    }
  }