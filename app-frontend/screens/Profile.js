import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { SearchBar, CheckBox, Button, ListItem, Slider, Input } from 'react-native-elements';
import styles from '../style/styles';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    }
  }

  /**********************************************************/
  /* Sends Request containing token to /logout/:token,      */
  /* which fills in the session object with signout = time  */
  /* that the endpoint was called, sets signout time and    */
  /* returns a ({msg: "Token expired"}) Response, which     */
  /* the method parses, upon which it deletes the token and */
  /* redirects the user back to the Login page              */
  /**********************************************************/

  async handleLogout(){
    /*************/
    /* GET TOKEN */
    /*************/
    let token = await AsyncStorage.getItem("id");
    /******************************** */
    /* If token exists, execute fetch */
    /******************************** */
    if (token != null) {
      let response = await fetch("http://192.168.0.12:3000/auth/logout/" + token, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer"
        }
      });
      /************************************************************** */
      /** Parse Response to see if Token expired message was returned */
      /************************************************************** */
      let res = await response.json();
      if (res.msg == "Token expired") {
        /********************************************************** */
        /* Remove the token from storage and navigate back to Login */
        /********************************************************** */
        await AsyncStorage.removeItem("id");
        /********************** */
        /* For testing purposes */
        /********************** */
        this.setState({status: "User"});
        this.props.navigation.navigate("Login");
      }
    }
    /************************************************************** */
    /* Does same thing but for admin tokens - no sessions recorded, */
    /* just last signout time is stored *************************** */
    /************************************************************** */
    let admin = await AsyncStorage.getItem("admin");
    if (admin != null) {
      let response2 = await fetch("http://192.168.0.12:3000/admin/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + admin
        }
      });
      /************************************************************** */
      /** Parse Response to see if Token expired message was returned */
      /************************************************************** */
      let res2 = await response2.json();
      if (res2.msg == "Token expired") {
        await AsyncStorage.removeItem("admin");
        this.setState({status: "Admin"});
        this.props.navigation.navigate("Login");
      }
    }
  }

  /******************************** */
  /** Renders each page as an item  */
  /** within a list *************** */
  /******************************** */
  render() {
    const list = [
      {
        title: 'View my scores',
        icon: 'graph',
        page: 'Statistics',
      },
      {
        title: 'View my Account',
        icon: 'person',
        page: 'Account',
      },
      {
        title: 'General Settings',
        icon: 'settings',
        page: 'Settings',
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