import React, { Component } from 'react';
import { StyleSheet, Text, View,  FlatList, AsyncStorage, Picker, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert } from 'react-native';

export default class MakeQuestion extends Component {
    constructor(props){
      super(props);
      this.state = {
        name: '',
        type: '',
        question: '',
        topic: '',
        difficulty: 0,
        content: '',
        answer: '',
        solution: '',
        options: [],
        correct: false
      }
    }
  
    sendData = () => {
      var token = AsyncStorage.getItem("id");
      fetch('http://192.168.0.12:3000/questions/makequestion', {
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
        })
      }).then((res) => console.log(res.json()))
        .then(this.props.navigation.navigate("MakeQuestion"))
        .catch((err) => console.log(err)).done(); 
    }
    render() {
      return (
        <View style={styles.makequestion}>
          <Text>Here we can make new questions!</Text>
          <Input placeholder="Question Title"  onChangeText={(name) => this.setState(name)}  />
          <View>
          <Text>Please set a question type:</Text>
            <Picker selectedValue={this.state.type} mode={Picker.MODE_DROPDOWN} onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})} style={styles.picker}>
              <Picker.Item value="true-false">True-False</Picker.Item>
              <Picker.Item value="multi-choice">Multiple Choice</Picker.Item>
              <Picker.Item value="normal">Normal</Picker.Item>
            </Picker>
          </View>
          {(this.state.type === "multi-choice") && 
            <View>
              <Input placeholder="Option 1" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
              <Input placeholder="Option 2" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
              <Input placeholder="Option 3" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
              <Input placeholder="Option 4" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
            </View>
          }
          <View>
            <Text>Please select the question topic:</Text>
            <Picker selectedValue={this.state.topic} style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 50, width: 100}} onValueChange={(itemValue) => this.setState({topic: itemValue})}>
              <Picker.Item label="Regular Languages" value="automata" />
              <Picker.Item label="Context-Free Languages" value="cfls" />
              <Picker.Item label="Turing Machines" value="turing" />
              <Picker.Item label="Lexing-Parsing" value="lexing-parsing" />
            </Picker>  
          </View>
          <Input placeholder="Answer to Question" onChangeText={(text) => {
            if (this.state.type === "multi-choice") {
              this.setState({options: this.state.options.concat(text)});
            }
            this.setState({answer: text});
          }} />
          <Input placeholder="Solution to problem" multiline={true} onChangeText={(text) => this.setState({solution: text})} />
          <Button style={styles.button} title="Submit question!" onPress={this.sendData()} />
        </View>
      );
    }
}