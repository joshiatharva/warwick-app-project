import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

export default class Local extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      type: null,
      topic: '',
      difficulty: 0,
      content: '',
      answer: '',
      solution: ''

    }
    const initialState = this.state;
  }

  sendData = () => {
    fetch('localhost:3000/question/makeQuestion', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
        "Content-Type": 'application/json',
        "Authorization": "Bearer" + " " + AsyncStorage.getItem("id");
      },
      body: JSON.stringify({
        name: this.state.name,
        type: this.state.type,
        topic: this.state.topic,
        difficulty: this.state.difficulty,
        answer: this.state.answer,
        solution: this.state.solution
      }).then((res) => alert(res.json())).catch((err) => alert(err)).then(() => this.reset().bind(this)).then(() => this.props.navigation.navigate("Questions")).done(); 
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Here we can make new questions!</Text>
        <TextInput placeholder="Question Title" value="name" onChangeText={(name) => this.setState(name)}  />
        <Picker
          selectedValue={this.state.type}
          mode={Picker.MODE_DROPDOWN}
          onValueChange={(itemValue) => this.setState({type: itemValue})}>
          <Picker.Item value="true-false">True-False</Picker.Item>
          <Picker.Item value="multi-choice">Multiple Choice</Picker.Item>
          <Picker.Item value="normal">Normal</Picker.Item>
        </Picker>
        <Picker
          selectedValue={this.state.topic}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 50, width: 100}}
          onValueChange={(itemValue) => this.setState({topic: itemValue})}>
          <Picker.Item label = "DFA's, NFA's, Regular Languages"value="automata" />
          <Picker.Item label="Context-Free Languages" value="cfls" />
          <Picker.Item label="Turing Machines" value="turing" />
          <Picker.Item label="Lexing-Parsing" value="lexing-parsing" />
        </Picker>
      </View>
    );
  }
}