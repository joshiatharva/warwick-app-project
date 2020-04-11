import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, KeyboardAvoidingView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView, Input} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../style/styles';

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
      blankNameMsg: 'Please provide a name!',
      blankQuestionMsg: 'Please provide the question.',
      blankTypeMsg: 'Please provide a type!',
      blankTopicMsg: 'Please provide a question topic.',
      blankNormalMsg: 'Please fill in an answer.',
      blankSolutionMsg: 'Please provide a solution.',
      blankOption1Msg: 'Please provide the first option.',
      blankOption2Msg: 'Please provide the second option.',
      blankOption3Msg: 'Please provide the third option.',
      blankOption4Msg: 'Please provide the fourth option.',
      blankAnswerMsg: 'Please provide an answer.',
      blankNameFlag: false,
      blankQuestionFlag: false,
      blankTypeFlag: false,
      blankTopicFlag: false,
      blackNormalFlag: false,
      blankSolutionFlag: false,
      blankOption1Flag: false,
      blankOption2Flag: false,
      blankOption3Flag: false,
      blankOption4Flag: false,
      blankAnswerFlag: false,
    }
  }

  async sendData() {
    if (this.validateResults() == false) {
      alert("Creation failed - please see messages for more information");
    } else {
      if (this.state.type == "true_false") {
        this.setState({options: [true, false]});
      }
      console.log(this.state.type);
      try { 
        var token = await AsyncStorage.getItem("id");
        // console.log(this.state);
        let response = await fetch('http://192.168.0.12:3000/questions/new', {
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
        alert("Unfortunately, the server couldn't be accessed right now. Please try again later.");
      }
    }
  }

  validateResults() {
    if (this.state.name == '') {
      this.setState({blankNameFlag: true});
    } else {
      this.setState({blankNameFlag: false});
    }
    if (this.state.question == '') {
      this.setState({blankQuestionFlag: true});
    } else {
      this.setState({blankQuestionFlag: false});
    }
    if (this.state.type == '') {
      this.setState({blankTypeFlag: true});
    } else {
      this.setState({blankTypeFlag: false});
    }
    if (this.state.topic == '') {
      this.setState({blankTopicFlag: true});
    } else {
      this.setState({blankTopicFlag: false});
    }
    if (this.state.solution == '') {
      this.setState({blankSolutionFlag: true});
    } else {
      this.setState({blankSolutionFlag: false});
    }
    if (this.state.type == 'normal_answer' && this.state.answer == '') {
      this.setState({blankNormalFlag: true});
    } else {
      this.setState({blankNormalFlag: false});
    }
    if (this.state.type == 'multi_choice' && this.state.option1 == '') {
      this.setState({blankOption1Flag: true});
    } else {
      this.setState({blankOption1Flag: false});
    }
    if (this.state.type == 'multi_choice' && this.state.option2 == '') {
      this.setState({blankOption2Flag: true});
    } else {
      this.setState({blankOption2Flag: false});
    }
    if (this.state.type == 'multi_choice' && this.state.option3 == '') {
      this.setState({blankOption3Flag: true});
    } else {
      this.setState({blankOption3Flag: false});
    }
    if (this.state.type == 'multi_choice' && this.state.option4 == '') {
      this.setState({blankOption4Flag: true});
    } else {
      this.setState({blankOption4Flag: false});
    }
    if (this.state.type == 'true_false' && this.state.answer == '') {
      this.setState({blankAnswerFlag: true});
    } else {
      this.setState({blankAnswerFlag: false});
    }
    if (this.state.type == 'multi_choice' && this.state.answer == '') {
      this.setState({blankAnswerFlag: true});
    } else {
      this.setState({blankAnswerFlag: false});
    }
    if (!this.state.blankNameFlag && !this.state.blankQuestionFlag && !this.state.blankTypeFlag && !this.state.blankTopicFlag && !this.state.blankNormalFlag && !this.state.blankSolutionFlag && !this.state.blankOption1Flag && !this.state.blankOption2Flag && !this.state.blankOption3Flag && !this.state.blankOption4Flag && !this.state.blankAnswerFlag) {
      return true;
    } else {
      return false;
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
        {/* {(this.state.blankNameFlag) && (
          <Text>{this.state.blankNameMsg}</Text>
        )}
        {(this.state.blankQuestionFlag) && (
          <Text>{this.state.blankQuestionMsg}</Text>
        )}
        {(this.state.blankTopicFlag) &&(
          <Text>{this.state.blankTopicMsg}</Text>
        )}
        {(this.state.blankTypeFlag) && (
          <Text>{this.state.blankTypeMsg}</Text>
        )} */}
        {(this.state.blankOption1Flag) && (
          <Text>{this.state.blankOption1Msg}</Text>
        )}
        {(this.state.blankOption2Flag) && (
          <Text>{this.state.blankOption2Msg}</Text>
        )}
        {(this.state.blankOption3Flag) && (
          <Text>{this.state.blankOption3Msg}</Text>
        )}
        {(this.state.blankOption4Flag) && (
          <Text>{this.state.blankOption4Msg}</Text>
        )}
        {(this.state.blankNormalFlag && !this.state.type=="normal_answer") && (
          <Text>{this.state.blankNormalFlag}</Text>
        )}
        <Text>Here we can make new questions!</Text>
        <Input 
          placeholder="Question Title"  
          onChangeText={(item) => this.setState({name: item})} 
          status={!this.state.blankNameFlag ? 'basic' : 'danger'}
          caption={!this.state.blankNameFlag ? '' : this.state.blankNameMsg}  
        />
        <Input 
          placeholder="Name the question" 
          multiline={true} 
          onChangeText={(ques) => this.setState({question: ques})} 
          status={!this.state.blankQuestionFlag ? 'basic' : 'danger'}
          caption={!this.state.blankQuestionFlag ? '' : this.state.blankQuestionMsg}  
        />
        <Text>Please select the question topic:</Text>
        <Select
          placeholder="Select Question Topic"
          data={topics}
          selectedOption={this.state.topic}
          onSelect={(item) => this.setState({topic: item.text}, () => console.log(this.state.topic))} 
        />  
        {(this.state.blankTypeFlag) && (
          <Text>{this.state.blankTypeMsg}</Text>
        )}
        <Text>Please set a question type:</Text>
        <Select
          placeholder="Select Question Type"
          data={types}
          selectedOption={this.state.type}
          onSelect={(item) => this.addType(item)}
        />
        {(this.state.blankTypeFlag) && (
          <Text>{this.state.blankTypeMsg}</Text>
        )}
        {(this.state.selectedType == "Multiple Choice") && (
        <View style={styles.container}> 
          <Input 
            placeholder="Option 1" 
            onChangeText={(text) => this.setState({option1: text})} 
            status={!this.state.blankOption1Flag ? 'basic': 'danger'}
            caption={!this.state.blankOption1Flag ? '' : this.state.blankOption1Msg} 
          />
          <Input 
            placeholder="Option 2" 
            onChangeText={(text) => this.setState({option2: text})} 
            status={!this.state.blankOption2Flag ? 'basic': 'danger'}
            caption={!this.state.blankOption2Flag ? '' : this.state.blankOption2Msg}
          />
          <Input 
            placeholder="Option 3" 
            onChangeText={(text) => this.setState({option3: text})} 
            status={!this.state.blankOption3Flag ? 'basic':'danger'}
            caption={!this.state.blankOption3Flag ? '': this.state.blankQuestion3Msg}
          />
          <Input 
            placeholder="Option 4" 
            onChangeText={(text) => this.setState({option4: text})} 
            status={!this.state.blankOption4Flag ? 'basic':'danger'}
            caption={!this.state.blankOption4Flag ? '' : this.state.blankOption4Msg}  
          />
          <Button raised type="outline" title="Set your options here!" onPress={() => this.addToArray()} />
          <Text>Select your answer here!</Text>
          <Select 
            placeholder="Select Answer"
            data={this.state.optionList}
            selectedOption={this.state.answer}
            onSelect={(object) => this.removeObject(object)}
          />
          {(this.state.blankAnswerFlag) && (
            <Text>{this.state.blankAnswerFlag}</Text>
          )}
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
        <KeyboardAvoidingView>
          <Input placeholder="Solution to problem" multiline={true} numberOfLines={5} maxLength={1000} onChangeText={(text) => this.setState({solution: text})} />
        </KeyboardAvoidingView>
        <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onSlidingComplete={(value) => this.setState({difficulty: value})} style={{marginRight:40 , marginLeft: 40}} />
        <Text>Difficulty: {this.state.difficulty}</Text>
        <Button raised type="outline" style={styles.button} title="Submit question!" onPress={() => this.sendData()} />
      </ScrollView>
    );
  }
}