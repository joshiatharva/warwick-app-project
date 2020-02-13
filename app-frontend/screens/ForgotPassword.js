import React, { Component } from 'react';
import { StyleSheet, Text, View,  FlatList, AsyncStorage, Picker, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert} from 'react-native';
import { SearchBar, CheckBox, Input, Button, ListItem, Icon, Card } from 'react-native-elements';

export default class ForgotPassword extends Component {
    constructor(props){
      super(props);
      this.state = {
        email: null,
        received: false,
        error: null
      }
    }
  
    async sendData() {
      let response = await fetch('http://192.168.0.16:3000/auth/forgot', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Basic"
        },
        body: JSON.stringify({
          "email": this.state.email,
          "url" : initialUrl,
          "path": "forgotpassword"
        })
      });
      let res = await response.json();
      if (!res.error) {
        this.setState({received: true, error: false});
      } else {
        this.setState({received: true, error: true});
      }
    }
  
    render() {
      if (!this.state.received && !this.state.error) {
        return (
          <View>
            <Text>Please enter your email to receive your reset password link:</Text>
            <Input placeholder="Enter your email here" onChangeText={(item) => this.setState({email: item})} />
            <Button raised title="Send link" onPress={() => this.sendData()} />
          </View>
        );
      } else if (this.state.received && !this.state.error) {
        <View>
          <Text>Your email has been sent to your account at {this.state.email}!</Text>
        </View>
      }
    }
  }