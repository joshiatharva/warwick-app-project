import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView, Input} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../../style/styles';

export default class BlacklistUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      reason: '',
      date: null,
      users: []
    }
  }

  /**
   * Gets a list of users - to be used when Autocomplete implemented.
   */
  async componentDidMount() {
    this.setState({date: new Date()});
    let adminToken = await AsyncStorage.getItem('admin');
    let response = await fetch('http://192.168.0.12:3000/admin/users', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminToken
      },
    });
    let res = await response.json();
    if (res.success == true) {
      /**
       * If successful then load users into state
       */
      this.setState({users: res.msg});
    } else {
      /**
       * Token expired - remove token from
       * storage and navigate back to Login
       */
      if (res.msg == "Token invalid") {
        this.props.navigation.navigate("Login");
        await AsyncStorage.removeItem("admin");
        alert("Unfortunately, your token has expired! Please sign in again here!");
      } else {
        /**
         * Server error occurred - 
         */
        alert("Unfortunaly, the server is down. Please try again later.");
      }
    }
  }

  /**
   * Sends blacklist request to the endpoint. 
   */
  async sendData() {
    let adminToken = await AsyncStorage.getItem("admin");
    let response = await fetch("http://192.168.0.12:3000/admin/blacklist", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        username: this.state.username,
        date: this.state.date, 
        reason: this.state.reason
      }),
    });
    let res = await response.json();
    /** 
     * If successful, then alert of success.
     */
    if (res.success == true) {
      alert("Your request has been submitted. "+ this.state.username +" will receive an email concerning their blacklist");
      this.setState({username: '', reason: '', date: null, users: []});
    } else {
      /**
       * The token is invalid - remove token from storage
       * and navigate back to the Login page.
       */
      if (res.msg == "Token invalid") {
        this.props.navigation.navigate("Login");
        await AsyncStorage.removeItem("admin");
        alert("Unfortunately, your token has expired! Please sign in again here!");
    }
    alert("Your request has been submitted. "+ this.state.username +" will receive an email concerning their blacklist");
  }
}

  render() {
    return (
      <View>
          <View style={styles.formContainer}></View>
          <Text style={{alignItems: 'center'}}>Here is the facility for blacklisting users.</Text>
          <Text>
            NOTE: all blacklist actions require CLEAR and SIGNIFICANT actions against the University of Warwick's Policy.
            This justification will also be sent to the blacklisted user to understand the actions committed and for their chance to appeal the decision.
          </Text>
        <View style={{padding: 10}}>
        <Datepicker backdropStyle={{padding:20}} size='small' placeholder='Date to be banned until' date={this.state.date} onSelect={(newdate) => this.setState({date: newdate})} boundingMonth={false} />
        </View>
        <View style={{marginTop:30, padding: 10}}>
          <Input placeholder="Enter the username here" onChangeText={(item) => this.setState({username: item})}/>
        </View>
        <View style={{marginTop:10, padding: 10}}>
        <Input placeholder="Enter the justification for blacklisting this user here" multiline={true} numberOfLines={5} onChangeText={(text) => this.setState({reason: text})} />
        </View>
        <Button title="Submit blacklist request" onPress={() => this.sendData()} />
      </View>
    );
  }
}