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
import styles from '../../style/styles';

import AnswerScheme from '../AnswerScheme';

export default class CheckAnswer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        question: [],
        correct: false,
        selectedAnswer: "",
        isSending: true
      }
    }
  
    /**
     * Loads Question, provided answer and flag for correctness into state. 
     * Unlike Data Upload, NO DATA IS SENT HERE.
     */
    async componentDidMount() {  
      this.setState({
        question: this.props.navigation.getParam("Question"),
        correct: this.props.navigation.getParam("correct"),
        selectedAnswer: this.props.navigation.getParam("chosenAnswer")
      }, () => console.log(this.props.navigation.getParam("chosenAnswer") + "=" + this.state.selectedAnswer));
    }
  
    /** Highlights the chosen and (if chosen answer is incorrect) correct answer */
    selectedStyle(value) {
      const styles = {};
      if (value == this.state.selectedAnswer) {
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
  
    /**
     * Renders the Data Upload UI.
     */
    render() {
      if (this.state.question.type === "true_false") {
        return (
          <View style={styles.container}>
            <Text>{this.state.question.question}</Text>
            <Button disabled title="True" disabledStyle={this.selectedStyle("True")} />
            <Button disabled title="False" disabledStyle={this.selectedStyle("False")} />
            <AnswerScheme isAnswered={true} answer={this.state.question.answer} answerScheme={this.state.question.solution} correct={this.state.correct} givenAnswer={this.state.selectedAnswer} />
            <View>
              <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
            </View>
          </View>
        );
      } else if (this.state.question.type === "multi_choice") {
        return (
          <View style={styles.container}>
            <Text> {this.state.question.question}</Text>
            <Button title={this.state.question.options[0]} value={this.state.question.options[0]} disabled disabledStyle={this.selectedStyle(this.state.question.options[0])} />
            <Button title={this.state.question.options[1]} value={this.state.question.options[1]} disabled disabledStyle={this.selectedStyle(this.state.question.options[1])} />
            <Button title={this.state.question.options[2]} value={this.state.question.options[2]} disabled disabledStyle={this.selectedStyle(this.state.question.options[2])} />
            <Button title={this.state.question.options[3]} value={this.state.question.options[3]} disabled disabledStyle={this.selectedStyle(this.state.question.options[3])} />
            <AnswerScheme isAnswered={true} givenAnswer={this.state.selectedAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
            <View>
              <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
            </View>
          </View>
        );
      } else if (this.state.question.type === "normal_answer") {
        return (
          <ScrollView>
            <Text> {this.state.question.question}</Text>
            <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle} />
            <Button title="Check answer" disabled />
            <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
            <View>
              <View>
                <ActivityIndicator />
                <Text>Just wait, your result is being sent!</Text>
              </View>
              <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
            </View>
          </ScrollView>
        );
      } else {
        return (
          <ScrollView>
            <Text> {this.state.question.question}</Text>
            <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle}/>
            <Button title="Check answer" disabled/>
            <AnswerScheme isAnswered={true} givenAnswer={this.state.chosenAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
            <View>          
              <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
            </View>
          </ScrollView>
        );
      }
    }
  }