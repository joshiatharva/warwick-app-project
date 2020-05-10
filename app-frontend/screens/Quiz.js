import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView, Input} from '@ui-kitten/components';
import styles from '../style/styles';

export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      correct: false, 
      answered: false,
      value: "",
      questions: [],
      answer: "",
      emptyAnswerFlag: false,
      page: "",
    }
  }

  /**
   * Load the question into state to start answering,
   * and set loading to false to allow user actions.
   */
  componentDidMount() {
    this.setState({
      questions: this.props.navigation.getParam('Question'), 
      isLoading: false,
    });
  }

  /**
   * Function for checking if the inputted answer is correct or not.
   */
  isCorrect(value) {
    console.log("Value: " + value);
    /**
     * Validating empty fields for Normal Answer
     */
    if (this.state.answer == '' && this.state.questions.type == "normal_answer") {
      this.setState({emptyAnswerFlag: true});
    } else {
      /**
       * Sets the answer in state as the inputted answer, then navigates
       * to Data Upload, sending the question, given answer and whether
       * the answer is correct or not.
       */
      this.setState({answered: true, answer: value});
      if (value === this.state.questions.answer) {
        this.setState({correct: true, page: "DataUpload"}, () => {
          this.props.navigation.navigate("DataUpload", {
            Question: this.state.questions,
            correct: this.state.correct,
            chosenAnswer: value,
          });
        });
      } else {
        this.setState({correct: false,page: "DataUpload"}, () => {
          this.props.navigation.navigate("DataUpload", {
            Question: this.state.questions,
            correct: this.state.correct,
            chosenAnswer: value,
          });
        });
      }
    }
  }

  render() {
    if (!this.state.isLoading) {
      /**
       * Render the UI if the question type is True-False
       */
      if (this.state.questions.type == "true_false") {
        return (
          <View style={styles.container}>
            <Text>{this.state.questions.question}</Text>
            <Button title="True" onPress={() => this.isCorrect("true")} />
            <Button title="False" onPress={() => this.isCorrect("false")} />
          </View>
        );
        /**
         * Render the UI if the question type is Multiple Choice
         */
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
        /**
         * Render the UI if the question type is Normal Answer
         */
      } else if (this.state.questions.type == "normal_answer") {
        return (
          <View style={styles.container}>
            <Text> {this.state.questions.question}</Text>
            <Input
              placeholder="Answer here" 
              onChangeText={(item) => this.setState({answer: item})}
              status={(!this.state.emptyAnswerFlag) ? 'basic': 'danger'}
              caption={(!this.state.emptyAnswerFlag) ? '' : 'Please provide your answer.' }
            />
            <Button title="Check answer" onPress={() => this.isCorrect(this.state.answer)} />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text> {this.state.questions.question}</Text>
            <Input 
              placeholder="Answer here" 
              onChangeText={(item) => this.setState({answer: item})}
              status={(!this.state.emptyAnswerFlag) ? 'basic': 'danger'}
              caption={(!this.state.emptyAnswerFlag) ? '' : 'Please provide your answer.' }
            />
            <Button title="Check answer" onPress={() => this.isCorrect(this.state.answer)} />
          </View>
        );
      }
    } else {
      return (
        /**
         * Question is being loaded
         */
        <View> 
          <ActivityIndicator />
          <Text>Loading Question.....This may take unknown time.</Text>
        </View>
      );
    }
  }
}