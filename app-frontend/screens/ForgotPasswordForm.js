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

export default class ForgotPasswordForm extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      passwordconf: "",
      isLoading: true,
      error: null
    }
  }

  handleDeepLink = (url) => {
    const { path, token } = Linking.parse(url);
    console.log("token = " + token);
  }

  async componentDidMount() {
    // var forgot = await AsyncStorage.getItem("forgot_Token");
    // Linking.addEventListener('url', this.handleDeepLink);
    // let response = await fetch(`http://172.31.199.57:3000/auth/reset/${forgot}`, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer'
    //   },
    // });
    // let res = await response.json();
    // this.setState({error: res.error});
  }

  async sendData() {
    let token = await AsyncStorage.getItem("forgot_Token");
    let id = await AsyncStorage.getItem("id_token");
    let response = await fetch(`http://172.31.199.57:3000:3000/auth/reset/${forgot}`, {
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
      this.props.navigation.navigate("Login");
    } else {
      if (res.typ == "token") {
        alert(res.msg);
        this.props.navigation.navigate("Login");
      }
      if (res.typ == "user") {
        alert(res.msg);
        this.props.navigation.navigate("Login");
      }
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