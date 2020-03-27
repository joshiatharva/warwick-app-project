import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
    welcome: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    rootcontainer: {
      backgroundColor: 'white',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200,
      backgroundColor: '#0080ff',
      width: WIDTH,
    },
    forgotPasswordLabel: {
      zIndex: 1,
      alignSelf: 'center',
      marginTop: 24,
      color: 'black',
    },
    signInContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      minHeight: 100,
      padding: 10,
      backgroundColor: '#0080ff'
    },
    formContainer: {
      flex: 1,
      marginTop: 48,
      padding: 10,
    },
    formCont: {
      flex: 1,
      justifyContent: 'space-between',
      marginTop: 24,
    },
    signInLabel: {
      flex: 1, 
    },
    fpContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: '#0080ff',
    },
    signUpButton: {
      flexDirection: 'row-reverse',
      paddingHorizontal: 0,
    }, 
    passwordInput: {
      marginTop: 16,
    },
    truefalseContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    forgotContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    forgotButton: {
      paddingHorizontal: 0,
    },
    signinButton: {
      marginHorizontal: 16,
    },
    // input: {
    //   width: WIDTH - 55,
    //   height: 40,
    //   borderRadius: 10,
    //   fontSize: 16,
    //   paddingLeft: 45,
    //   marginHorizontal: 25
    // },
    cardContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: WIDTH - 30,
    },  
    enterEmail: {
      zIndex: 1,
      alignSelf: 'center',
      marginTop: 64,
    }, 
    makequestion: {
      flex: 1,
      justifyContent: 'center'
    },
    list: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f0fff0'
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 5
    },
    question: {
      marginLeft: 10,
      marginBottom: 10, 
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    inlinebuttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: "relative",
      marginBottom: 10,
    },
    truefalse_buttons: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    itemStyle: {
      backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
      flex: 1,
      margin: 1,
      height: WIDTH / 2
    },
    truefalse_button: {
      flex: 1,
      height: 60, 
    },
    katex: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
  });