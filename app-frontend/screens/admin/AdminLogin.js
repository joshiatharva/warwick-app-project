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

export default class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      isLoading: false,
      isSending: false,
      err: '',
      answer: '',
      index: 0,
    }
  }

  async componentDidMount() {
    this.setState({isLoading: true})
    let token = await AsyncStorage.getItem("admin");
    let response = await fetch("http://192.168.0.12:3000/admin/2fa", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    if (res.success === true) {
      this.setState({question: res.question, index: res.index, isLoading: false})
    } else {
      this.setState({isLoading: false, err: res.msg});
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired!");
      }
    }
  }

  async sendData() {
    this.setState({isSending: true});
    let adminToken = await AsyncStorage.getItem("admin");
    console.log(adminToken);
    let response = await fetch("http://192.168.0.12:3000/admin/2fa", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + adminToken
      },
      body: JSON.stringify({
        question: this.state.question,
        answer: this.state.answer,
        index: this.state.index,
      })
    });
    console.log("Sent");
    let res = await response.json();
    if (res.success === true) {
      this.setState({isSending: false});
      console.log(res.token);
      await AsyncStorage.setItem("admin", res.token);
      this.props.navigation.navigate("AdminHomepage");
    } else {
      this.setState({isSending: false});
      alert("Answer incorrect. Please try again.")
    }
  }

  render() {
    if (!this.state.err) {
        return (
          <View styles={styles.container}>
            <Text>Password confirmed! For security reasons, please enter the relevant answer to the provided security question!</Text>
            <Text>{this.state.question}</Text>
            <Input placeholder="Enter your answer here!" onChangeText={(text) => this.setState({answer: text})} />
            <Button title="Submit your answer!" loading={this.state.isSending} onPress={() => this.sendData()} />
            <Button title="Back to Login" onPress={ async () => {await AsyncStorage.removeItem("admin"); this.props.navigation.navigate("Login");}} />
          </View>
        );
    } else {
      return (
        <View style={styles.formContainer}>
          <Text>Sorry, the page has developed the following error:</Text>
          <Text>{this.state.err}</Text>
          <Button title="Go Back to Login" onPress={() => this.props.navigation.navigate("Login")}/>
        </View>
      )
    }
  }
}