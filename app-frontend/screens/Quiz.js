import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      correct: false, 
      index: 1,
      answered: false,
      questions: [],
    }
  }

  componentDidMount(){
    this.setState({questions: this.navigation.state.data});
  }

  isCorrect = (value) => {
    if (value === wuestions.answer) {
      this.setState({correct: true});
      alert("Correct!");
      navigateTo('DataUpload');
    } else {
      this.setState({correct: false});
      alert(`Sorry! The correct answer was ${this.state.questions.answer}!`);
      navigateTo('DataUpload');
    }
  }

  navigateTo()
  render() {
    return (
      <View style={styles.qbackground}>
        <Button onPress={()=> this.props.navigation.goBack()} />
        <Text style={styles.question}> {this.state.questions.question}</Text>
        <Button placeholder="True" value="true" onPress={() => this.isCorrect(true).bind(this)} />
        <Button placeholder="False" value ="false" onPress={() => this.isCorrect(false).bind(this)} />
      </View>
    );
  }
}