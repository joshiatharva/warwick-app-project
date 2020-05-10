import React, { Component } from 'react';
import { View,  FlatList, AsyncStorage, RefreshControl } from 'react-native';
import { Text, Card } from '@ui-kitten/components';
import styles from '../style/styles';


export default class Favourites extends Component { 
  constructor() {
    super();
    this.interval = null;
    this.state = {
      questions: [],
      error: null,
      isLoading: true,
      page: "",
    }
  }
  
  async componentDidMount() {
    this._getFavourites();
  }
  /******************************************  */
  /** Calls the loadQuestions method at the    */
  /** user/questions/ endpoint, saves the      */
  /** questions into this.state and renders    */
  /** that array within the Flatlist component */
  /******************************************  */
  async _getFavourites() {
    try {
      const token = await AsyncStorage.getItem("id");
      const response = await fetch('http://192.168.0.12:3000/user/questions', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      const json = await response.json();
      this.setState({questions: json, isLoading: false});
      console.log("Success on getting questions");
    } catch (err) {
      this.setState({error: err}, () => console.log("Error: " + this.state.error));
    }
  }

  /*********************************************/
  /** Calls the loadQuestions method again     */
  /** to refresh the list with new questions   */ 
  /*********************************************/
  async _handleRefresh() {
    this.setState({isLoading: true});
    this._getFavourites();
    this.setState({isLoading: false});
  }


  /********************************************* */
  /** Records the time of starting the question  */
  /** to increment the various stats in the User */
  /** models as well as Demo_scores models       */
  /********************************************* */
  async _fetchLog(item) {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/log', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          id: item._id,
        })
      });
      let res = await response.json();
      return res;
  }
  
  /***********************************************************/
  /** Logs the start time of the question then navigates to  */
  /** the Quiz page to allow the user to answer the Question */
  /***********************************************************/
  async _sendData(item) {
    try {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/log', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          id: item._id,
        })
      });
      let res = await response.json();
      if (res.success == true) {
        console.log("yeet");
        this.setState({page: "Quiz"})
        this.props.navigation.navigate("Quiz", {Question: item});
      } else {
        return false; 
      }
    } catch (err) {
      console.log(err);
      alert("Connection lost - please try again.");
    }
  }

  /********************************************* */
  /** Renders all questions as a list of items   */
  /** Tapping an item navigates to the Quiz page */
  /********************************************* */
  render() {
    return (
        <View style={styles.container}>
          <FlatList 
              refreshControl={<RefreshControl 
              refreshing={this.state.isLoading}
              onRefresh={() => this._handleRefresh()}/>}
              data={this.state.questions}
              renderItem = {({item, index}) => (
                  <Card style={styles.cardContainer} onPress={() => this._sendData(item)}>
                    <Text>{item.name}</Text>
                    <Text>Topic: {item.topic}</Text>
                    <Text>Difficulty: {item.difficulty}</Text>
                  </Card>
              )}
              keyExtractor={(item, index) => index.toString()}
          />
        </View>
    );
  }
}