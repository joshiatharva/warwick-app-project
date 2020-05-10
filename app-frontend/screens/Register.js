import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert } from 'react-native';
import { SearchBar, CheckBox, Button, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ApplicationProvider, Select, Text, Card, Input, Datepicker, TopNavigation, TabView} from '@ui-kitten/components';
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
      passwordMismatchFlag: false,
      status: "",
    }
  }

  /******************************************** */
  /** Sends register data to /register endpoint */
  /******************************************** */
  async sendData() {
    /**
     * Checks for validation error -> if true then abort
     */
    if (this.validateErrors() == true) {
      return;
    } else {
      /**
       * Checks whether passwords match -> abort if true
       */
      if (this.state.passwordconf != this.state.password) {
        this.setState({passwordMismatchFlag: true});
        return;
      } else {
        try {
        /**
         * Send POST to /register/
         */
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
          /**
           * If successful, then set the token in 
           * AsyncStorage and redirect to the Home 
           * page. 
           */
          if (res.success === true) {
            const id_token = res.token;
            await AsyncStorage.setItem('id', id_token);
            this.setState({status: id_token});
            this.props.navigation.navigate('Home');
          } else {
            /**
             * In the case of error messages, display those errors 
             * by storing the messages in state.
             */
            if (res.typ == "password" || res.typ == "email") {
              this.setState({errorMsg: res.msg});
            } else {
              this.setState({errorArray: res});
            }
          }
        } catch (err) {
          /**
           * Server error occurred.
           */
          console.log(err);
          alert("A network error occurred. Please try again later.");
        }
      }
    }
  }

  /**
   * Validate all fields by checking for empty messages.
   */
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

  /**
   * Renders the Register form.
   */
  render() {
      return (
        <ScrollView>
          <View style={styles.signInContainer}>
            <Text style={styles.signInLabel} status="control" category="h4" >Sign Up</Text>
            <Button icon={<Icon name="arrow-left" size={12} color="white" />} type="clear" titleStyle={{color: "white"}} title="Sign In" onPress={() => this.props.navigation.goBack()} />
          </View>
          <View style={styles.formContainer}>
            {/* {this.state.errorArray != null && (
              <View>
                {this.state.errorArray.map((item) => {
                  <Text style={styles.error}>{item.msg}</Text>
                })}
              </View>
            )} */}
            {(this.state.passwordconf != this.state.password) && (
              <View style={{alignItems: 'center', marginBottom: 20}}>
                <Text status="danger">Passwords do not match!</Text>
              </View>
            )}
            <Input 
              label="Enter First Name"
              placeholder="First Name" 
              onChangeText={(item) => this.setState({firstname: item})} 
              status={(!this.state.firstnameFlag) ? 'basic': 'danger'}
              caption={(!this.state.firstnameFlag) ? '' : 'Please provide your given name'}
            />
            <Input 
              label="Enter Last Name"
              placeholder="Last Name" 
              onChangeText={(item) => this.setState({lastname: item})} 
              status={(!this.state.lastnameFlag) ? 'basic' : 'danger'}
              caption={(!this.state.lastnameFlag) ? '' : 'Please provide your surname'}
            />
            <Input label="Enter Your Email" placeholder="Email" onChangeText={(item) => this.setState({email: item})} 
              status={(!this.state.emailFlag && !this.state.emptyEmailFlag)  ? 'basic' : 'danger'}
              caption={(!this.state.emailFlag) ? (!this.state.emptyEmailFlag) ? '' : 'Please provide a valid email' : 'Please provide your email'}
            />
            <Input label="Enter Your Username" placeholder="Username" onChangeText={(item) => this.setState({username: item})} 
              status={(!this.state.usernameFlag) ? 'basic' : 'danger'}
              caption={(!this.state.usernameFlag) ? '' : 'Please provide a username'}
            />
            <Input label="Enter New Password" placeholder="Password" secureTextEntry={true} onChangeText={(item) => this.setState({password: item})} 
              status={(!this.state.passwordFlag) ? 'basic' : 'danger'}
              caption={(!this.state.passwordFlag) ? '' : 'Please provide a password'}
            />
            <Input label="Confirm Your Password" placeholder="Confirm Password" secureTextEntry={true} onChangeText={(item) => this.setState({passwordconf: item})} 
              status={(!this.state.passwordconfFlag && !this.state.passwordMismatchFlag) ? 'basic' : 'danger'}
              caption={(!this.state.passwordconfFlag) ? (!this.state.passwordMismatchFlag) ? '' : 'Please ensure the passwords match' : 'Please confirm the password'}
            />
          </View>
          <Button onPress={() => this.sendData()} title ="Register now!" style={styles.signinButton} />
        </ScrollView> 
      );
  }
}
