import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../style/styles';

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      isLoading: true,
      error: null,
      search: '',
      filteredQuestions: [],
      status: "",
    }
  }

  /******************************************* */
  /**Loads the plus for the Make Question page */
  /******************************************* */
  static navigationOptions = ({navigation}) => {
    return {
      headerRight: () => (
        <Icon
          name='plus'
          size={30}
          onPress={() => {navigation.navigate("MakeQuestion")}}
          style={{marginRight: 10}}
        />
      ),
    };
  }

  /**
   * Gets questions on component loading
   */
  async componentDidMount() {
    this.getQuestions();
    //setInterval(() => this.getQuestions(), 2000);
  }

  /**
   * Makes Request to get questions
   * and store them in this.state()
   */
  async getQuestions() {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      /**
       * If token expired - then remove user's token
       * and navigate back to Login
       */
      let res = await response.json();
      if (res.msg == "Token expired") {
        this.setState({status: "token", isLoading: false});
        await AsyncStorage.removeItem("id");
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
      /**
       * Successful, stores questions in both questions and another
       * array for using the Search Bar.
       */
      if (res.success == true) {
        this.setState({questions: res.msg, filteredQuestions: res.msg, isLoading: false, status: "success"});
      }
    } catch (err) {
      /**
       * Server error occurred
       */
      this.setState({error: err}, () => console.log("Error: " + this.state.error));
    }
  }

  /**
   * Saves Question to Favourites - also in View Question
   * Sends the question id to the endpoint, which stores the 
   * ID within the User's saved_questions Array.
   */
  async saveQuestion(id) {
    try {
      this.setState({isLoading: true});
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
       * Successful, then return success message
       */
      if (res.success == true) {
        console.log(res);
        this.setState({status: "saved", isLoading: false});
      }
      /**
       * Token has expired - delete the token and
       * redirect the user back to Login.
       */
      if (res.msg == "Token expired") {
        await AsyncStorage.removeItem("id");
        this.setState({status: "not saved", isLoading: false});
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
    } catch (err) {
      /**
       * Server error occurred - display alert.0
       */
      console.log(err);
    }
  }

  /**
   * Takes a question and passes it to View Question 
   * to be displayed as a separate screen.
   */
  async viewQuestion(item) {
    console.log(item);
    this.setState({status: "ViewQuestion"});
    this.props.navigation.navigate("ViewQuestion", {
      id: item
    });
  }

  /**
   * Method for searching through question array by name
   * by using the filteredQuestions array and matching the question
   * names against the inputted string, and resetting the array if 
   * the string is empty/
   */
  getData = search => {
    if (search == '') {
      this.setState({filteredQuestions: this.state.questions, search: ''});
    } else {
      this.setState({search: search});
    let filtered = this.state.filteredQuestions.filter(function(item) {
      console.log(search + "+" +  (item.name.includes(search)).name);
      return item.name.includes(search); 
    });
    console.log(filtered);
    this.setState({filteredQuestions: filtered});
    }
  }

  /**
   * Resets the search array to include all questions
   */
  resetData = () => { 
    this.setState({filteredQuestions: this.state.questions, search: ''});
  }

  /**
   * On the component refresh (by pulling the screen upwards),
   * gets the new set of questions (if new ones were made)
   */
  async handleRefresh() {
    this.setState({isLoading: true});
    this.getQuestions();
    this.setState({isLoading: false});
  }

  /**
   * Render the UI. Uses a Flatlist to display questions as items in a list.
   */
  render() {
      return (
        <View>
          {/* <TopNavigation 
            title='Questions'
            alignment='center'
          /> */}
          {/* <TabView 
            selectedIndex={data.index}
            onSelect={(item) => this.props.navigation.navigate(item.screen)}
          >
            <Tab></Tab>
          </TabView> */}
          <SearchBar 
          value={this.state.search}
          onChangeText={this.getData}
          onClear={this.resetData}
          lightTheme
          placeholder='Enter here....'
          />
          <FlatList 
            refreshControl={<RefreshControl 
              refreshing={this.state.isLoading}
              onRefresh={() => this.handleRefresh()}/>}
              data={this.state.filteredQuestions}
              renderItem = {({item, index}) =>
              <ListItem
                title={item.name}
                subtitle={item.topic}
                bottomDivider
                chevron
                onPress={() => this.viewQuestion(item)}
              />
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
  }
}