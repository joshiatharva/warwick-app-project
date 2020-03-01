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

export default class MakeQuestion extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      type: '',
      question: '',
      topic: '',
      difficulty: 1,
      content: '',
      answer: '',
      solution: '',
      options: [],
      optionList: [],
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      selectedType: '',
    }
  }

  async sendData() {
    if (this.state.type == "true_false") {
      this.setState({options: [true, false]});
    }
    console.log(this.state.type);
    try { 
      var token = await AsyncStorage.getItem("id");
      // console.log(this.state);
      let response = await fetch('http://172.31.199.57:3000/questions/new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          name: this.state.name,
          type: this.state.type,
          question: this.state.question,
          options: this.state.options,
          difficulty: this.state.difficulty,
          answer: this.state.answer,
          solution: this.state.solution,
          topic: this.state.topic
        }),
      });
      let res = await response.json();
      if (res.success == true) {
        alert("Question made");
      } else {
        alert("Question not made");
      }
      this.props.navigation.navigate("Questions");
    } catch (err) {
      // console.log(err);
      alert(err);
    }
  }

  addToArray() {
    var objectArray = [];
    var array = [this.state.option1, this.state.option2, this.state.option3, this.state.option4];
    console.log(array);
    for (var i = 0; i < array.length; i++) {
      var object = {
        text: array[i]
      };
      console.log("Opt: " + object);
      objectArray[i] = (object);
    }
    this.setState({optionList: objectArray, options: array}, () => console.log("List: " + this.state.optionList + "\nOptions: " + this.state.options));
    console.log(this.state.optionList);
  }
  
  async removeObject(item) {
    var entry = item.text;
    console.log(item.text);
    this.setState({answer: entry}, () => console.log(this.state.answer));
  }

  async booleanToObject(item) {
    var entry = item.text;
    var boolean = false; 
    if (entry === "True") {
      boolean = true;
    } else {
      boolean = false;
    }
    this.setState({answer: boolean}, () => console.log(this.state.answer));
  }

  async addType(item) {
    var entry = item.text;
    this.setState({selectedType: entry});
    console.log(item.text);
    switch (entry) {
      case "True-False":
        this.setState({type: "true_false"});
        break;
      case "Multiple Choice":
        this.setState({type: "multi_choice"});
        break;
      case "Normal Answer":
        this.setState({type: "normal_answer"});
        break;
      default: 
        this.setState({type: "normal_answer"});
        break;
    }
  }

  render() {
    const types = [
      {text: "True-False"},
      {text: "Multiple Choice"},
      {text: "Normal Answer"},
    ];
    const topics = [
      {text: "Regular Languages"},
      {text: "Context Free Languages"},
      {text: "Turing Machines"},
    ];
    const boolean = [
      {text: "True"},
      {text: "False"}
    ];

    return (
      <ScrollView>
        <Text>Here we can make new questions!</Text>
        <Input placeholder="Question Title"  onChangeText={(name) => this.setState({name: name})} />
        <Input placeholder="Name the question" multiline={true} onChangeText={(ques) => this.setState({question: ques})} />
        <Text>Please select the question topic:</Text>
        <Select
          placeholder="Select Question Topic"
          data={topics}
          selectedOption={this.state.topic}
          onSelect={(item) => this.setState({topic: item.text}, () => console.log(this.state.topic))} 
        />  
        <Text>Please set a question type:</Text>
        <Select
          placeholder="Select Question Type"
          data={types}
          selectedOption={this.state.type}
          onSelect={(item) => this.addType(item)}
        />
        {(this.state.selectedType == "Multiple Choice") && (
        <View style={styles.container}> 
          <Input placeholder="Option 1" onChangeText={(text) => this.setState({option1: text})} />
          <Input placeholder="Option 2" onChangeText={(text) => this.setState({option2: text})} />
          <Input placeholder="Option 3" onChangeText={(text) => this.setState({option3: text})} />
          <Input placeholder="Option 4" onChangeText={(text) => this.setState({option4: text})} />
          <Button raised type="outline" title="Set your options here!" onPress={() => this.addToArray()} />
          <Text>Select your answer here!</Text>
          <Text></Text>
          <Select 
            placeholder="Select Answer"
            data={this.state.optionList}
            selectedOption={this.state.answer}
            onSelect={(object) => this.removeObject(object)}
          />
        </View>
        )}
        {(this.state.selectedType == "Normal Answer") && (
        <View style={styles.container}>
          <Text>No options required - move onto next field!</Text> 
          <Input placeholder="Enter your answer here" onChange={(text) => this.setState({answer: text})} />
        </View>
        )}
        {(this.state.selectedType == "True-False") && (
          <View style={styles.container}>
            <Button disabled title="True"/> 
            <Button disabled title="False"/>
            <Select
              data={boolean}
              selectedOption={this.state.answer}
              onSelect={(object) => this.booleanToObject(object)}
            />
          </View>
        )}
        <View style={styles.container}>
          <Input placeholder="Solution to problem" multiline={true} numberOfLines={5} maxLength={1000} onChangeText={(text) => this.setState({solution: text})} />
        </View>
        <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onSlidingComplete={(value) => this.setState({difficulty: value})} />
        <Text>Difficulty: {this.state.difficulty}</Text>
        <Button raised type="outline" style={styles.button} title="Submit question!" onPress={() => this.sendData()} />
      </ScrollView>
    );
  }
}