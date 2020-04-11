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
    //setInterval(() => this.getQuestions(), 2000);
  }

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
      let res = await response.json();
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
      if (res.success == true) {
        this.setState({questions: res.msg, filteredQuestions: res.msg, isLoading: false});
      }
    } catch (err) {
      this.setState({error: err}, () => console.log("Error: " + this.state.error));
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
      if (res.success == true) {
        console.log(res);
      }
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async viewQuestion(item) {
    console.log(item);
    this.props.navigation.navigate("ViewQuestion", {
      id: item
    });
  }

  getData = search => {
    if (search == '') {
      this.setState({filteredQuestions: this.state.questions, search: ''});
    }
    this.setState({search: search});
    let filtered = this.state.filteredQuestions.filter(function(item) {
      console.log(search + "+" +  (item.name.includes(search)).name);
      return item.name.includes(search); 
    });
    console.log(filtered);
    this.setState({filteredQuestions: filtered});
  }

  async resetData() { 
    this.setState({filteredQuestions: this.state.questions, search: ''});
  }

  async _handleRefresh() {
    this.setState({isLoading: true});
    this.getQuestions();
    this.setState({isLoading: false});
  }

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
          // onClearText={this.getData}
          lightTheme
          placeholder='Enter here....'
          />
          <FlatList 
            refreshControl={<RefreshControl 
              refreshing={this.state.isLoading}
              onRefresh={() => this._handleRefresh()}/>}
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