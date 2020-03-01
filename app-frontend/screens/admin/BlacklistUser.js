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


export default class BlacklistUsers extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user_id: '',
        reason: '',
        date: null,
      }
    }
  
    async componentDidMount() {
      this.setState({date: new Date()});
    }
  
    render() {
      return (
        <View>
          <Text>Here is the facility for blacklisting users.</Text>
          <Text>
            NOTE: all blacklist actions require CLEAR and SIGNIFICANT actions against the University of Warwick's Policy.
            This justification will also be sent to the blacklisted user to understand the actions committed and for their chance to appeal the decision.
          </Text>
  
          <Input />
          <Input placeholder="Enter the justification for blacklisting this user here" multiline={true} numberOfLines={5} onChangeText={(text) => this.setState({reason: text})} />
          <Datepicker placeholder='Date to be banned until' date={this.state.date} onSelect={(newdate) => this.setState({date: newdate})} boundingMonth={false} />
        </View>
      );
    }
  }