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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      passwordconf: ""
    }
  }

  async sendData() {
      try {
        let response = await fetch('http://172.31.199.57:3000/auth/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer'
          },
          body: JSON.stringify({
            "firstname": this.state.firstname,
            "lastname": this.state.lastname,
            "username": this.state.username,
            "password": this.state.password,
            "passwordconf": this.state.passwordconf,
            "email": this.state.email
          })
        });
        let res = await response.json();
        console.log(res);
        if (res.success === true) {
          const id_token = res.token;
          await AsyncStorage.setItem('id', id_token);
          this.props.navigation.navigate('Home');
        } else {
          alert(res.errors);
        }
      } catch (err) {
        console.log(err);
      }
  }

  render() {
      return (
        <ScrollView>
          <View style={styles.signInContainer}>
            <Text style={styles.signInLabel} status="control" category="h4" >Sign Up</Text>
            <Button icon={<Icon name="arrow-left" size={12} color="white" />} type="clear" titleStyle={{color: "white"}} title="Sign In" onPress={() => this.props.navigation.goBack()} />
          </View>
          <View style={styles.formContainer}>
            <Input placeholder="First Name" onChangeText={(item) => this.setState({firstname: item})} />
            <Input placeholder="Last Name" onChangeText={(item) => this.setState({lastname: item})} />
            <Input placeholder="Email" onChangeText={(item) => this.setState({email: item})} />
            <Input placeholder="Username" onChangeText={(item) => this.setState({username: item})} />
            <Input placeholder="Password" secureTextEntry={true} onChangeText={(item) => this.setState({password: item})} />
            <Input placeholder="Confirm Password" secureTextEntry={true} onChangeText={(item) => this.setState({passwordconf: item})} />
          </View>
          <Button onPress={() => this.sendData()} title ="Register now!" />
        </ScrollView> 
      );
  }
}
