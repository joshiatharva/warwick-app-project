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
      this.setState({users: res.msg});
    } else {
      if (res.msg == "Token invalid") {
        this.props.navigation.navigate("Login");
        await AsyncStorage.removeItem("admin");
        alert("Unfortunately, your token has expired! Please sign in again here!");
      } else {
        this.props.navigation.navigate("Login");
        await AsyncStorage.removeItem("admin");
      }
    }
  }

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
    if (res.success == true) {
      alert("Your request has been submitted. "+ this.state.username +" will receive an email concerning their blacklist");
      this.setState({username: '', reason: '', date: null, users: []});
    } else {
      alert("Error occurred, please try again");
    }
    alert("Your request has been submitted. "+ this.state.username +" will receive an email concerning their blacklist");
  }

  render() {
    return (
      <View style={{justifyContent: 'center', marginTop: 10, padding: 10}}>
          <Text>Here is the facility for blacklisting users.</Text>
          <Text>
            NOTE: all blacklist actions require CLEAR and SIGNIFICANT actions against the University of Warwick's Policy.
            This justification will also be sent to the blacklisted user to understand the actions committed and for their chance to appeal the decision.
          </Text>
        <Datepicker backdropStyle={{marginRight: 0}}size='small' placeholder='Date to be banned until' date={this.state.date} onSelect={(newdate) => this.setState({date: newdate})} boundingMonth={false} />
        <Input placeholder="Enter the username here" onChangeText={(item) => this.setState({username: item})}/>
        <Input placeholder="Enter the justification for blacklisting this user here" multiline={true} numberOfLines={5} onChangeText={(text) => this.setState({reason: text})} />
        <Button title="Submit blacklist request" onPress={() => this.sendData()} />
      </View>
    );
  }
}