import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../style/styles';

export default class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
    }
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
    this.setState({user: res.user}, function(err, success) {
      if (err) {
        console.log(err);
      } else {
        console.log("User: " + this.state.user);
      }
    });
  }

  render() {
    return (
      <View>
        <Text>Last session: </Text>
        <Text>Questions you've made:</Text>
        {/* <ScrollView>
          <FlatList></FlatList>
        </ScrollView> */}
        <Text>Question History:</Text>
        {/* <ListView /> */}
      </View>
    );
  }
}