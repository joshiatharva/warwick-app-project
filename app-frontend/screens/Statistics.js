import React, { Component } from 'react';
import { StyleSheet, View, FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal, YellowBox } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView } from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../style/styles';

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
      rldata: [0, 0, 0, 0, 0],
      ctldata: [0, 0, 0, 0, 0],
      tmdata: [0, 0, 0, 0, 0],
      rltotal: [0, 0, 0, 0, 0],
      ctltotal: [0, 0, 0, 0, 0],
      tmtotal: [0, 0, 0, 0, 0],
      array: [],
      type: '',
      topic: '',
      hasScore: false,
      status: '',
      statusHidden: true,
      historyHidden: true,
    }
  }

  /*********************************************************************************/
  /* Gets required data (score objects and user model) from /user/statistics/,
  /* them in state, and loading into the various components on render().
  /* 
  /*********************************************************************************/
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
      var history = res.user.question_history.slice(0, 10);
      var sessions = res.user.last_10_sessions_length.slice(0,10);
      this.setState({ user_scores: res.user_scores, questions_made: res.questions, question_history: history, sessions: sessions });
      this.state.user_scores.forEach(element => {
        if (element.topic == "Regular Languages") {
          console.log("case 1");
          array = [element.d1_correct, element.d2_correct, element.d3_correct, element.d4_correct, element.d5_correct];
          array2 = [element.d1_total, element.d2_total, element.d3_total, element.d4_total, element.d5_total];
          this.setState({ rldata: array, rltotal: array2 }, () => {
            console.log(this.state.rldata + " " + this.state.rltotal);
          });
        } else if (element.topic == "Context Free Languages") {
          console.log("case2");
          array = [element.d1_correct, element.d2_correct, element.d3_correct, element.d4_correct, element.d5_correct];
          array2 = [element.d1_total, element.d2_total, element.d3_total, element.d4_total, element.d5_total];
          this.setState({ ctldata: array, ctltotal: array2 }, () => {
            console.log(this.state.ctldata + " " + this.state.ctltotal);
          });
        } else {
          console.log("Case3");
          array = [element.d1_correct, element.d2_correct, element.d3_correct, element.d4_correct, element.d5_correct];
          array2 = [element.d1_total, element.d2_total, element.d3_total, element.d4_total, element.d5_total];
          this.setState({ tmdata: array, tmtotal: array2 }, () => { console.log(this.state.tmdata + " " + this.state.tmtotal) });
        }
      });
      var rtotal = 0;
      var ctotal = 0;
      var ttotal = 0;
      for (var i = 0; i < this.state.tmdata.length; i++) {
        rtotal += this.state.rldata[i];
        ctotal += this.state.ctldata[i];
        ttotal += this.state.tmdata[i];
      }
      console.log(rtotal + " " + ctotal + " " + ttotal);
      if (rtotal == 0 && ctotal == 0 && ttotal == 0) {
        this.setState({ hasScore: false });
      } else {
        this.setState({ hasScore: true });
      }

    } else {
      console.log("Error occured");
      this.setState({ status: "error" });
      if (res.msg == "Token expired") {
        /*************************************************/
        /* Logout occurred - navigate back to Login view */
        /*************************************************/
        await AsyncStorage.removeItem("id");
        this.props.navigation.navigate("Login");
        alert("Your token has expired. Please sign in again.");
      }
    }
  }

  /*************************************************/
  /* Helper method - gets questions answered,      */
  /* user sessions and questions made by the user  */
  /*************************************************/
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
      this.setState({ sessions: res.msg, questions_made: res.questions, question_history: res.history });
    }
  }

  /********************************************************************/
  /* Helper method - stores topic as text field from Select component */
  /********************************************************************/
  addTopic(item) {
    console.log(item.text);
    this.setState({ topic: item.text });
    console.log(this.state.topic);
  }

  render() {

    /********************************************************************/
    /* Chart configuration for loading options into BarChart component, */
    /* with labels for each sample of data and array for Select options */
    /********************************************************************/
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
      { text: "Regular Languages" },
      { text: "Context Free Languages" },
      { text: "Turing Machines" },
    ];
    /********************************************************************/
    /* Returns BarComponent containing d1 - d5 scores for each topic,   */
    /* as well as a dropdown for a full breakdown by Question topic     */
    /* plus question history and sessions (EXPERIMENTAL - NOT TESTED)   */
    /********************************************************************/
    return (
      <ScrollView>
        <Text>These are your statistics as follows:</Text>
        <Text>Marks over all questions:</Text>
        {this.state.hasScore && (
        <View style={{padding: 10}}>
          <Card style={styles.container}>
            <StackedBarChart
              data={data}
              width={WIDTH}
              height={400}
              chartConfig={chartConfig}
            />
          </Card>
        </View>
        )}
        {!this.state.hasScore && (
        <View>
          <Card style={styles.container}>
            <Text status="warning">The Bar Chart component will display once answers in ALL topics are correct!</Text>
          </Card>
        </View>
        )}
        <View style={{marginTop: 10}}></View>
        <View style={{padding: 10, marginTop: 10}}>
          <Select
            placeholder="Please pick question topic"
            data={topics}
            selectedOption={this.state.topic}
            onSelect={(item) => this.addTopic(item)}
          />
          {this.state.topic == "Regular Languages" && (
            /****************************************************************/
            /* Renders all scores (d1-d5)- Regular Lang - from this.state() */
            /****************************************************************/
            <View>
              <Text category="h6">Questions Correct:</Text>
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
            /****************************************************************/
            /* Renders all scores (d1 - d5)-CF Languages- from this.state() */
            /****************************************************************/
            <View>
              <Text category="h6">Questions Correct:</Text>
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
            /****************************************************************/
            /* Renders scores (d1 - d5) -Turing Machines- from this.state() */
            /****************************************************************/
            <View>
              <Text category="h6">Questions Correct:</Text>
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
        {/****************************************************************/
         /* Renders usage statistics and session history from User model */
         /****************************************************************/}
        <Text category="h1">Usage Statistics:</Text>
        <View style={{flexDirection:'row', flex: 1}}>
          <Text category="h5">Sessions:</Text>
          <Icon
          name={this.state.statusHidden? 'down' : 'up'}
          size={20}
          onPress={() => {
            this.setState({statusHidden: !this.state.statusHidden})
          }}
          style={{marginRight: 10}}
        />
        </View>
        {!this.state.statusHidden && (
         this.state.sessions.map((item) => (
              <Card>
                <Text>Signin:{item.signin}</Text>
                <Text>Signout:{item.signout}</Text>
              </Card>
            ))
        )}
        <View style={{flexDirection:'row', flex: 1}}>
          <Text category="h5">Questions you've made:</Text>
          <Icon
          name={this.state.historyHidden? 'down' : 'up'}
          size={20}
          onPress={() => {
            this.setState({historyHidden: !this.state.historyHidden})
          }}
          style={{marginRight: 10}}
        />
        </View>
        {!this.state.historyHidden && (
          this.state.question_history.map((item) => (
            <Card>
              <Text>{item.start_time}</Text>
              <Text>{item.qid}</Text>
              <Text>{item.correct}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    );
  }
}