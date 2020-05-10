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


export default class TestQuiz extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        correct: false, 
        answered: false,
        value: "",
        questions: [],
        normalAnswer: "",
        answer: ""
      }
    }
  
    /********************************************* */
    /** Mounts the component and sets the question */
    /** in the same way as the normal Quiz view in */
    /** the user's functionality - see Quiz comp.  */
    /********************************************* */
    componentDidMount() {
      this.setState({questions: this.props.navigation.getParam('Question'), isLoading: false}, () => console.log("Questions: " + this.state.questions));
    }
  

    /********************************************* */
    /** Takes answer as input and checks whether   */
    /** the answer is equal to the answer within   */
    /** the Question object. Navigates to CheckAns.*/
    /********************************************* */
    isCorrect(value) {
      this.setState({
        answered: true, answer: value, 
      });
      /**
       * If value is correct, then navigate
       * to CheckAnswer with the Question,
       * provided answer and whether the
       * answer is correct or not.
       */
      if (value === this.state.questions.answer) {
        this.setState({correct: true}, () => {
          this.props.navigation.navigate("CheckAnswer", {
            Question: this.state.questions,
            correct: this.state.correct,
            chosenAnswer: value,
          });
        });
      } else {
        this.setState({correct: false}, () => {
          this.props.navigation.navigate("CheckAnswer", {
            Question: this.state.questions,
            correct: this.state.correct,
            chosenAnswer: value,
          });
        });
  
      }
    }
  
    /**
     * Renders the UI in the Exact same way as the Quiz.
     */
    render() {
      if (!this.state.isLoading) {
        if (this.state.questions.type == "true_false") {
          return (
            <View style={styles.container}>
              <Text>{this.state.questions.question}</Text>
              <Button containerStyle={styles.truefalse_button} title="True" onPress={() => this.isCorrect("true")} />
              <Button containerStyle={styles.truefalse_button} title="False" onPress={() => this.isCorrect("false")} />
            </View>
          );
        } else if (this.state.questions.type == "multi_choice") {
          return (
            <View style={styles.container}>
              <Text> {this.state.questions.question}</Text>
              <View style={styles.inlinebuttons}>
                <Button title={this.state.questions.options[0]} value={this.state.questions.options[0]} onPress={() => this.isCorrect(this.state.questions.options[0])} />
                <Button title={this.state.questions.options[1]} value ={this.state.questions.options[1]} onPress={() => this.isCorrect(this.state.questions.options[1])} />
              </View>
              <View style={styles.inlinebuttons}>
                <Button title={this.state.questions.options[2]} value={this.state.questions.options[2]} onPress={() => this.isCorrect(this.state.questions.options[2])} />
                <Button title={this.state.questions.options[3]} value={this.state.questions.options[3]} onPress={() => this.isCorrect(this.state.questions.options[3])} />
              </View>
            </View>
          );
        } else if (this.state.questions.type == "normal_answer") {
          return (
            <View style={styles.container}>
              <Text> {this.state.questions.question}</Text>
              <Input placeholder="Answer here" onChangeText={(item) => this.setState({normalAnswer: item})}/>
              <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
            </View>
          );
        } else {
          return (
            <View style={styles.container}>
              <Text> {this.state.questions.question}</Text>
              <Input placeholder="Answer here" onChangeText={(answer) => this.setState({normalAnswer: answer})}/>
              <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
            </View>
          );
        }
      } else {
        return (
          <View> 
            <ActivityIndicator />
            <Text>Loading Question.....This may take unknown time.</Text>
          </View>
        );
      }
    }
  }