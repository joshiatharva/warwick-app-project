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

import AnswerScheme from './AnswerScheme';

export default class DataUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      correct: false,
      answer: "",
      isSending: true
    }
  }

  async componentDidMount() { 
    // console.log("chosenAnswer" + this.props.navigation.getParam("chosenAnswer"));
    // console.log(this.props.navigation.getParam("Question"));
    // console.log(this.props.navigation.getParam("Question").options[0] + "This is the answer");
    this.setState({
      question: this.props.navigation.getParam("Question"),
      correct: this.props.navigation.getParam("correct"),
      answer: this.props.navigation.getParam("chosenAnswer")
    });
    // const setParamsAction = NavigationActions.setParams({
    //   params: {hideTabBar: true},
    //   key: 'tab-name'
    // });
    // this.props.navigation.dispatch(setParamsAction);
    // console.log("isSending: " + this.state.isSending);
    // console.log("id: " + this.state.question._id);
    let token = await AsyncStorage.getItem("id");
    try {
      let response = await fetch('http://192.168.0.12:3000/questions/marks', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          question_id: this.state.question._id,
          correct: this.state.correct,
          answer: this.state.answer
        }),
      });
      let res = await response.json();
      if (res.success === true) {
        this.setState({isSending: false}); 
      } else {
        var object = {
          question_id: this.state.question_id,
          correct: this.state.correct, 
          answer: this.state.answer
        };
        await AsyncStorage.setItem("question_conn_fail", object);
        this.props.navigation.navigate("Questions");
        alert("There seemed to be an error with sending your scores. Please try again later.");
      }
    } catch (err) {
      console.log(err);
      var object = {
        question_id: this.state.question_id,
        correct: this.state.correct, 
        answer: this.state.answer
      };
      await AsyncStorage.setItem("question", object);
    }
  }

  selectedStyle(value) {
    const styles = {};
    if (value == this.state.answer) {
      styles.borderColor = 'blue';
      styles.borderWidth = 0.5; 
      if (value != this.state.question.answer) {
        styles.backgroundColor = 'red';
      }
    }
    if (value == this.state.question.answer) {
      styles.backgroundColor = 'green';
    }
    return styles;
  }

  render() {
    if (this.state.question.type === "true_false") {
      return (
        <View style={styles.container}>
          <Text>{this.state.question.question}</Text>
          <Button title="True" disabled disabledStyle={this.selectedStyle("true")} />
          <Button title="False" disabled disabledStyle={this.selectedStyle("false")} />
          <AnswerScheme isAnswered={true} answer={this.state.question.answer} answerScheme={this.state.question.solution} correct={this.state.correct} givenAnswer={this.state.answer} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
                <Text>Just wait, your result is being sent!</Text>
            </View>
            :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </View>
      );
    } else if (this.state.question.type === "multi_choice") {
      return (
        <View style={styles.container}>
          <Text> {this.state.question.question}</Text>
          <Button title={this.state.question.options[0]} value="A" disabled disabledStyle={this.selectedStyle(this.state.question.options[0])} />
          <Button title={this.state.question.options[1]} value="B" disabled disabledStyle={this.selectedStyle(this.state.question.options[1])} />
          <Button title={this.state.question.options[2]} value="C" disabled disabledStyle={this.selectedStyle(this.state.question.options[2])} />
          <Button title={this.state.question.options[3]} value="D" disabled disabledStyle={this.selectedStyle(this.state.question.options[3])} />
          <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ?
          <View> 
            <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
          </View>
          :
          <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </View>
      );
    } else if (this.state.question.type === "normal_answer") {
      return (
        <View style={styles.container}>
          <Text> {this.state.question.question}</Text>
          <Input placeholder={this.state.answer} disabled disabledInputStyle={this.selectedStyle} />
          <Button title="Check answer" disabled />
          <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
            </View>
          :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </View>
      );
    } else {
      return (
        <ScrollView>
          <Text> {this.state.question.question}</Text>
          <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle}/>
          <Button title="Check answer" disabled/>
          <AnswerScheme isAnswered={true} givenAnswer={this.state.chosenAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
            </View>
            :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </ScrollView>
      );
    }
  }
}