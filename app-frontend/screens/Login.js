import React, { Component } from 'react';
import { StyleSheet, View, FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Input, Datepicker, TopNavigation, TabView } from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../style/styles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false,
      admin: false,
      isSending: false,
      errorMsg: '',
      usernameFlag: false,
      passwordFlag: false,
      status: '',
    }
  }

  async componentDidMount() {
    this.setState({status: 'start'});
    var token = await AsyncStorage.getItem("id");
    // var admin = await AsyncStorage.getItem("admin");
    this.setState({status: 'end'});
    if (token != null) {
      this.setState({status: token})
      try {
        let response = await fetch('http://192.168.0.12:3000/auth/login', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        let res = await response.json();
        this.setState({status: "token"});
        if (res.success == true) {
          this.setState({status: 'valid'});
          this.props.navigation.navigate("HomeT");
          // alert("nav end");
        } else {
          if (res.msg == "Token expired") {
            this.setState({isSending: false});
            await AsyncStorage.removeItem("id");
            this.setState({status: 'removed'});
            console.log(this.state.status);
          }
        }
      } catch (err) {
        this.setState({status: "error"});

        // console.log(err);
      }
    } else {
      this.setState({ isSending: false, status: "no token"});
      console.log(this.state.status);
      // alert("Token not present");
    }
    // if (admin != null) {
    //   try {
    //     let response = await fetch('http://192.168.0.12:3000/admin/login', {
    //       method: 'GET',
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + admin
    //       }
    //     });
    //     let res = await response.json();
    //     if (res.success == true) {
    //       this.props.navigation.navigate("AdminHomepage");
    //       // console.log("Token present and valid");
    //     } else {
    //       this.setState({ isVerified: false });
    //       // console.log("Token present, expired");

    //     }
    //   } catch (err) {
    //     alert(err);
    //     // console.log(err);
    //   }
    // }
  }

  async sendData() {
    if (this.state.username == '') {
      this.setState({ usernameFlag: true, status: "no username"});
      if (this.state.password == '') {
        this.setState({ passwordFlag: true, status: "no password" });
      }
      return false;
    } else if (this.state.password == '') {
      this.setState({ passwordFlag: true, status: "no password" });
      return false;
    } else {
      this.setState({ isSending: true, status: "start"});
      if (!this.state.admin) {
        try {
          let response = await fetch('http://192.168.0.12:3000/auth/login', {
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
          let res = await response.json();
          if (res.success == true) {
            const id_token = res.token;
            await AsyncStorage.setItem('id', id_token);
            // if (res.remember === true) {
            //   await AsyncStorage.setItem('remember', true);
            // }
            this.setState({ isSending: false, errorMsg: '', status: id_token});
            this.props.navigation.navigate('HomeT');
            return "HomeT"
          } else {
            this.setState({ isSending: false, errorMsg: res.msg, status: "error" });
            return false;
          }
        } catch (err) {
          console.log(err);
          alert("Network is down. Please try again");
        }
      } else {
        try {
          let response = await fetch('http://192.168.0.12:3000/admin/login', {
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
          if (res.success == true) {
            await AsyncStorage.setItem('admin', res.token);
            // if (res.remember === true) {
            //   await AsyncStorage.setItem('remember', true);
            // }
            this.setState({ isSending: false, status: 'admin success'});
            this.props.navigation.navigate('AdminLogin');
            return 'AdminLogin';
          } else {
            this.setState({isSending: false, status: "no account"});
            alert("Account not found - please try again");
          }
        } catch (err) {
          console.log(err);
          alert("Network is down - please try again");
        }
      }
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.signInContainer}>
          <Text style={styles.signInLabel} status='control' category='h5'>Sign In</Text>
          <Button
            // icon={<Icon name="arrow-right" size={12} color="white"/>} 
            title="Sign Up"
            containerStyle={styles.signUpButton}
            type="clear"
            iconRight={true}
            titleStyle={{ color: 'white' }}
            onPress={() => this.props.navigation.navigate("Register")} />
        </View>
        {this.state.errorMsg != ''}
        <View style={styles.formContainer}>
          <Input
            label="Enter Your Username"
            placeholder='Username'
            onChangeText={(item) => this.setState({ username: item })}
            status={(!this.state.usernameFlag) ? 'basic' : 'danger'}
            caption={(!this.state.usernameFlag) ? '' : 'Please provide your username'}
          />
          <Input
            label="Enter Your Password"
            style={styles.passwordInput}
            placeholder='********'
            secureTextEntry={true}
            status={(!this.state.passwordFlag) ? 'basic' : 'danger'}
            caption={(!this.state.passwordFlag) ? '' : 'Please provide your password'}
            onChangeText={(item) => this.setState({ password: item })}
          />
        </View>
        <CheckBox center title='Remember Me' checked={this.state.remember} checkedColor='blue' onPress={() => this.setState({ remember: !this.state.remember })} />
        <CheckBox center title='I am an Admin' checked={this.state.admin} checkedColor='red' onPress={() => this.setState({ admin: !this.state.admin })} />
        <Button style={styles.signinButton} title="Sign In" onPress={() => this.sendData()} loading={this.state.isSending} buttonStyle={styles.signinButton} />
        <View style={styles.forgotContainer}>
          <Button buttonStyle={styles.forgotButton} type="clear" title="Forgot Password?" onPress={() => this.props.navigation.navigate("Forgot")} style={styles.forgotButton} />
        </View>
      </ScrollView>
      /* <Avatar rounded title="User" onPress={() => this.setState({admin: false})}/>
      <Avatar rounded title="Admin" onPress={() => this.setState({admin: true})}/> */
    );
  }
}
