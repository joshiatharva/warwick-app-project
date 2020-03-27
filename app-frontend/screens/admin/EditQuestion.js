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


export default class EditQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: "",
      question: "",
      type: "",
      topic: "",
      options: [],
      optionList: [],
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
      solution: "",
      difficulty: 1,
      isLoading: false,
      selectedType: "",
    }
  }

  async componentDidMount() {
    this.setState({
      id: this.props.navigation.getParam("Question")._id,
      name: this.props.navigation.getParam("Question").name,
      question: this.props.navigation.getParam("Question").question,
      topic: this.props.navigation.getParam("Question").topic,
      option1:  this.props.navigation.getParam("Question").options[0],
      option2: this.props.navigation.getParam("Question").options[1],
      option3:this.props.navigation.getParam("Question").options[2],
      option4: this.props.navigation.getParam("Question").options[3],
      answer: this.props.navigation.getParam("Question").answer,
      solution: this.props.navigation.getParam("Question").solution,
      difficulty: this.props.navigation.getParam("Question").difficulty,
    });
    switch (this.state.type) {
      case "true_false":
        this.setState({selectedType: "True-False"});
        break;
        case "multi_choice":
          this.setState({selectedType: "Multiple Choice"});
          break;
        case "normal_answer":
          this.setState({selectedType: "Normal Answer"});
          break;
        default: 
          this.setState({selectedType: "Normal Answer"});
          break;
    }
    this.addToArray();
    // let response = await fetch("http://192.168.0.16:3000/topics/all", {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    // });
    // let res = await response.json();
    // if (res.success === true) {
    //   for (i in res.topics) {
    //     var element = {text: res.topics.name}
    //     this.topics.push(element);
    //   }
    // } else {
      
    // }
  }

  async editQuestion() {
    let adminToken = await AsyncStorage.getItem("admin");
    let response = await fetch('http://192.168.0.12:3000/admin/edit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        id: this.state.id,
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
      this.props.navigation.goBack();
    } else {
      console.log("Not done");
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
    this.setState({answer: entry});
  }

  async booleanToObject(item) {
    var entry = item.text;
    var boolean = false; 
    if (entry === "True") {
      boolean = true;
    } else {
      boolean = false;
    }
    this.setState({answer: boolean});
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
      <Input placeholder={this.state.name} onChangeText={(name) => this.setState({name: name})} />
      <Input placeholder={this.state.question} multiline={true} onChangeText={(ques) => this.setState({question: ques})} />
      <Text>Please select the question topic:</Text>
      <Select
          placeholder={this.state.topic}
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
          <Input placeholder="Enter your answer here" onChangeText={(text) => this.setState({answer: text})} />
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
        <Input placeholder={this.state.solution} multiline={true} numberOfLines={5} maxLength={1000} onChangeText={(text) => this.setState({solution: text})} />
      </View>
      <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onSlidingComplete={(value) => this.setState({difficulty: value})} />
      <Text>Difficulty: {this.state.difficulty}</Text>
      <Button raised type="outline" style={styles.button} title="Submit question!" onPress={() => this.editQuestion()} />
    </ScrollView>
  );
  }
}