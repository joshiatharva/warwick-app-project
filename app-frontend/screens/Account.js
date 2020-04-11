import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal, KeyboardAvoidingView } from 'react-native';
import { SearchBar, CheckBox, ListItem, Slider } from 'react-native-elements';
import { ApplicationProvider, Select, Text, Button, Card, Datepicker, TopNavigation, Input, TabView, Toggle, Spinner} from '@ui-kitten/components';
import styles from '../style/styles';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.user = [];
    this.state = {
      username: '',
      firstname: '',
      lastname: '',
      password: '',
      newpassword: '',  
      newpasswordconf: '',
      email: '',
      edit: false,
      isSending: false,
      tempusername: '',
      tempfirstname: '',
      templastname: '',
      tempemail: '',
    }
  }

  async componentDidMount() {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch("http://192.168.0.12:3000/user/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      let res = await response.json();
      if (res.success == true) {
        this.setState({
          username: res.user.username,
          firstname: res.user.firstname,
          lastname: res.user.lastname,
          password: res.user.password,
          email: res.user.email,
          tempusername: res.user.username,
          tempfirstname: res.user.firstname,
          templastname: res.user.lastname,
          tempemail: res.user.email
        });
      } else {
        if (res.msg == "Token expired") {
          await AsyncStorage.removeItem("id");
          this.props.navigation.navigate("Login");
        }
      }
    }

  async sendData() {
    this.setState({isSending: true});
    console.log("Endpoint hit");
    console.log(this.state.tempfirstname + " " + this.state.templastname + " " + this.state.tempemail + " " + this.state.tempusername);
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.12:3000/user/profile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        username: this.state.tempusername, 
        firstname: this.state.tempfirstname,
        lastname: this.state.templastname,
        email: this.state.tempemail
      })
    });
    console.log("Endpoint done");
    let res = await response.json();
    if (res.success == true) {
      alert("Details sent");
      this.setState({
        username: res.msg.username,
        firstname: res.msg.firstname, 
        lastname: res.msg.lastname, 
        email: res.msg.email,
        edit: false, 
        isSending: false
      });
    } else {
      // if (res.msg == "Token expired") {
      //   await AsyncStorage.removeItem("id");
      //   this.props.navigation.navigate("Login");
      // }
    }
    console.log("Endpoint done");
  }


  render() {
    return (
      <ScrollView>
        <View>
          <Toggle text='Edit Profile' status='basic' checked={this.state.edit} onChange={() => this.setState({edit: !this.state.edit}, () => console.log(this.state.edit))}/>
        </View>
        <Text category='h2'>My details: </Text>
        <Text>Personal Information:</Text>
        <View>
          <Input placeholder={this.state.username} size='large' label="Your current username" disabled={!this.state.edit} style={styles.accountInput} onChangeText={(item) => this.setState({tempusername: item})}/>
          <Input placeholder={this.state.firstname} size='large'label="You current firstname" disabled={!this.state.edit} style={styles.accountInput} onChangeText={(item) => this.setState({tempfirstname: item})}/>
          <Input placeholder={this.state.lastname} size='large' label="Your current lastname" disabled={!this.state.edit} style={styles.accountInput} onChangeText={(item) => this.setState({templastname: item})}/>
          <KeyboardAvoidingView>
          <Input placeholder={this.state.email} size='large' label="Your current email" disabled={!this.state.edit} style={styles.accountInput} onChangeText={(item) => this.setState({tempemail: item})}/>
          <Button appearance='outline' onPress={() => this.sendData()} disabled={!this.state.edit}>{!this.state.isSending ? "Edit Profile" : "Loading"}</Button> 
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    );
  }
}