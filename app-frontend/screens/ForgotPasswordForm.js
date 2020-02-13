import React, { Component } from 'react';
import { View } from 'react-native';
import {  Input, Button } from 'react-native-elements';
import { Linking } from 'expo';


export default class ForgotPasswordForm extends Component {
    constructor() {
      super();
      this.state = {
        password: "",
        passwordconf: "",
        isLoading: true,
        error: null
      }
    }
  
    async componentDidMount() {
      Linking.addEventListener('url', this.handleDeepLink);
      let response = await fetch(`http://192.168.0.16:3000/auth/reset/${token}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer'
        },
      });
      let res = await response.json();
      this.setState({error: res.error});
    }
  
    async sendData() {
      let token = 12345;
      let response = await fetch(`http://192.168.0.16:3000:3000/auth/reset/${token}`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer'
  
        },
        body: JSON.stringify({
          "password": this.state.password,
          
        })
      });
      let res = await response.json();
      this.props.navigation.navigate("Home");
    }
  
    render() {
      return (
        <View>
          <Input placeholder="Enter your new password" onEndEditing={(item) => this.setState({password: item})} />
          <Input placeholder="Confirm your new password" onEndEditing={(item) => this.setState({passwordconf: item})} />
          <Button title="Submit" onPress={()=> this.sendData()} /> 
        </View>
      );
    }
  }