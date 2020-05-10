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

export default class AdminHome extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: [],
        scores: [],
        err: '',
        admin: false,
        questions: 5,
        // adminStats: [],
      }
    }
    /******************************** */
    /** Gets the admin token on load  */
    /** and sends a GET to get the    */
    /** relevant statistics, such as  */
    /** the new users created and the */
    /** new questions (to be added)   */
    /******************************** */
    async componentDidMount() {
      let admin = await AsyncStorage.getItem("admin");
      if (admin != null) {
        let response = await fetch('http://192.168.0.12:3000/admin/profile', {
          method: "GET",
          headers : {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + admin
          }
        });
        let res = await response.json();
        /**
         * If successful in retrieving, then make
         * another GET request to stats to get the
         * new questions - also sets model in state
         */
        if (res.success === true) {
          this.setState({user: res.msg, admin: true});
          let newResponse = await fetch('http://192.168.0.12:3000/admin/stats', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + admin
            }
          });
          let newRes = await newResponse.json();
          /**
           * If second call successful then save
           * questions in state too.
           */
          if (newRes.success == true) {
            this.setState({questions: newRes.questions});
          }
            // this.getAdminData();
        } else {
          this.setState({err: res.msg});
          if (res.msg == "Token expired") {
            /**
             * Token expiry has occurred - 
             * remove the token and navigate back to Login.
             */
            await AsyncStorage.removeItem("admin");
            this.props.navigation.navigate("Login");
            alert("Unfortunately, your token has expired! Please sign in again.");
          } else {
            alert("Error occurred - please try again later.");
          }
        }
      }
    }
  
    /**
     * Renders the Admin Homepage
     */
    render() {
      return (
      // <DFADrawingComponent />
      <ScrollView>
        {/* <TopNavigation 
          title='Home'
          alignment='center'
        /> */}
        <View style={styles.headerContainer}>
          <Text>Welcome back,</Text>
          <Text category="h2">{this.state.user.username}!</Text> 
        </View>
        <View>
          <Text category="h1" status="basic">Dashboard</Text>
          <Text category="h6">Number of users:</Text>
          <Text>{this.state.questions}</Text>
          <Text category="h1">New Questions</Text>
          
        </View>
      </ScrollView>
      );
    }
  }