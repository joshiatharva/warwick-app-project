import React, { Component } from 'react';
import { StyleSheet, View, FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Input, Datepicker, TopNavigation, TabView } from '@ui-kitten/components';
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
      emptyFlag: false,
    }
  }

  /************************************** */
  /** Gets the specific security question */
  /** for the specified admin user.       */
  /************************************** */
  async componentDidMount() {
    this.setState({ isLoading: true })
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
      /**
       * Successful - loads the question
       * into state and sets loading to false to allow user input.
       */
      this.setState({ question: res.question, index: res.index, isLoading: false })
    } else {
      this.setState({ isLoading: false, err: res.msg });
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired!");
      } else {
        await AsyncStorage.removeItem("admin");
        this.props.navigation.navigate("Login");
        alert("Unfortunately, an error occurred. Please try again");
      }
    }
  }

  /******************************************** */
  /** Sends the answer to the security question */
  /******************************************** */
  async sendData() {
    if (this.state.answer == "") {
      this.setState({ emptyFlag: true })
    } else {
      this.setState({ isSending: true });
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
      /**
       * If question answered successfully,
       * overwrite temporary token with a full Admin 
       * token and navigate to the Home page.
       */
      if (res.success === true) {
        this.setState({ isSending: false });
        console.log(res.token);
        await AsyncStorage.setItem("admin", res.token);
        this.props.navigation.navigate("AdminHomepage");
      } else {
        /**
         * Answered incorrectly.
         */
        this.setState({ isSending: false });
        alert("Answer incorrect. Please try again.")
      }
    }

  }

  /**
   * Render the UI
   */
  render() {
    if (!this.state.err) {
      return (
        <View style={styles.formContainer}>
          <Text>Password confirmed! For security reasons, please enter the relevant answer to the provided security question!</Text>
          <Text style={{ justifyContent: 'center' }}>{this.state.question}</Text>
          <View style={{ marginTop: 30 }}></View>
          <Input
            placeholder="Enter your answer here!"
            onChangeText={(text) => this.setState({ answer: text })}
            status={!this.state.emptyFlag ? 'basic' : 'danger'}
            caption={!this.state.emptyFlag ? '' : 'Please provide an answer'}
          />
          <View style={{ marginTop: 30 }}></View>
          <Button title="Submit your answer!" loading={this.state.isSending} onPress={() => this.sendData()} />
          <View style={{ marginTop: 200 }}></View>
          <Button title="Back to Login" type="clear" onPress={async () => { await AsyncStorage.removeItem("admin"); this.props.navigation.navigate("Login"); }} />
        </View>
      );
    } else {
      return (
        <View style={styles.formContainer}>
          <Text>Sorry, the page has developed the following error:</Text>
          <Text>{this.state.err}</Text>
          <Button title="Go Back to Login" onPress={async () => {
            await AsyncStorage.removeItem("admin");
            this.props.navigation.navigate("Login");
          }
          } />
        </View>
      )
    }
  }
}