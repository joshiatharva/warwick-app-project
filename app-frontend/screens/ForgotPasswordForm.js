import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView, Input} from '@ui-kitten/components';
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
      status: "",
      emptyPasswordConfFlag: false,
      emptyPasswordFlag: false,
    }
  }

  handleDeepLink = (url) => {
    const { path, token } = Linking.parse(url);
    console.log("token = " + token);
  }

  async componentDidMount() {
    /*************************************************** */
    /** Implementation for extracting token from the URL */
    /** Hard to test and conceive as the URL is not explictly shown */
    /************************************************************** */

    this.handleDeepLink;
  }

  /************************************************************ */
  /** Sends new password data to /reset/, given that endpoint   */
  /** verifies user requested a password change and is the      */
  /** correct user (verified by the token sent by the endpoint) */
  /************************************************************ */
  async sendData() {
    /**
     * If password and/or password confirmation do not match
     * or are both empty, then return validation messages and
     * return false
     */
    if (this.state.password == "") {
      this.setState({emptyPasswordFlag: true});
      if (this.state.passwordconf == "") {
        this.setState({emptyPasswordConfFlag: true});
      }
      return false;
    } else if (this.state.passwordconf == "") {
      this.setState({emptyPasswordConfFlag: true});
      return false;
    } else if (this.state.password != this.state.passwordconf) {
      return false; 
    } else {
      /**
       * Get both ID and forgot token (hash string) from AsyncStorage
       * with password and password confirmation in the body
       */
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
      /**
       * Converts Response to JSON, if success is true then alert success
       * and navigate back to the Login page.
       */
      let res = await response.json();
      if (res.success == "true") {
        alert("Password successfully changed");
        this.setState({page: "Login", status: "Password changed"});
        this.props.navigation.navigate("Login");
      } else {
        /**
         * Server down - return back to Login.
         */
          alert(res.status + ":" + res.msg);
          this.setState({page: "Login", status: "Failed"});
          this.props.navigation.navigate("Login");
      }
    }
  }

  /************************************** */
  /** Renders the Forgot Password Form UI */
  /************************************** */
  render() {
    return (
      <View>
        <View style={styles.signInContainer}>
          <Text category="h4" status="control">Change your Password</Text>
        </View>
        <View style={{padding: 20, marginTop: 30}}>
          {this.state.password != this.state.passwordconf && (
            <Text status='danger'>Passwords do not match!</Text>
          )}
          <Input 
            label="Enter New Password"
            placeholder='********'
            secureTextEntry={true}
            onChangeText={(item) => this.setState({password: item})}
            status={(!this.state.emptyPasswordFlag) ? 'basic' : 'danger'}
            caption={(!this.state.emptyPasswordFlag) ? '' : "Please enter a password"}
          />
          <View style={{marginTop: 20}} />
          <Input
            label="Confirm New Password" 
            placeholder='********'
            secureTextEntry={true}
            onChangeText={(item) => this.setState({passwordconf: item})} 
            status={(!this.state.emptyPasswordConfFlag) ? 'basic' : 'danger'}
            caption={(!this.state.emptyPasswordConfFlag) ? '' : "Please enter a password"}  
          />
        </View>
        <View style={{marginTop: 90, padding: 20}}>
          <Button title="Submit" onPress={()=> this.sendData()} /> 
        </View>
      </View>
    );
  }
}