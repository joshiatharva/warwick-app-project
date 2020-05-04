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

export default class ForgotPasswordForm extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      passwordconf: "",
      isLoading: true,
      error: null,
      page: "",
      status: ""
    }
  }

  handleDeepLink = (url) => {
    const { path, token } = Linking.parse(url);
    console.log("token = " + token);
  }

  async componentDidMount() {
    // var forgot = await AsyncStorage.getItem("forgot_Token");
    // Linking.addEventListener('url', this.handleDeepLink);
    // let response = await fetch(`http://192.168.0.16:3000/auth/reset/${forgot}`, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer'
    //   },
    // });
    // let res = await response.json();
    // this.setState({error: res.error});
    this.handleDeepLink;
  }

  async sendData() {
    let token = await AsyncStorage.getItem("forgot_Token");
    let id = await AsyncStorage.getItem("id_token");
    let response = await fetch(`http://192.168.0.12:3000:3000/auth/reset/${token}`, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      },
      body: JSON.stringify({
        "user_id": id,
        "token": token,
        "password": this.state.password,
        "passwordconf": this.state.passwordconf,
      })
    });
    let res = await response.json();
    if (res.success == "true") {
      alert("Password successfully changed");
      this.setState({page: "Login", status: "Password changed"});
      this.props.navigation.navigate("Login");
    } else {
        alert(res.status + ":" + res.msg);
        this.setState({page: "Login", status: "Failed"});
        this.props.navigation.navigate("Login");
    }
  }

  render() {
    return (
      <View>
        <Input placeholder="Enter your new password" onEndEditing={(item) => this.setState({password: item})} />
        <Input placeholder="Confirm your new password" onEndEditing={(item) => this.setState({passwordconf: item})} />
        <Button title="Submit" onPress={()=> this.sendData()} /> 
      </View>
    );
  }
}