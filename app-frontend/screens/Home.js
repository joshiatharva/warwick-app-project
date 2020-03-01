import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView } from 'react-native';
import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Avatar, Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import { Linking } from 'expo';
// import Canvas from 'react-native-canvas';
// import SlidingUpPanel from 'rn-sliding-up-panel';
// import MathJax from 'react-native-mathjax';
import { ApplicationProvider, Select, Text, Card, Datepicker, Input, Layout, TopNavigation, TabView} from '@ui-kitten/components';
//import * as UI from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit"


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      scores: [],
      err: '',
      admin: false,
      // adminStats: [],
    }
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch('http://172.31.199.57:3000/user/profile', {
      method: "GET",
      headers : {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    if (res.success === true) {
      this.setState({user: res.user});
      if (res.admin) {
        console.log(res.admin);
        this.setState({admin: true});
        // this.getAdminData();
      }
    } else {
      this.setState({err: res.message});
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again.");
      }
    }
  }

  render() {
    const chartConfig = {
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#FFFFFF",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(106,13,173, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5
    };
    const data={
      labels: ["RL's", "CFL's", "TM's"],
      data: [(4/7), (2/6), (1/3)],
    };
    return (
    // <DFADrawingComponent />
    <ScrollView>
      <View style={styles.headerContainer}>
        <Text>Welcome back,</Text>
        <Text category="h2">{this.state.user.firstname}!</Text> 
      </View>
      {!this.state.admin && (
      <View>
        <Text style={{textAlign: 'center', fontSize: 18, padding: 16, marginTop: 16}}>Your current success average is:</Text>
        <ProgressChart
          data={data}
          width={WIDTH}
          height={220}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View>
      )}
      {this.state.admin && (
        <View>

        </View>
      )}
      <Text>Let's get started with quizzing:</Text>
      <Button title="Get Started!" onPress={() => this.props.navigation.navigate("Questions")} />
      
    </ScrollView>
    );
  }
}

