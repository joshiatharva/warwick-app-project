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

  /******************************** */
  /** Loads the question into state */
  /******************************** */
  async componentDidMount() {
    var question = this.props.navigation.getParam('id');
    this.setState({question: question}); 
  }

  /************************************************** */
  /** Sends the question ID to the /save endpoint and */
  /** adds the ID to the user's saved_questions array */
  /************************************************** */
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
      /**
       * If successful, then return the 
       * appropriate message.
       */
      if (res.success == true) {
        alert("Question has been saved to Favourites!");
        this.setState({status: "success"});
      } else {
        /**
         * Token has expired - remove the token 
         * and redirect to Login page
         */
        if (res.msg == "Token expired") {
          await AsyncStorage.removeItem("id");
          this.props.navigation.navigate("Login");
          alert()
        }
        this.setState({status: "failure"});
      }
      // console.log(res.message);
    } catch (err) {
      /**
       * Server error
       * 
       */
      alert("The server seems to be down - please try again later");
    }
  }

  /**
   * Render the UI
   */
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