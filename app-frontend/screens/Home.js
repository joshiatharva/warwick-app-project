import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView, Divider, CardHeader} from '@ui-kitten/components';
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
      newq: [],
      status: "",
    }
  }

  async componentDidMount() {
    /**
     * Makes fetch() call to get user statistics
     */
    let token = await AsyncStorage.getItem("id");
    if (token != null) {
      try {
        let response = await fetch('http://192.168.0.12:3000/user/profile', {
          method: "GET",
          headers : {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        });
        /**
         * If successful, then store all scores in this.state
         * for the Progress Graph to render.
         */
        let res = await response.json();
        if (res.success === true) {
          console.log("rlscore: " + res.rg + " " + "cflscore: " + res.cfl + " " + "tmscore: " + res.tm);
          this.setState({user: res.user, rlscore: res.rg, cflscore: res.cfl, tmscore: res.tm});
          if (this.state.rlscore == null) {
            this.setState({rlscore: 0});
          }
          if (this.state.cflscore == null) {
            this.setState({cflscore: 0});
          }
          if (this.state.tmscore == null) {
            this.setState({tmscore: 0});
          }
          this.setState({status: "Success"});
        } else {
          /**
           * The token has expired - remove the token from Async Storage
           * and navigate back to the Login page.
           */
          this.setState({err: res.msg});
          if (res.msg == "Token expired") {
            this.setState({status: "Failed"}); 
            this.props.navigation.navigate("Login");
            alert("Unfortunately, your token has expired! Please sign in again.");
          }
        }
        /**
         * Server error has occurred
         */
      } catch (err) {
        alert("Unfortunately, the network could not be connected to");
      }
    } else {
      /**
       * No token exists - navigate back to Login
       */
      this.setState({err: "No token", status: "Failed"});
      this.props.navigation.navigate("Login");
    }
  }

    /**
     * Renders the UI - chartConfig is by default required
     * for the Progress Chart to be rendered.
     */
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
        <Text>Ready for a quiz?</Text>
      </View>
      <Text style={{textAlign: 'center', fontSize: 18, padding: 16, marginTop: 16}}>Your current success average is:</Text>
      <Card style={styles.statCard}>
        <ProgressChart
          data={data}
          width={Dimensions.get('window').width}
          height={200}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </Card>
      <Text status="control" category="h3">Questions:</Text>
      <View>
        <Divider />
        <Text category="h2">Recently Made Questions</Text>
        <Divider /> 
      </View>
      {this.state.newq.map((item) =>
        <Card header={<CardHeader><Text category="h4">{item.name}</Text></CardHeader>}>
          <Text> Made by: {item.created_by}</Text>
          <Text>Difficulty: {item.difficulty}</Text>
        </Card>
      )}

      <Text>Let's get started with quizzing:</Text>
      <Button title="Get Started!" onPress={() => this.props.navigation.navigate("Questions")} />
      
    </ScrollView>
    );
  }
}
