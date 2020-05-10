import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, Input,TopNavigation, TabView} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../../style/styles';


export default class EditQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: "",
      tempName: "",
      question: "",
      tempQuestion: "",
      type: "",
      tempType: "",
      topic: "",
      tempTopic: "",
      options: [],
      tempOptions: [],
      optionList: [],
      tempOption1: "",
      tempOption2: "",
      tempOption3: "",
      tempOption4: "",
      answer: "",
      tempAnswer: "",
      solution: "",
      tempSolution: "",
      difficulty: 1,
      tempDifficulty: 1,
      isLoading: false,
      selectedType: "",
    }
  }


  /********************************************* */
  /** Sets state to equal all question variables */
  /** with temp variables (these are the values  */
  /** that are edited in the Edit Question form  */
  /********************************************* */
  async componentDidMount() {
    this.setState({
      id: this.props.navigation.getParam("Question")._id,
      name: this.props.navigation.getParam("Question").name,
      tempName: this.props.navigation.getParam("Question").name,
      question: this.props.navigation.getParam("Question").question,
      tempQuestion: this.props.navigation.getParam("Question").question,
      type: this.props.navigation.getParam("Question").type,
      tempType: this.props.navigation.getParam("Question").type,
      topic: this.props.navigation.getParam("Question").topic,
      tempTopic: this.props.navigation.getParam("Question").topic,
      options: this.props.navigation.getParam("Question").options,
      answer: this.props.navigation.getParam("Question").answer,
      solution: this.props.navigation.getParam("Question").solution,
      tempSolution: this.props.navigation.getParam("Question").solution,
      difficulty: this.props.navigation.getParam("Question").difficulty,
      tempDifficulty: this.props.navigation.getParam("Question").difficulty,
    }, () => {
      /**
       * Types are set once question loaded into state
      */
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
      console.log(this.state.type + " " + this.state.tempType);
      console.log(this.state.options);
    });
    console.log(this.state.type);
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
    /**
     * Set the options in the Options array if True False or Multi Choice
     * Validate each field to check whether empty
     * If not then send a Request with all fields in the body.
     */
    this.checkTypes();
    let name = (this.state.tempName !="") ? this.state.tempName : this.state.name; 
    let question = (this.state.tempQuestion != "") ? this.state.tempQuestion : this.state.question;
    let topic = (this.state.tempTopic != "") ? this.state.tempTopic : this.state.topic;
    let type = (this.state.tempType != "") ? this.state.tempType : this.state.type;
    let options = (this.checkTempArray()) ? this.state.tempOptions : this.state.options;
    let answer = (this.state.tempAnswer != "") ? this.state.tempAnswer : this.state.answer;
    let solution = (this.state.tempSolution != "") ? this.state.tempSolution : this.state.solution;
    let adminToken = await AsyncStorage.getItem("admin");
    let response = await fetch('http://192.168.0.12:3000/admin/edit', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        id: this.state.id,
        name: name,
        question: question,
        topic: topic,
        type: type,
        options: options,
        answer: answer,
        solution: solution,
        difficulty: this.state.tempDifficulty,
      })
    });
    let res = await response.json();
    /**
     * Successful, navigate back to Questions page.
     */
    if (res.success === true) {
      alert("Done");
      this.props.navigation.goBack();
    } else {
      if (res.typ == "token") {
        /**
         * Token has expired - navigate back to Login
         * and remove token.
         */
        await AsyncStorage.removeItem("admin");
        this.props.navigation.navigate("Login");
      }
    }
  }

  /**
   * Validates whether option choices have not
   * been left empty - for Multi Choice questions
   */
  checkTempArray() {
    if (this.state.tempOptions == [] && this.state.tempType == "multi_choice") {
      return false;
    }
    for (var i = 0; i < this.state.tempOptions.length; i++) {
      if (this.state.tempOptions[i] == "") {
        return false;
      }
    } return true;
  }
  
  /**
   * Checks whether the type is
   * True-False, if so then populate
   * options with true/false, otherwise if 
   * Normal Answer then empty array.
   */
  checkTypes() {
    if (this.state.tempType == "true_false") {
      this.setState({tempOptions: [true, false]});
    } else {
      if (this.state.tempType == "normal_answer") {
        this.setState({tempOptions: []})
      }
    }
  }

  /**
   * Same as Make Questions - creates an object of options
   * from 4 options provided and sets object for Dropdown when
   * selecting answers.
   */
  async addToArray() {
    var objectArray = [];
    var array = [this.state.tempOption1, this.state.tempOption2, this.state.tempOption3, this.state.tempOption4];
    console.log(array);
    for (var i = 0; i < array.length; i++) {
      var object = {
        text: array[i]
      };
      console.log("Opt: " + object);
      objectArray[i] = object;
    }
    this.setState({optionList: objectArray, tempOptions: array}, 
      () => console.log("List: " + this.state.optionList + "\nOptions: " + this.state.options)
    );
  }
  
  /**
   * Extracts text field from Dropdown entry - used for 
   * selecting answer from a Drop Down when the question
   * is of type Multi Choice
   */
  async removeObject(item) {
    var entry = item.text;
    console.log(item.text);
    this.setState({answer: entry});
  }
  /**
   * Sets answer from True False Dropdown 
   * within state by converting entry to 
   * boolean
   */
  async booleanToObject(item) {
    var entry = item.text;
    var boolean = false; 
    if (entry === "True") {
      boolean = true;
    } else {
      boolean = false;
    }
    this.setState({tempAnswer: boolean});
  }

  /**
   * Sets the Question type to be the type
   * selected within the Drop down by extracting
   * the text field from the Selected option then
   * performing a switch on the type selected (DB 
   * has different names for types). 
   */
  async addType(item) {
    var entry = item.text;
    this.setState({selectedType: entry});
    console.log(this.state.selectedType);
    switch (entry) {
      case "True-False":
        this.setState({tempType: "true_false"});
        break;
      case "Multiple Choice":
        this.setState({tempType: "multi_choice"});
        break;
      case "Normal Answer":
        this.setState({tempType: "normal_answer"});
        break;
      default: 
        this.setState({tempType: "normal_answer"});
        break;
    }
  }

  /**
   * Renders the UI.
   */
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
      <Input placeholder={this.state.name} onChangeText={(name) => this.setState({tempName: name})} />
      <Input placeholder={this.state.question} multiline={true} onChangeText={(ques) => this.setState({tempQuestion: ques})} />
      <Text>Please select the question topic:</Text>
      <Select
          placeholder={this.state.topic}
          data={topics}
          selectedOption={this.state.tempTopic}
          onSelect={(item) => this.setState({topic: item.text}, () => console.log(this.state.topic))} 
        />  
        <Text>Please set a question type:</Text>
        <Select
          placeholder={this.state.selectedType}
          data={types}
          selectedOption={this.state.tempType}
          onSelect={(item) => this.addType(item)}
        />
        {(this.state.tempType == "multi_choice") && (
        <View style={styles.container}> 
          <Input placeholder="Please input option" onChangeText={(text) => this.setState({tempOption1: text})} />
          <Input placeholder="Please input option" onChangeText={(text) => this.setState({tempOption2: text})} />
          <Input placeholder="Please input option" onChangeText={(text) => this.setState({tempOption3: text})} />
          <Input placeholder="Please input option" onChangeText={(text) => this.setState({tempOption4: text})} />
          <Button type="outline" title="Set your options here!" onPress={() => this.addToArray()} />
          <Text>Select your answer here!</Text>
          {/* <Text>{this.state.optionList[0].text}</Text>
          <Text>{this.state.optionList[1].text}</Text>
          <Text>{this.state.optionList[2].text}</Text>
          <Text>{this.state.optionList[3].text}</Text> */}
          <Select 
            placeholder="Select your answer"
            data={this.state.optionList}
            selectedOption={this.state.tempAnswer}
            onSelect={(object) => this.removeObject(object)}
          />
        </View>
        )}
        {(this.state.selectedType == "Normal Answer") && (
        <View style={styles.container}>
          <Text>No options required - move onto next field!</Text> 
          <Input placeholder={this.state.answer} onChangeText={(text) => this.setState({tempAnswer: text})} />
        </View>
        )}
        {(this.state.selectedType == "True-False") && (
          <View style={styles.container}>
            <Button disabled title="True"/> 
            <Button disabled title="False"/>
            <Select
              data={boolean}
              selectedOption={this.state.tempAnswer}
              onSelect={(object) => this.booleanToObject(object)}
            />
          </View>
        )}
      <View style={styles.container}>
        <Input placeholder={this.state.solution} multiline={true} numberOfLines={5} maxLength={1000} onChangeText={(text) => this.setState({solution: text})} />
      </View>
      <View style={{padding: 20}}>
      <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onSlidingComplete={(value) => this.setState({difficulty: value})} />
      <Text>Difficulty: {this.state.difficulty}</Text>
      </View>
      <Button type="outline" style={styles.button} title="Submit question!" onPress={() => this.editQuestion()} />
    </ScrollView>
  );
  }
}