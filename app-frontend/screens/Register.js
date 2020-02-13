import React, { Component } from 'react';
import { StyleSheet, Text, View,  FlatList, AsyncStorage, Picker, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert} from 'react-native';
import { SearchBar, CheckBox, Input, Button, ListItem, Icon, Card } from 'react-native-elements';

export default class Register extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        passwordconf: ""
      }
    }
  
    async sendData() {
        try {
          let response = await fetch('http://192.168.0.16:3000/auth/register', {
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
            alert(res.errors);
          }
        } catch (err) {
          console.log(err);
        }
    }
  
    render() {
        return (
          <ScrollView>
            <Input placeholder="First Name" onChangeText={(item) => this.setState({firstname: item})} />
            <Input placeholder="Last Name" onChangeText={(item) => this.setState({lastname: item})} />
            <Input placeholder="Email" onChangeText={(item) => this.setState({email: item})} />
            <Input placeholder="Username" onChangeText={(item) => this.setState({username: item})} />
            <Input placeholder="Password" secureTextEntry={true} onChangeText={(item) => this.setState({password: item})} />
            <Input placeholder="Confirm Password" secureTextEntry={true} onChangeText={(item) => this.setState({passwordconf: item})} />
            <Button onPress={() => this.sendData()} title ="Register now!" />
          </ScrollView> 
        );
    }
  }