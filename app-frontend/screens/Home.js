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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      scores: [],
      err: '',
      admin: false,
      rlscore: 0,
      cflscore: 0,
      tmscore: 0,
    }
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem("id");
    if (token != null) {
      let response = await fetch('http://192.168.0.12:3000/user/profile', {
        method: "GET",
        headers : {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      let res = await response.json();
      if (res.success === true) {
        this.setState({user: res.user, rlscore: res.rlscore, cflscore: res.cflscore, tmscore: res.tmscore});
        if (this.state.rlscore === null) {
          this.setState({rlscore: 0});
        }
        if (this.state.cflscore === null) {
          this.setState({cflscore: 0});
        }
        if (this.state.tmscore === null) {
          this.setState({tmscore: 0});
        }
      } else {
        this.setState({err: res.message});
        if (res.msg == "Token expired") {
          this.props.navigation.navigate("Login");
          alert("Unfortunately, your token has expired! Please sign in again.");
        }
      }
    }
  }

  // async getData() {
  //   let token = await AsyncStorage.getItem("id");
  //   let response = await fetch('http://192.168.0.16:3000/user/today', {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token,
  //     }
  //   })
  // }

  render() {
    const chartConfig = {
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#FFFFFF",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(0,181,204, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5
    };
    const data={
      labels: ["RL's", "CFL's", "TM's"],
      data: [this.state.rlscore, this.state.cflscore, this.state.tmscore],
    };
    return (
    // <DFADrawingComponent />
    <ScrollView>
      <View style={styles.headerContainer}>
        <Text>Welcome back,</Text>
        <Text category="h2">{this.state.user.firstname}!</Text> 
      </View>
      <Text style={{textAlign: 'center', fontSize: 18, padding: 16, marginTop: 16}}>Your current success average is:</Text>
      <ProgressChart
          data={data}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={chartConfig}
          hideLegend={false}
      />
      <Text status="control" category="h3">Questions:</Text>
      <Text>{this.state.questions_made_today} questions have been made today.</Text>
      <Text>Let's get started with quizzing:</Text>
      <Button title="Get Started!" onPress={() => this.props.navigation.navigate("Questions")} />
      
    </ScrollView>
    );
  }
}
