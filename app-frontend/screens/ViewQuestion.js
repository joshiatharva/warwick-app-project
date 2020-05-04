import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';

import { Button } from 'react-native-elements';
import { Text, Card } from '@ui-kitten/components';

import styles from '../style/styles';

export default class ViewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      status: ""
    };
  }

  async componentDidMount() {
    var question = this.props.navigation.getParam('id');
    this.setState({question: question}); 
  }

  async saveQuestion(id) {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/save',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          "question_id": id
        })
      });
      let res = await response.json();
      if (res.success == true) {
        alert("Question has been saved to Favourites!");
        this.setState({status: "success"});
      } else {
        this.setState({status: "failure"});
      }
      // console.log(res.message);
    } catch (err) {
      // console.log(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
      <Card style={styles.container}>
      <Text>Name: {this.state.question.name}</Text>
        <Text>Topic: {this.state.question.topic}</Text>
        <Text>Type of question: {this.state.question.type}</Text>
        <Text>{this.state.question.accesses} people have tried this question!</Text>
        <Text>Mean mark: {this.state.question.correct / this.state.question.accesses > 0 ? this.state.question.correct / this.state.question.accesses : 0}</Text>
        <Button title="Add to Favourites" onPress={() => this.saveQuestion(this.state.question._id)} />
      </Card>
      </View>
    );
  }
}