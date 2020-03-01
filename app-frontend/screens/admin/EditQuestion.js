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


export default class EditQuestion extends Component {
    constructor(props) {
      super(props);
      this.state = {
        id: null,
        name: "",
        question: "",
        type: "",
        options: [],
        answer: "",
        solution: "",
        difficulty: 1,
        topic: "",
        isLoading: false,
      }
    }
  
    async componentDidMount() {
      this.setState({
        name: this.props.navigation.getParam("Question").name,
        question: this.props.navigation.getParam("Question").question,
        type: this.props.navigation.getParam("Question").type,
        options: this.props.navigation.getParam("Question").options,
        answer: this.props.navigation.getParam("Question").answer,
        solution: this.props.navigation.getParam("Question").solution,
        difficulty: this.props.navigation.getParam("Question").difficulty,
      });
      let response = await fetch("http://172.31.199.57:3000/topics/all", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
      let res = await response.json();
      if (res.success === true) {
        for (i in res.topics) {
          var element = {text: res.topics.name}
          this.topics.push(element);
        }
      } else {
        
      }
    }
  
    async editQuestion() {
      let adminToken = await AsyncStorage.getItem("admin");
      let response = await fetch('http://172.31.199.57:3000/admin/edit', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer' + adminToken,
        },
        body: JSON.stringify({
          name: this.state.name,
          question: this.state.question,
          topic: this.state.topic,
          type: this.state.type,
          options: this.state.options,
          answer: this.state.answer,
          solution: this.state.solution,
          difficulty: this.state.difficulty,
        })
      });
      let res = await response.json();
      if (res.success === true) {
        alert("Done");
        this.props.navigate.goBack();
      } else {
        console.log("Not done");
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
      return (
        <ScrollView>
        <Text>Here we can make new questions!</Text>
        <Input placeholder={this.state.name} onChangeText={(name) => this.setState({name: name})} />
        <Input placeholder={this.state.question} multiline={true} onChangeText={(ques) => this.setState({question: ques})} />
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
        <Button raised type="outline" style={styles.button} title="Submit question!" onPress={() => this.editQuestion()} />
      </ScrollView>
    );
    }
  }