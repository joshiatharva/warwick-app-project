import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Input, Card, Datepicker, TopNavigation, TabView, Divider} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../style/styles';
import { FlexStyleProps } from '@ui-kitten/components/ui/support/typings';

export default class ForgotPassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      username: "",
      received: false,
      error: false,
      emailFlag: false,
      usernameFlag: false
    }
  }
  
  async sendData() {
    if (this.state.username == '') {
      this.setState({ usernameFlag: true });
      if (this.state.email == '') {
        this.setState({ emailFlag: true });
      }
      return false;
    } else if (this.state.email == '') {
      this.setState({ emailFlag: true });
      return false;
    } else {
    const initialUrl = "exp://192.168.0.12/--/"
    let response = await fetch('http://192.168.0.12:3000/auth/forgot', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer"
      },
      body: JSON.stringify({
        "email": this.state.email,
        "url" : initialUrl,
        "path": "forgotpassword"
      })
    });
    let res = await response.json();
    if (res.msg == "/" && res.success == false) {
      this.setState({error: true});
      alert("You have already logged in and have a token present on your device. Please log into your account and reset your password from there!");
      this.props.navigation.goBack();
    }
    if (res.success == true) {
      this.setState({received: true}, () => console.log(this.state.received));
      await AsyncStorage.setItem("forgot_Token", res.msg);
      await AsyncStorage.setItem("id_token", res.id);
    } else {
      alert("Our email sending service might be down at this time. Please try again in a few minutes!");
      this.props.navigation.goBack();
    }
  }
    
  }

  render() {
    if (!this.state.received) {
      return (
        <View>
          <View style={styles.signInContainer}>
          <Button icon={<Icon name="arrow-left" size={12} color="white" />} containerStyle={styles.signUpButton}
            type="clear"
            titleStyle={{ color: 'white' }}
            style={styles.signUpButton} onPress={() => this.props.navigation.goBack()} />
          <Text category="h4" status="control">Forgot Password</Text>
          </View>
          <View style={{padding: 20}}>
            <Text>Please enter your username to receive your reset password link:</Text>
          </View>
          <View style={{padding: 10}}>
            <Input 
              placeholder="Enter your username here" 
              onChangeText={(item) => this.setState({username: item})} 
              status={(!this.state.usernameFlag) ? 'basic' : 'danger'}
              caption={(!this.state.usernameFlag) ? '' : 'Please provide your username'}
            />
            <View style={styles.container}></View>
            <Input placeholder="Enter your email here" onChangeText={(item) => this.setState({email: item})} status={(!this.state.emailFlag) ? 'basic' : 'danger'}
            caption={(!this.state.emailFlag) ? '' : 'Please provide your email'} />
          </View>
          <View style={styles.formContainer}>
          </View>
          <View style={{padding: 10, marginTop: 20}}>
            <Button style={styles.signInButton} type="outline"  title="Send link" onPress={() => this.sendData()} />
          </View>

      </View>
      );
    }
    if (this.state.received) {
      return (
        <View>
          <Text>Your email has been sent to your account at {this.state.email}!</Text>
        </View>
      );
    }
    if (this.state.error) {

    }
  }
}