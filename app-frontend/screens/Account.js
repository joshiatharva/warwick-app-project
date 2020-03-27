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

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.user = [];
    this.state = {
      username: '',
      firstname: '',
      lastname: '',
      password: '',
      newpassword: '',  
      newpasswordconf: '',
      email: '',
      edit: false,
    }
  }

  async componentDidMount() {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch("http://192.168.0.12:3000/user/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      let res = await response.json();
      if (res.success == true) {
        this.setState({
          username: res.user.username,
          firstname: res.user.firstname,
          lastname: res.user.lastname,
          password: res.user.password,
          email: res.user.email
        });
      }
    }

  async sendData() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.16:3000/user/profile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        username: this.state.username, 
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email
      }),
    });
    let res = await response.json();
    if (res.success == true) {
      this.setState({
        username: req.body.username,
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        email: req.body.email
      });
      this.props.navigation.pop();
    } 
  }

  render() {
    return (
      <View>
        <Button title="Edit" onPress={() => this.setState({edit: !this.state.edit})} />
        <Text status='Control'>My details: </Text>
        <Text>Personal Information:</Text>
        <View>
          <Text>Username: {this.state.username}</Text>
          <Text>First Name: {this.state.firstname}</Text>
          <Text>Last Name: {this.state.lastname}</Text>
          <Text>Email address: {this.state.email}</Text>
        </View>
        {/* {this.state.edit && (
        // <View>
        //   <Input placeholder={this.state.username} label="Edit your username here" onEndEditing={(text) => this.setState({username: text})} />
        //   <Input placeholder={this.state.firstname} label="Edit your first name here:" onEndEditing={(text) => this.setState({firstname: text})}/>
        //   <Input placeholder={this.state.lastname} label="Edit your last name here:" onEndEditing={(text) => this.setState({lastname: text})} />
        //   <Input placeholder={this.state.email} label="Edit the email address used for correspondence" onEndEditing={(text) => this.setState({email: text})} />
        //   <Button title="Save changes" onPress={() => this.sendData()} />
        // </View>
        )} */}
      </View>
    );
  }
}