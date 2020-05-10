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

import styles from '../../style/styles';
export default class AdminQuestions extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      filteredQuestions: [],
      isLoading: true,
      error: null,
      search: '',
      type: 'all'
    }
  }
  /**
   * Renders the Make Question link as a plus sign in the header
   */
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

  async componentDidMount() {
    this.getQuestions();
  }

  /**
   * GETs all question and stores them in an array - see Questions
   */
  async getQuestions() {
    try {
      const token = await AsyncStorage.getItem("admin");
      let response = await fetch('http://192.168.0.12:3000/questions/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      let res = await response.json();
      if (res.success == true) {
        this.setState({questions: res.msg, filteredQuestions: res.msg, isLoading: false});
        console.log(filteredQuestions);
      }   else {
        if (res.msg == "Token expired") {
          /**
           * token expired - delete token and
           * navigate user to Login page.
           */
          await AsyncStorage.removeItem("admin");
          this.props.navigation.navigate("Login");
          alert("Your session has expired- please log in again");

        }
      }
    } catch (err) {
      /**
       * Server error
       */
      console.log("Error occured");
      this.setState({error: err});
    }
  }
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
   * Handles refreshing the list - calls getQuestions() to 
   * reload all questions again. 
   */
  async _handleRefresh() {
    this.setState({isLoading: true});
    this.getQuestions();
  }

  /**
   * Renders the UI
   */
  render() {
      return (
        <View>
          <SearchBar 
          value={this.state.search}
          onChangeText={this.getData}
          onClear={this.resetData}
          lightTheme
          placeholder='Enter here....'
          /> 
          {/* Alert.alert('Add Question?', 'Add this Question to your Favourites?', [ {text: 'No', onPress: () => console.log("refused")}, {text: 'Yes', onPress: () => this.saveQuestion(item._id)}]) */}
          <FlatList
           refreshControl={<RefreshControl 
            refreshing={this.state.isLoading}
            onRefresh={() => this._handleRefresh()}
          />}
            data={this.state.filteredQuestions}
            renderItem = {({item}) =>
              <ListItem
                title={item.name}
                subtitle={item.topic}
                bottomDivider
                chevron
                onPress={() => this.props.navigation.navigate("AdminViewQuestion", {question: item})}
              />
            }
            keyExtractor = {(item, index) => index.toString()}
          />
        </View>
      );
  }
}