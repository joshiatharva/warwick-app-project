import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import Quiz from 'Quiz';
import DataUpload from 'DataUpload';

export default class Questions extends Component {
  state = { 
    questions: [],
    error: null,
    loaded: false 
  };

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const response = await fetch('localhost:3000/api/getQuestions', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const json = await response.json();
      this.setState({questions: json});
      console.log(json);
    } catch (err) {
      this.setState({error: err.message})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.error && (
          <Text>Error: no questions retrieved!</Text>
        )}
        { this.state.questions && !this.state.error && this.state.questions.length > 0 (
          <FlatList
          data={this.state.questions}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => 
          <View style={styles.list}>
            <Text>Name: {item.name}</Text>
            <Text>Topic: {item.topic} </Text>
            <Text>Difficulty: {item.difficulty}</Text>
          </View>
          }        
        />
        <Text>{this.state.questions}</Text>
        )}
      </View>
    );
  }
}

export const questionStackNavigator = createStackNavigator({
    Questions: Questions
    Quiz: Quiz
});

export const questionSwitchNavigator = createSwitchNavigator({
    questionStackNavigator: questionStackNavigator,
    DataUpload: DataUpload,
    Home: Home
});