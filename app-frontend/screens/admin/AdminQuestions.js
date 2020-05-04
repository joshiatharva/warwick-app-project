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
export default class AdminQuestions extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      isLoading: true,
      error: null,
      search: '',
      type: 'all'
    }
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerRight: () => (
        <Icon
          name='plus'
          size={20}
          onPress={() => {navigation.navigate("MakeQuestion")}}
          style={{marginRight: 10}}
        />
      ),
    };
  }

  async componentDidMount() {
    this.getQuestions();
  }

  async sendData() {
    const token = await AsyncStorage.getItem("id");
    try {
      let response = await fetch(`http://192.168.0.12:3000/questions/${this.state.type}/${this.state.search}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,  
        }
      });
      let res = await response.json();
      if (res.success) {
        this.setState({questions: res.json});
      }
    } catch (err) {
      // console.log("Error occurred: " + err);
    }

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
      // console.log(res.message);
    } catch (err) {
      // console.log(err);
    }
  }

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
      this.setState({questions: res.msg, isLoading: false});
      console.log(questions);
    } catch (err) {
      console.log("Error occured");
      this.setState({error: err});
    }
  }
  async _handleRefresh() {
    this.setState({isLoading: true});
    this.getQuestions();
  }

  render() {
      return (
        <ScrollView refreshControl={<RefreshControl 
          refreshing={this.state.isLoading}
          onRefresh={() => this._handleRefresh()}
        />}>
          <SearchBar 
          onChangeText={(item) => this.setState({search: item})}
          onClearText={()=> this.setState({search: ''})}
          lightTheme
          placeholder='Enter here....'
          /> 
          {/* Alert.alert('Add Question?', 'Add this Question to your Favourites?', [ {text: 'No', onPress: () => console.log("refused")}, {text: 'Yes', onPress: () => this.saveQuestion(item._id)}]) */}
          <FlatList 
            data={this.state.questions}
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
        </ScrollView>
      );
  }
}