import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView } from 'react-native';
import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Avatar, Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import { Linking } from 'expo';
// import Canvas from 'react-native-canvas';
// import SlidingUpPanel from 'rn-sliding-up-panel';
// import MathJax from 'react-native-mathjax';
import { ApplicationProvider, Select, Text, Card, Datepicker, Input, Layout, TopNavigation, TabView} from '@ui-kitten/components';
//import * as UI from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit"

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
  
    async componentDidMount() {
      try {
        const token = await AsyncStorage.getItem("admin");
        let response = await fetch('http://172.31.199.57:3000/questions/all', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        });
        let json = await response.json();
        this.setState({questions: json, isLoading: false});
      } catch (err) {
        console.log("Error occured");
        this.setState({error: err});
      }
    }
  
    async sendData() {
      const token = await AsyncStorage.getItem("id");
      try {
        let response = await fetch(`http://172.31.199.57:3000/questions/${this.state.type}/${this.state.search}`, {
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
        let response = await fetch('http://172.31.199.57:3000/questions/save',{
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
  
    render() {
        return (
          <ScrollView>
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