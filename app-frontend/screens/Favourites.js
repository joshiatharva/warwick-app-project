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


export default class Favourites extends Component { 
  constructor() {
    super();
    this.interval = null;
    this.state = {
      questions: [],
      error: null,
      isLoading: true,
      page: "",
    }
  }
  
  async componentDidMount() {
    this._getFavourites();
  }

  async _getFavourites() {
    try {
      const token = await AsyncStorage.getItem("id");
      const response = await fetch('http://192.168.0.12:3000/user/questions', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      const json = await response.json();
      this.setState({questions: json, isLoading: false});
      //console.log("Success on getting questions");
    } catch (err) {
      this.setState({error: err}, () => console.log("Error: " + this.state.error));
    }
  }

  async _handleRefresh() {
    this.setState({isLoading: true});
    this._getFavourites();
    this.setState({isLoading: false});
  }

  async _fetchLog(item) {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/log', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          id: item._id,
        })
      });
      let res = await response.json();
      return res;
  }
  
  async _sendData(item) {
    try {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/log', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          id: item._id,
        })
      });
      let res = await response.json();
      if (res.success == true) {
        console.log("yeet");
        this.setState({page: "Quiz"})
        this.props.navigation.navigate("Quiz", {Question: item});
      } else {
        return false; 
      }
    } catch (err) {
      console.log(err);
      alert("Connection lost - please try again.");
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <FlatList 
              refreshControl={<RefreshControl 
              refreshing={this.state.isLoading}
              onRefresh={() => this._handleRefresh()}/>}
              data={this.state.questions}
              renderItem = {({item, index}) => (
                  <Card style={styles.cardContainer} onPress={() => this._sendData(item)}>
                    <Text>{item.name}</Text>
                    <Text>Topic: {item.topic}</Text>
                    <Text>Difficulty: {item.difficulty}</Text>
                  </Card>
              )}
              keyExtractor={(item, index) => index.toString()}
          />
        </View>
    );
  }
}