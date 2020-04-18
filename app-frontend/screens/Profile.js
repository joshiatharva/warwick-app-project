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

export default class Profile extends Component {
  constructor(props) {
    super(props);
  }

  async handleLogout(){
    let token = await AsyncStorage.getItem("id");
    if (token != null) {
      let response = await fetch("http://192.168.0.12:3000/auth/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      let res = await response.json();
      if (res.success == true) {
        await AsyncStorage.removeItem("id");
        this.props.navigation.navigate("Login");
      }
    }
    let admin = await AsyncStorage.getItem("admin");
    if (admin != null) {
      let response2 = await fetch("http://192.168.0.16:3000/admin/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + admin
        }
      });
      let res2 = await response2.json();
      if (res2.success == true) {
        await AsyncStorage.removeItem("admin");
        this.props.navigation.navigate("Login");
      }
    }
  }


  render() {
    const list = [
      {
        title: 'View my scores',
        icon: 'graph',
        page: 'Statistics',
      },
      {
        title: 'My Account',
        icon: 'person',
        page: 'Account',
      },
      {
        title: 'General Settings',
        icon: 'settings',
        page: 'Settings',
      },
      {
        title: 'Edit Profile',
        icon: 'edit',
        page: 'Personal',

      }
    ];

    return (
      <ScrollView>
        {/* <Personal />
        <Settings />
        <Statistics />
        <Account /> */}
        {list.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            bottomDivider
            chevron
            onPress={() => this.props.navigation.navigate(item.page)}
          />
        ))
        }
        <Button containerStyle={styles.forgotButton} title="Logout" onPress={() => this.handleLogout()} />
      </ScrollView>
    );
  }
}