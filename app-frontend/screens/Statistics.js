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

export default class Statistics extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user_scores: [],
        q_history: [],
        sessions: [],
        questions_made: [],
        rldata: [],
        ctldata: [],
        tmdata: [],
      }
    }
  
    async componentDidMount() {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch("http://172.31.199.57:3000/user/statistics", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      let res = await response.json();
      var array = [];
      if (res.success == true) {
        this.setState({user_scores: res.user_scores, q_history: res.user.question_history, sessions: res.user.last_10_sessions_length});
        for (var i = 0; i < this.state.user_scores.length; i++) {
          console.log(this.state.user_scores[i].topic);
          if (this.state.user_scores[i].topic == "Regular Languages") {
            array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
            this.setState({rldata: array});
          } else if (res.user_scores[i].topic == "Context Free Languages") {
            array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
            this.setState({ctldata: array});
          } else if (res.user_scores[i].topic == "Turing Machines") {
            array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
            this.setState({tmdata: array});
          }
        }
      } else {
        console.log("Error occured");
      }
    }
    render() {
      const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`
      };
      const data = {
        labels: ["RL", "CFL", "TM"],
        legend: ["D1", "D2"],
        data: [this.state.rldata, this.state.ctldata, this.state.tmdata],
        barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
      };
      return (
        <ScrollView>
          <Text>These are your statistics as follows:</Text>
          <Text>Marks over all questions:</Text>
          <StackedBarChart 
            data={data}
            width={WIDTH}
            height={400}
            chartConfig={chartConfig}
          />
          <Text>Usage Statistics: </Text>
          <Text>Record of sessions:</Text>
          <ContributionGraph
            values={this.state.sessions}
            endDate={new Date()}
            numDays={50}
            chartConfig={chartConfig}
          />
          <Text>Last sessions:</Text>
          <Text>Questions you've made:</Text>
          <FlatList
            data={this.state.questions_made}
            renderItem = {({item, index}) =>
              <Accordion
                question={item}
              />
            }
            keyExtractor={(item, index) => index.toString()}
          />
          <ScrollView></ScrollView>
          <Text>Question History:</Text>
          <Text>Average time spent on questions:</Text>
        </ScrollView>
      );
    }
  }