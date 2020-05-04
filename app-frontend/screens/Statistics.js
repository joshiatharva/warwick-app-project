import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal, YellowBox } from 'react-native';
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

import Accordion from './Accordion';

const WIDTH = Dimensions.get('window').width; 

export default class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_scores: [],
      q_history: [],
      questions_made: [],
      question_history: [],
      sessions: [],
      rldata: [],
      ctldata: [],
      tmdata: [],
      rltotal: [],
      ctltotal: [],
      tmtotal: [],
      array: [],
      type: '',
      topic: '',
      status: ''
    }
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.12:3000/user/statistics", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();

    if (res.success == true) {
      this.setState({user_scores: res.user_scores, questions_made: res.questions, q_history: res.user.question_history, sessions: res.user.last_10_sessions_length});
      this.state.user_scores.forEach(element => {
        if (element.topic == "Regular Languages") {
          console.log("case 1");
          array = [element.d1_correct, element.d2_correct, element.d3_correct, element.d4_correct, element.d5_correct];
          array2 = [element.d1_total, element.d2_total, element.d3_total, element.d4_total, element.d5_total];
          this.setState({rldata: array, rltotal: array2});
          console.log(this.state.rldata);
        } else if (element.topic == "Context Free Languages") {
          console.log("case2");
          array = [element.d1_correct, element.d2_correct, element.d3_correct, element.d4_correct, element.d5_correct];
          array2 = [element.d1_total, element.d2_total, element.d3_total, element.d4_total, element.d5_total];
          this.setState({ctldata: array, ctltotal: array2});
          console.log(this.state.ctldata);
        } else {
          console.log("Case3");
          array = [element.d1_correct, element.d2_correct, element.d3_correct, element.d4_correct, element.d5_correct];
          array2 = [element.d1_total, element.d2_total, element.d3_total, element.d4_total, element.d5_total];
          this.setState({tmdata: array, tmtotal: array2});
        } 
      });
      // let response2 = await fetch("http://192.168.0.12:3000/user/statistics", {
      //   method: "GET",
      //   headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      //   "Authorization": "Bearer " + token
      //   }
      // });
      // let res2 = await response2.json();
      // if (res2.success == true) {
      //   this.setState({sessions: res2.msg, questions_made: res2.questions, question_history: res2.history});
      // }
    } else {
      console.log("Error occured");
      this.setState({status: "error"});
      if (res.msg=="Token expired") {
        //logout
      }
    }
  }

  async getUserHistory() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.12:3000/user/statistics", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    if (res.success == true) {
      this.setState({sessions: res.msg, questions_made: res.questions, question_history: res.history});
  }

  addTopic(item) {
    console.log(item.text);
    this.setState({topic: item.text});
    console.log(this.state.topic);
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
    const topics = [
      {text: "Regular Languages"},
      {text: "Context Free Languages"},
      {text: "Turing Machines"},
    ];

    return (
      <ScrollView>
        <Text>These are your statistics as follows:</Text>
        <Text>Marks over all questions:</Text>
        <Card style={styles.container}>
          <StackedBarChart 
            data={data}
            width={WIDTH}
            height={400}
            chartConfig={chartConfig}
          />
        </Card>
        <View>
          <Select 
            placeholder="Please pick question topic"
            data={topics}
            selectedOption={this.state.topic}
            onSelect={(item) => this.addTopic(item)}
          />
          {this.state.topic == "Regular Languages" && (
            <View>
              <Text category="h2" status="danger" >Questions Correct:</Text>
                  <Text>Difficulty 1: {this.state.rldata[0]}</Text>
                  <Text>Difficulty 2: {this.state.rldata[1]}</Text>
                  <Text>Difficulty 3: {this.state.rldata[2]}</Text>
                  <Text>Difficulty 4: {this.state.rldata[3]}</Text>
                  <Text>Difficulty 5: {this.state.rldata[4]}</Text>
              <Text>Questions Answered:</Text>
                  <Text>Difficulty 1: {this.state.rltotal[0]}</Text>
                  <Text>Difficulty 2: {this.state.rltotal[1]}</Text>
                  <Text>Difficulty 3: {this.state.rltotal[2]}</Text>
                  <Text>Difficulty 4: {this.state.rltotal[3]}</Text>
                  <Text>Difficulty 5: {this.state.rltotal[4]}</Text>
            </View>
          )}
          {this.state.topic == "Context Free Languages" && (
            <View>
              <Text>Questions Correct:</Text>
                  <Text>Difficulty 1: {this.state.ctldata[0]}</Text>
                  <Text>Difficulty 2: {this.state.ctldata[1]}</Text>
                  <Text>Difficulty 3: {this.state.ctldata[2]}</Text>
                  <Text>Difficulty 4: {this.state.ctldata[3]}</Text>
                  <Text>Difficulty 5: {this.state.ctldata[4]}</Text>
              <Text>Questions Answered:</Text>
                  <Text>Difficulty 1: {this.state.ctltotal[0]}</Text>
                  <Text>Difficulty 2: {this.state.ctltotal[1]}</Text>
                  <Text>Difficulty 3: {this.state.ctltotal[2]}</Text>
                  <Text>Difficulty 4: {this.state.ctltotal[3]}</Text>
                  <Text>Difficulty 5: {this.state.ctltotal[4]}</Text>
            </View>
          )}
          {this.state.topic == "Turing Machines" && (
            <View>
              <Text>Questions Correct:</Text>
                  <Text>Difficulty 1: {this.state.tmdata[0]}</Text>
                  <Text>Difficulty 2: {this.state.tmdata[1]}</Text>
                  <Text>Difficulty 3: {this.state.tmdata[2]}</Text>
                  <Text>Difficulty 4: {this.state.tmdata[3]}</Text>
                  <Text>Difficulty 5: {this.state.tmdata[4]}</Text>
              <Text>Questions Answered:</Text>
                  <Text>Difficulty 1: {this.state.tmtotal[0]}</Text>
                  <Text>Difficulty 2: {this.state.tmtotal[1]}</Text>
                  <Text>Difficulty 3: {this.state.tmtotal[2]}</Text>
                  <Text>Difficulty 4: {this.state.tmtotal[3]}</Text>
                  <Text>Difficulty 5: {this.state.tmtotal[4]}</Text>
            </View>
          )}
        </View>

        <Text>Usage Statistics:</Text>
        <Text>Sessions:</Text>
            {this.state.sessions.map(({item}) => (
              <View>
                <Text>{item.start}</Text>
                <Text>{item.end}</Text>
              </View>
            ))}
        <Text>Questions you've made:</Text>
        {this.state.questions_made.map(({item}) => (
              <View>
                <Text>{item.start}</Text>
                <Text>{item.end}</Text>
              </View>
            ))}
        {/* <FlatList
          data={this.state.questions_made}
          renderItem = {({item}) =>
            <Accordion
              question={item}
            />
          }
          keyExtractor={(item, index) => index.toString()}
        /> */}
        <Text>Question History:</Text>
        {this.state.question_history.map(({item}) => (
              <View>
                <Text>{item.start}</Text>
                <Text>{item.end}</Text>
              </View>
        ))}
      </ScrollView>
    );
  }
}