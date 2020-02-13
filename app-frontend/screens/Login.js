import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false,
    }
  }

  async sendData() {
    console.log(`Username: ${this.state.username}\nPassword: ${this.state.password}\nRemember: ${this.state.remember}`);
    try {
      let response = await fetch('http://192.168.0.16:3000/auth/login', {
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
      if (res.success === "true") {
        const id_token = res.token;
        await AsyncStorage.setItem('id', id_token);
        // if (res.remember === true) {
        //   await AsyncStorage.setItem('remember', true);
        // }
        this.props.navigation.navigate('Home');
        console.log(res);
      } else {
        console.log (res.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    if (this.state.isVerified) {
      this.props.navigation.navigate("Home");
      return null;
    } else {
      return (
        <View style={styles.container}>
          <Input placeholder='Username' style={{backgroundColor: 'red'}} onChangeText={(item) => this.setState({username: item})} />
          <Input placeholder='Password' secureTextEntry={true} onChangeText={(item) => this.setState({password: item})} />
          <CheckBox center title='Remember Me' checked={this.state.remember} checkedColor='blue' onPress={() => this.setState({remember: !this.state.remember})}/>
          <Button title="Signin" onPress={() => this.sendData()} />
        </View>
      );
    }
  }
}
  