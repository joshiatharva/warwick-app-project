import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Input, Datepicker, TopNavigation, TabView} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";
import styles from '../style/styles';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      passwordconf: "",
      errorMsg: "",
      errorArray: null,
      firstnameFlag: false,
      lastnameFlag: false,
      emailFlag: false,
      emptyEmailFlag: false,
      usernameFlag: false,
      passwordFlag: false,
      passwordconfFlag: false,
    }
  }

  async sendData() {
    if (this.validateErrors() == true) {
      return;
    } else {
      try {
        let response = await fetch('http://192.168.0.12:3000/auth/register', {
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
          if (res.typ == "password" || res.typ == "email") {
            this.setState({errorMsg: res.msg});
          } else {
            this.setState({errorArray: res});
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  validateErrors() {
    if (this.state.firstname == '') {
      this.setState({firstnameFlag: true});
    }
    if (this.state.lastname == '') {
      this.setState({lastnameFlag: true});
    }
    if (this.state.email == '') {
      this.setState({emailFlag: true});
    }
    if (this.state.username == '') {
      this.setState({usernameFlag: true});
    }
    if(this.state.password == '') {
      this.setState({passwordFlag: true});
    }
    if(this.state.passwordconf == '') {
      this.setState({passwordconfFlag: true});
    }
    if (this.state.firstnameFlag || this.state.lastnameFlag || this.state.emailFlag || this.state.emptyEmailFlag || this.state.usernameFlag || this.state.passwordFlag || this.state.passwordconfFlag) {
      return true;
    } else {
      return false;
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
            {this.state.errorMsg != "" && (
                <View>
                  <Text style={styles.error}>{this.state.errorMsg}</Text>
                </View>
            )}
            {this.state.errorArray != null && (
              <View>
                {this.state.errorArray.map((item) => {
                  <Text style={styles.error}>{item.msg}</Text>
                })}
              </View>
            )}
            <Input 
              placeholder="First Name" 
              onChangeText={(item) => this.setState({firstname: item})} 
              status={(!this.state.firstnameFlag) ? 'basic': 'danger'}
              caption={(!this.state.firstnameFlag) ? '' : 'Please provide your given name'}
            />
            <Input 
              placeholder="Last Name" 
              onChangeText={(item) => this.setState({lastname: item})} 
              status={(!this.state.lastnameFlag) ? 'basic' : 'danger'}
              caption={(!this.state.lastnameFlag) ? '' : 'Please provide your surname'}
            />
            <Input placeholder="Email" onChangeText={(item) => this.setState({email: item})} 
              status={(!this.state.emailFlag || !this.state.emptyEmailFlag)  ? 'basic' : 'danger'}
              caption={(!this.state.emailFlag) ? (!this.state.emptyEmailFlag) ? '' : 'Please provide a valid email' : 'Please provide your email'}
            />
            <Input placeholder="Username" onChangeText={(item) => this.setState({username: item})} 
              status={(!this.state.lastnameFlag) ? 'basic' : 'danger'}
              caption={(!this.state.lastnameFlag) ? '' : 'Please provide your surname'}
            />
            <Input placeholder="Password" secureTextEntry={true} onChangeText={(item) => this.setState({password: item})} 
              status={(!this.state.lastnameFlag) ? 'basic' : 'danger'}
              caption={(!this.state.lastnameFlag) ? '' : 'Please provide your surname'}
            />
            <Input placeholder="Confirm Password" secureTextEntry={true} onChangeText={(item) => this.setState({passwordconf: item})} 
              status={(!this.state.lastnameFlag) ? 'basic' : 'danger'}
              caption={(!this.state.lastnameFlag) ? '' : 'Please provide your surname'}
            />
          </View>
          <Button onPress={() => this.sendData()} title ="Register now!" style={styles.signinButton} />
        </ScrollView> 
      );
  }
}
