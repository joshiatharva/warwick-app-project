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

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false,
      admin: false,
      isSending: false
    }
  }

  async componentDidMount() {
    var token = await AsyncStorage.getItem("id");
    var admin = await AsyncStorage.getItem("admin");
    if (token != null) {
      try {
        let response = await fetch('http://172.31.199.57:3000/auth/login', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
          }
        });
        let res = await response.json();
        if (res.success === "true") {
          this.props.navigation.navigate("Home");
          // console.log("Token present and valid");
        } else {
          if (res.msg == "Token expired") {
            this.setState({isVerified: false});
            // console.log("Token present, expired");
            await AsyncStorage.removeItem("id"); 
          }
        }
      } catch (err) {
        alert(err);
        // console.log(err);
      }
    } else {
      this.setState({isVerified: false});
      // console.log("Token not present");
    }
    if (admin != null) {
      try {
        let response = await fetch('http://172.31.199.57:3000/admin/login', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + admin
          }
        });
        let res = await response.json();
        if (res.success == true) {
          this.props.navigation.navigate("AdminHomepage");
          // console.log("Token present and valid");
        } else {
          this.setState({isVerified: false});
          // console.log("Token present, expired");

        }
      } catch (err) {
        alert(err);
        // console.log(err);
      }
    } else {
      this.setState({isVerified: false});
      // console.log("Token not present");
    }
  }

  async sendData() {
    this.setState({isSending: true});
    if (!this.state.admin) {
      try {
        let response = await fetch('http://172.31.199.57:3000/auth/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer'
          },
            body: JSON.stringify({
            "username": this.state.username,
            "password": this.state.password,
            "remember": this.state.remember
          })
        });
        let res = await response.json()
        if (res.success === "true") {
          const id_token = res.token;
          await AsyncStorage.setItem('id', id_token);
          // if (res.remember === true) {
          //   await AsyncStorage.setItem('remember', true);
          // }
          this.setState({isSending: false});
          this.props.navigation.navigate('Home');
        } else {
          console.log(res.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        let response = await fetch('http://172.31.199.57:3000/admin/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer'
          },
            body: JSON.stringify({
            "username": this.state.username,
            "password": this.state.password,
            "remember": this.state.remember
          })
        });
        let res = await response.json()
        if (res.success === "true") {
          console.log("success");
          await AsyncStorage.setItem('admin', res.token);
          // if (res.remember === true) {
          //   await AsyncStorage.setItem('remember', true);
          // }
          this.setState({isSending: false});
          this.props.navigation.navigate('AdminLogin');
        } else {
          console.log (res.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  render() {
      return (
        <ScrollView>
          <View style={styles.signInContainer}>
            <Text style={styles.signInLabel} status='control' category='h5'>Sign In</Text>
            <Button icon={<Icon name="arrow-right" size={12} color="white"/>} title="Sign Up    " containerStyle = {styles.signUpButton} type="clear" iconRight={true} titleStyle={{color: 'white'}} onPress={() => this.props.navigation.navigate("Register")} />
          </View>
          <View style={styles.formContainer}>
            <Input 
              placeholder='Username'  
              onChangeText={(item) => this.setState({username: item})} 
            />
            <Input 
              style={styles.passwordInput}
              placeholder='Password' 
              secureTextEntry={true} 
              onChangeText={(item) => this.setState({password: item})} 
            />
          </View>
          <CheckBox center title='Remember Me' checked={this.state.remember} checkedColor='blue' onPress={() => this.setState({remember: !this.state.remember})} />
          <CheckBox center title='I am an Admin' checked={this.state.admin} checkedColor='red' onPress={() => this.setState({admin: !this.state.admin})} />
          <Button style={styles.signinButton} title="Sign In" onPress={() => this.sendData()} loading={this.state.isSending} buttonStyle={styles.signinButton} />
          <View style={styles.forgotContainer}>
            <Button buttonStyle={styles.forgotButton} type="clear" title="Forgot Password?" onPress={() => this.props.navigation.navigate("Forgot")} style={styles.forgotButton}/>
          </View>
        </ScrollView>
        /* <Avatar rounded title="User" onPress={() => this.setState({admin: false})}/>
        <Avatar rounded title="Admin" onPress={() => this.setState({admin: true})}/> */ 
      );
    }
}
