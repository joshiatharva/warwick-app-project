import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";

// import Welcome from './components/Welcome';
// import Home from './components/Home';
// import Login from './components/Login';
// import Questions from './components/Questions';
// import Quiz from './components/Quiz';

//"node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|@ui-kitten/.*|@eva-design/.*|react-native-elements/.*|react-native-chart-kit|react-native-vector-icons/.*|react-navigation-stack|react-navigation-tabs)"

import AppSwitch from './navigators/AppSwitch';

const WIDTH = Dimensions.get('window').width; 

const initialUrl = Linking.makeUrl('/');

class App extends Component {
  render() {
    return (
      <ApplicationProvider
        mapping={mapping}
        theme={light}
      >
        <AppContainer uriPrefix={initialUrl}/>
      </ApplicationProvider>
    );
  }
}

export default App;

// class Login extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: '',
//       password: '',
//       remember: false,
//       admin: false,
//       isSending: false,
//       errorMsg: '',
//     }
//   }

//   async componentDidMount() {
//     var token = await AsyncStorage.getItem("id");
//     var admin = await AsyncStorage.getItem("admin");
//     if (token != null) {
//       try {
//         let response = await fetch('http://192.168.0.16:3000/auth/login', {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token
//           }
//         });
//         let res = await response.json();
//         if (res.success === "true") {
//           this.props.navigation.navigate("Home");
//           // console.log("Token present and valid");
//         } else {
//           if (res.msg == "Token expired") {
//             this.setState({isVerified: false});
//             // console.log("Token present, expired");
//             await AsyncStorage.removeItem("id"); 
//           }
//         }
//       } catch (err) {
//         alert(err);
//         // console.log(err);
//       }
//     } else {
//       this.setState({isVerified: false});
//       // console.log("Token not present");
//     }
//     if (admin != null) {
//       try {
//         let response = await fetch('http://192.168.0.16:3000/admin/login', {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + admin
//           }
//         });
//         let res = await response.json();
//         if (res.success == true) {
//           this.props.navigation.navigate("AdminHomepage");
//           // console.log("Token present and valid");
//         } else {
//           this.setState({isVerified: false});
//           // console.log("Token present, expired");

//         }
//       } catch (err) {
//         alert(err);
//         // console.log(err);
//       }
//     }
//   }

//   async sendData() {
//     this.setState({isSending: true});
//     if (!this.state.admin) {
//       try {
//         let response = await fetch('http://192.168.0.16:3000/auth/login', {
//           method: 'POST',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer'
//           },
//             body: JSON.stringify({
//             "username": this.state.username,
//             "password": this.state.password,
//             "remember": this.state.remember
//           })
//         });
//         let res = await response.json();
//         if (res.success === "true") {
//           const id_token = res.token;
//           await AsyncStorage.setItem('id', id_token);
//           // if (res.remember === true) {
//           //   await AsyncStorage.setItem('remember', true);
//           // }
//           this.setState({isSending: false, errorMsg: ''});
//           this.props.navigation.navigate('Home');
//         } else {
//           this.setState({isSending: false, errorMsg: res.msg});
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     } else {
//       try {
//         let response = await fetch('http://192.168.0.16:3000/admin/login', {
//           method: 'POST',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer'
//           },
//             body: JSON.stringify({
//             "username": this.state.username,
//             "password": this.state.password,
//             "remember": this.state.remember
//           })
//         });
//         let res = await response.json()
//         if (res.success === "true") {
//           console.log("success");
//           await AsyncStorage.setItem('admin', res.token);
//           // if (res.remember === true) {
//           //   await AsyncStorage.setItem('remember', true);
//           // }
//           this.setState({isSending: false});
//           this.props.navigation.navigate('AdminLogin');
//         } else {
//           console.log (res.message);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   }

//   render() {
//       return (
//         <ScrollView>
//           <View style={styles.signInContainer}>
//             <Text style={styles.signInLabel} status='control' category='h5'>Sign In</Text>
//             <Button 
//               // icon={<Icon name="arrow-right" size={12} color="white"/>} 
//               title="Sign Up" 
//               containerStyle={styles.signUpButton} 
//               type="clear" 
//               iconRight={true} 
//               titleStyle={{color: 'white'}} 
//               onPress={() => this.props.navigation.navigate("Register")} />
//           </View>
//           <View style={styles.formContainer}>
//             <Input 
//               placeholder='Username'  
//               onChangeText={(item) => this.setState({username: item})} 
//             />
//             <Input 
//               style={styles.passwordInput}
//               placeholder='Password' 
//               secureTextEntry={true} 
//               onChangeText={(item) => this.setState({password: item})} 
//             />
//           </View>
//           {this.state.errorMsg != ''}
//           <CheckBox center title='Remember Me' checked={this.state.remember} checkedColor='blue' onPress={() => this.setState({remember: !this.state.remember})} />
//           <CheckBox center title='I am an Admin' checked={this.state.admin} checkedColor='red' onPress={() => this.setState({admin: !this.state.admin})} />
//           <Button style={styles.signinButton} title="Sign In" onPress={() => this.sendData()} loading={this.state.isSending} buttonStyle={styles.signinButton} />
//           <View style={styles.forgotContainer}>
//             <Button buttonStyle={styles.forgotButton} type="clear" title="Forgot Password?" onPress={() => this.props.navigation.navigate("Forgot")} style={styles.forgotButton}/>
//           </View>
//         </ScrollView>
//         /* <Avatar rounded title="User" onPress={() => this.setState({admin: false})}/>
//         <Avatar rounded title="Admin" onPress={() => this.setState({admin: true})}/> */ 
//       );
//     }
// }

// class AdminLogin extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       question: [],
//       isLoading: false,
//       isSending: false,
//       err: '',
//       answer: ','
//     }
//   }

//   async componentDidMount() {
//     this.setState({isLoading: true})
//     let token = await AsyncStorage.getItem("admin");
//     let response = await fetch("http://192.168.0.16:3000/admin/2fa", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + token
//       }
//     });
//     let res = await response.json();
//     if (res.success === true) {
//       this.setState({question: res.question, isLoading: false})
//     } else {
//       this.setState({isLoading: false, err: res.message});
//       if (res.msg == "Token expired") {
//         this.props.navigation.navigate("Login");
//         alert("Unfortunately, your token has expired!");
//       }
//     }
//   }

//   async sendData() {
//     this.setState({isSending: true});
//     let adminToken = await AsyncStorage.getItem("admin");
//     let response = await fetch("http://192.168.0.16:3000/admin/2fa", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + adminToken
//       },
//       body: JSON.stringify({
//         question: this.state.question,
//         answer: this.state.answer,
//       })
//     });
//     let res = await response.json();
//     if (res.success === true) {
//       this.setState({isSending: false});
//       this.props.navigation.navigate("AdminHomepage");
//     }
//   }

//   render() {
//     if (!this.state.err) {
//         return (
//           <View styles={styles.container}>
//             <Text>Password confirmed! For security reasons, please enter the relevant answer to the provided security question!</Text>
//             <Text>{this.state.question}</Text>
//             <Input placeholder="Enter your answer here!" onChangeText={(text) => this.setState({answer: text})} />
//             <Button title="Submit your answer!" loading={this.state.isSending} onPress={() => this.sendData()} />
//           </View>
//         );
//     } else {
//       return (
//         <View style={styles.formContainer}>
//           <Text>Sorry, the page has developed the following error:</Text>
//           <Text>{this.state.err}</Text>
//           <Button title="Go Back to Login" onPress={() => this.props.navigation.goBack()}/>
//         </View>
//       )
//     }
//   }
// }

// class Register extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//       firstname: "",
//       lastname: "",
//       email: "",
//       username: "",
//       password: "",
//       passwordconf: "",
//       errorMsg: "",
//       errorArray: null,
//     }
//   }

//   async sendData() {
//       try {
//         let response = await fetch('http://192.168.0.16:3000/auth/register', {
//           method: 'POST',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer'
//           },
//           body: JSON.stringify({
//             "firstname": this.state.firstname,
//             "lastname": this.state.lastname,
//             "username": this.state.username,
//             "password": this.state.password,
//             "passwordconf": this.state.passwordconf,
//             "email": this.state.email
//           })
//         });
//         let res = await response.json();
//         console.log(res);
//         if (res.success === true) {
//           const id_token = res.token;
//           await AsyncStorage.setItem('id', id_token);
//           this.props.navigation.navigate('Home');
//         } else {
//           if (res.typ == "password" || res.typ == "email") {
//             this.setState({errorMsg: res.msg});
//           } else {
//             this.setState({errorArray: res});
//           }
//         }
//       } catch (err) {
//         console.log(err);
//       }
//   }

//   render() {
//       return (
//         <ScrollView>
//           <View style={styles.signInContainer}>
//             <Text style={styles.signInLabel} status="control" category="h4" >Sign Up</Text>
//             <Button icon={<Icon name="arrow-left" size={12} color="white" />} type="clear" titleStyle={{color: "white"}} title="Sign In" onPress={() => this.props.navigation.goBack()} />
//           </View>
//           <View style={styles.formContainer}>
//             {this.state.errorMsg != "" && (
//                 <View>
//                   <Text style={styles.error}>{this.state.errorMsg}</Text>
//                 </View>
//             )}
//             {this.state.errorArray != null && (
//               <View>
//                 {this.state.errorArray.map((item) => {
//                   <Text style={styles.error}>{item.msg}</Text>
//                 })}
//               </View>
//             )}
//             <Input placeholder="First Name" onChangeText={(item) => this.setState({firstname: item})} />
//             <Input placeholder="Last Name" onChangeText={(item) => this.setState({lastname: item})} />
//             <Input placeholder="Email" onChangeText={(item) => this.setState({email: item})} />
//             <Input placeholder="Username" onChangeText={(item) => this.setState({username: item})} />
//             <Input placeholder="Password" secureTextEntry={true} onChangeText={(item) => this.setState({password: item})} />
//             <Input placeholder="Confirm Password" secureTextEntry={true} onChangeText={(item) => this.setState({passwordconf: item})} />
//           </View>
//           <Button onPress={() => this.sendData()} title ="Register now!" />
//         </ScrollView> 
//       );
//   }
// }

// class Home extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: [],
//       scores: [],
//       err: '',
//       admin: false,
//       // adminStats: [],
//     }
//   }

//   async componentDidMount() {
//     let token = await AsyncStorage.getItem("id");
//     if (token != null) {
//       let response = await fetch('http://192.168.0.16:3000/user/profile', {
//         method: "GET",
//         headers : {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Authorization": "Bearer " + token
//         }
//       });
//       let res = await response.json();
//       if (res.success === true) {
//         this.setState({user: res.user});
//         if (res.admin) {
//           console.log(res.admin);
//           this.setState({admin: true});
//           // this.getAdminData();
//         }
//       } else {
//         this.setState({err: res.message});
//         if (res.msg == "Token expired") {
//           this.props.navigation.navigate("Login");
//           alert("Unfortunately, your token has expired! Please sign in again.");
//         }
//       }
//     }
//   }

//   // async getData() {
//   //   let token = await AsyncStorage.getItem("id");
//   //   let response = await fetch('http://192.168.0.16:3000/user/today', {
//   //     method: 'GET',
//   //     headers: {
//   //       Accept: 'application/json',
//   //       'Content-Type': 'application/json',
//   //       'Authorization': 'Bearer ' + token,
//   //     }
//   //   })
//   // }

//   render() {
//     const chartConfig = {
//       backgroundGradientFrom: "#FFFFFF",
//       backgroundGradientFromOpacity: 0,
//       backgroundGradientTo: "#FFFFFF",
//       backgroundGradientToOpacity: 0.5,
//       color: (opacity = 1) => `rgba(0,181,204, ${opacity})`,
//       strokeWidth: 2, // optional, default 3
//       barPercentage: 0.5
//     };
//     const data={
//       labels: ["RL's", "CFL's", "TM's"],
//       data: [(5/7), (2/5), (1/3)],
//     };
//     return (
//     // <DFADrawingComponent />
//     <ScrollView>
//       <View style={styles.headerContainer}>
//         <Text>Welcome back,</Text>
//         <Text category="h2">{this.state.user.firstname}!</Text> 
//       </View>
//       <Text style={{textAlign: 'center', fontSize: 18, padding: 16, marginTop: 16}}>Your current success average is:</Text>
//       <ProgressChart
//           data={data}
//           width={WIDTH}
//           height={220}
//           chartConfig={chartConfig}
//           hideLegend={false}
//       />
//       <Text status="control" category="p2">Questions:</Text>
//       <Text>{this.state.questions_made_today} questions have been made today.</Text>
//       <Text>Let's get started with quizzing:</Text>
//       <Button title="Get Started!" onPress={() => this.props.navigation.navigate("Questions")} />
      
//     </ScrollView>
//     );
//   }
// }

// class AdminHome extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: [],
//       scores: [],
//       err: '',
//       admin: false,
//       questions: 5,
//       // adminStats: [],
//     }
//   }

//   async componentDidMount() {
//     let admin = await AsyncStorage.getItem("admin");
//     if (admin != null) {
//       let response = await fetch('http://192.168.0.16:3000/admin/profile', {
//         method: "GET",
//         headers : {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Authorization": "Bearer " + admin
//         }
//       });
//       let res = await response.json();
//       if (res.success === true) {
//         this.setState({user: res.msg, admin: true});
//         let newResponse = await fetch('http://192.168.0.16:3000/admin/stats', {
//           method: 'GET',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + admin
//           }
//         });
//         let newRes = await newResponse.json();
//         if (newRes.success == true) {
//           this.setState({questions: newRes.questions});
//         }
//           // this.getAdminData();
//       } else {
//         this.setState({err: res.msg});
//         if (res.msg == "Token expired") {
//           this.props.navigation.navigate("Login");
//           alert("Unfortunately, your token has expired! Please sign in again.");
//         }
//       }
//     }
//   }

//   render() {
//     return (
//     // <DFADrawingComponent />
//     <ScrollView>
//       <TopNavigation 
//         title='Home'
//         alignment='center'
//       />
//       <View style={styles.headerContainer}>
//         <Text>Welcome back,</Text>
//         <Text category="h2">{this.state.user.username}!</Text> 
//       </View>
//       <View>
//         <Text>Hello there</Text>
//         <Text>There are currently 1 new users signed up today!</Text>
//       </View>
//     </ScrollView>
//     );
//   }
// }

// class BlacklistUsers extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: '',
//       reason: '',
//       date: null,
//       users: []
//     }
//   }

//   async componentDidMount() {
//     this.setState({date: new Date()});
//     let adminToken = await AsyncStorage.getItem('admin');
//     let response = await fetch('http://192.168.0.16:3000/admin/users', {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + adminToken
//       },
//     });
//     let res = await response.json();
//     if (res.success == true) {
//       this.setState({users: res.msg});
//     } else {
//       if (res.msg == "Token invalid") {
//         this.props.navigation.navigate("Login");
//         await AsyncStorage.removeItem("admin");
//         alert("Unfortunately, your token has expired! Please sign in again here!");
//       } else {
//         this.props.navigation.navigate("Login");
//         await AsyncStorage.removeItem("admin");
//       }
//     }
//   }

//   async sendData() {
//     let adminToken = await AsyncStorage.getItem("admin");
//     let response = await fetch("http://192.168.0.16:3000/admin/blacklist", {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + adminToken,
//       },
//       body: JSON.stringify({
//         username: this.state.username,
//         date: this.state.date, 
//         reason: this.state.reason
//       }),
//     });
//     let res = await response.json();
//     if (res.success == "true") {
//       alert("Your request has been submitted. "+ this.state.username +" will receive an email concerning their blacklist");
//       this.setState({username: '', reason: '', date: null, users: []});
//     } else {
//       alert("Error occurred, please try again");
//     }
//     alert("Your request has been submitted. "+ this.state.username +" will receive an email concerning their blacklist");
//   }

//   render() {
//     return (
//       <View style={{justifyContent: 'center', marginTop: 10, padding: 10}}>
//           <Text>Here is the facility for blacklisting users.</Text>
//           <Text>
//             NOTE: all blacklist actions require CLEAR and SIGNIFICANT actions against the University of Warwick's Policy.
//             This justification will also be sent to the blacklisted user to understand the actions committed and for their chance to appeal the decision.
//           </Text>
//         <Datepicker backdropStyle={{marginRight: 0}}size='small' placeholder='Date to be banned until' date={this.state.date} onSelect={(newdate) => this.setState({date: newdate})} boundingMonth={false} />
//         <Input placeholder="Enter the username here" onChangeText={(item) => this.setState({username: item})}/>
//         <Input placeholder="Enter the justification for blacklisting this user here" multiline={true} numberOfLines={5} onChangeText={(text) => this.setState({reason: text})} />
//         <Button title="Submit blacklist request" onPress={() => this.sendData()} />
//       </View>
//     );
//   }
// }

// class ForgotPassword extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       email: null,
//       received: false,
//       error: false
//     }
//   }

//   async sendData() {
//     let response = await fetch('http://192.168.0.16:3000/auth/forgot', {
//       method: 'POST',
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer"
//       },
//       body: JSON.stringify({
//         "email": this.state.email,
//         "url" : initialUrl,
//         "path": "forgotpassword"
//       })
//     });
//     let res = await response.json();
//     if (res.message == "/") {
//       alert("You have already logged in and have a token present on your device. Please log into your account and reset your password from there!");
//       this.props.navigation.goBack();
//     }
//     if (res.success == "true") {
//       this.setState({received: true});
//       await AsyncStorage.setItem("forgot_Token", res.msg);
//       await AsyncStorage.setItem("id_token", res.id);
//     } else {
//       alert("Our email sending service might be down at this time. Please try again in a few minutes!");
//       this.props.navigation.goBack();
//     }
    
//   }

//   render() {
//     if (!this.state.received) {
//       return (
//         <View style={styles.container}>
//           <Button type="clear" onPress={() => this.props.navigation.goBack()} />
//           <Text style={styles.forgotPasswordLabel} category="h4" status="control">Forgot Password</Text>
//           <Text style={styles.enterEmail} status='control'>Please enter your username to receive your reset password link:</Text>
//           <View style={styles.formCont}>
//             <Input placeholder="Enter your username here" onChangeText={(item) => this.setState({email: item})} />
//           </View>
//           <Button type="outline" raised title="Send link" onPress={() => this.sendData()} />
//         </View>
//       );
//     }
//     if (this.state.received) {
//       return (
//         <View>
//           <Text>Your email has been sent to your account at {this.state.email}!</Text>
//         </View>
//       );
//     }
//     if (this.state.error) {

//     }
//   }
// }

// class ForgotPasswordForm extends Component {
//   constructor() {
//     super();
//     this.state = {
//       password: "",
//       passwordconf: "",
//       isLoading: true,
//       error: null
//     }
//   }

//   handleDeepLink = (url) => {
//     const { path, token } = Linking.parse(url);
//     console.log("token = " + token);
//   }

//   async componentDidMount() {
//     // var forgot = await AsyncStorage.getItem("forgot_Token");
//     // Linking.addEventListener('url', this.handleDeepLink);
//     // let response = await fetch(`http://192.168.0.16:3000/auth/reset/${forgot}`, {
//     //   method: 'GET',
//     //   headers: {
//     //     Accept: 'application/json',
//     //     'Content-Type': 'application/json',
//     //     'Authorization': 'Bearer'
//     //   },
//     // });
//     // let res = await response.json();
//     // this.setState({error: res.error});
//   }

//   async sendData() {
//     let token = await AsyncStorage.getItem("forgot_Token");
//     let id = await AsyncStorage.getItem("id_token");
//     let response = await fetch(`http://192.168.0.16:3000:3000/auth/reset/${forgot}`, {
//       method: "POST",
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer'

//       },
//       body: JSON.stringify({
//         "user_id": id,
//         "token": token,
//         "password": this.state.password,
//         "passwordconf": this.state.passwordconf,
//       })
//     });
//     let res = await response.json();
//     if (res.success == "true") {
//       this.props.navigation.navigate("Login");
//     } else {
//       if (res.typ == "token") {
//         alert(res.msg);
//         this.props.navigation.navigate("Login");
//       }
//       if (res.typ == "user") {
//         alert(res.msg);
//         this.props.navigation.navigate("Login");
//       }
//     }
//   }

//   render() {
//     return (
//       <View>
//         <Input placeholder="Enter your new password" onEndEditing={(item) => this.setState({password: item})} />
//         <Input placeholder="Confirm your new password" onEndEditing={(item) => this.setState({passwordconf: item})} />
//         <Button title="Submit" onPress={()=> this.sendData()} /> 
//       </View>
//     );
//   }
// }


// class Questions extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       questions: [],
//       isLoading: true,
//       error: null,
//       search: '',
//       filteredQuestions: [],
//     }
//   }

//   static navigationOptions = ({navigation}) => {
//     return {
//       headerRight: () => (
//         <Icon
//           name='plus'
//           size={20}
//           onPress={() => {navigation.navigate("MakeQuestion")}}
//           style={{marginRight: 10}}
//         />
//       ),
//     };
//   }

//   async componentDidMount() {
//     this.getQuestions();
//     //setInterval(() => this.getQuestions(), 2000);
//   }

//   async getQuestions() {
//     try {
//       const token = await AsyncStorage.getItem("id");
//       let response = await fetch('http://192.168.0.16:3000/questions/all', {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token
//         },
//       });
//       let json = await response.json();
//       this.setState({questions: json, filteredQuestions: json, isLoading: false});
//       if (res.msg == "Token expired") {
//         this.props.navigation.navigate("Login");
//         alert("Unfortunately, your token has expired! Please sign in again!");
//       }
//     } catch (err) {
//       this.setState({error: err}, () => console.log("Error: " + this.state.error));
//     }
//   }

//   // async getData() {
//   //   const token = await AsyncStorage.getItem("id");
//   //   try {
//   //     let response = await fetch(`http://192.168.0.16:3000/questions/${this.state.topic}/${this.state.search}`, {
//   //       method: 'GET',
//   //       headers: {
//   //         Accept: 'application/json',
//   //         'Content-Type': 'application/json',
//   //         'Authorization': 'Bearer ' + token,  
//   //       }
//   //     });
//   //     let res = await response.json();
//   //     if (res.msg == "Token expired") {
//   //       this.props.navigation.navigate("Login");
//   //       alert("Unfortunately, your token has expired! Please sign in again!");
//   //     }
//   //     if (res.success) {
//   //       this.setState({questions: res.json});
//   //     }
//   //     if (res.msg == "Token expired") {
//   //       this.props.navigation.navigate("Login");
//   //       alert("Unfortunately, your token has expired! Please sign in again!");
//   //     }
//   //   } catch (err) {
//   //     console.log("Error occurred: " + err);
//   //   }

//   // }

//   async saveQuestion(id) {
//     try {
//       const token = await AsyncStorage.getItem("id");
//       let response = await fetch('http://192.168.0.16:3000/questions/save',{
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token,
//         },
//         body: JSON.stringify({
//           "question_id": id
//         })
//       });
//       let res = await response.json();
//       if (res.success == true) {
//         console.log(res);
//       }
//       if (res.msg == "Token expired") {
//         this.props.navigation.navigate("Login");
//         alert("Unfortunately, your token has expired! Please sign in again!");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async viewQuestion(item) {
//     console.log(item);
//     this.props.navigation.navigate("ViewQuestion", {
//       id: item
//     });
//   }

//   getData = search => {
//     if (search == '') {
//       this.setState({filteredQuestions: this.state.questions, search: ''});
//     }
//     this.setState({search: search});
//     let filtered = this.state.filteredQuestions.filter(function(item) {
//       console.log(search + "+" +  (item.name.includes(search)).name);
//       return item.name.includes(search); 
//     });
//     console.log(filtered);
//     this.setState({filteredQuestions: filtered});
//   }

//   async resetData() { 
//     this.setState({filteredQuestions: this.state.questions, search: ''});
//   }

//   async _handleRefresh() {
//     this.setState({isLoading: true});
//     this.getQuestions();
//     this.setState({isLoading: false});
//   }


//   render() {
//     const data = [
//       {
//         index: 0,
//         screen: "Questions",
//       },
//       {
//         index: 1,
//         screen: "MakeQuestion",
//       }
//     ];
//       return (
//         <ScrollView refreshControl={<RefreshControl 
//           refreshing={this.state.isLoading}
//           onRefresh={() => this._handleRefresh()}/>
//         }>
//           {/* <TopNavigation 
//             title='Questions'
//             alignment='center'
//           /> */}
//           {/* <TabView 
//             selectedIndex={data.index}
//             onSelect={(item) => this.props.navigation.navigate(item.screen)}
//           >
//             <Tab></Tab>
//           </TabView> */}
//           <SearchBar 
//           value={this.state.search}
//           onChangeText={this.getData}
//           // onClearText={this.getData}
//           lightTheme
//           placeholder='Enter here....'
//           />
//           <FlatList 
//             data={this.state.filteredQuestions}
//             renderItem = {({item, index}) =>
//               <ListItem
//                 title={item.name}
//                 subtitle={item.topic}
//                 bottomDivider
//                 chevron
//                 onPress={() => this.viewQuestion(item)}
//               />
//             }
//             keyExtractor={(item, index) => index.toString()}
//           />
//         </ScrollView>
//       );
//   }
// }

// class AdminQuestions extends Component { 
//   constructor(props) {
//     super(props);
//     this.state = {
//       questions: [],
//       isLoading: true,
//       error: null,
//       search: '',
//       type: 'all'
//     }
//   }

//   async componentDidMount() {
//     this.getQuestions();
//   }

//   async sendData() {
//     const token = await AsyncStorage.getItem("id");
//     try {
//       let response = await fetch(`http://192.168.0.16:3000/questions/${this.state.type}/${this.state.search}`, {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token,  
//         }
//       });
//       let res = await response.json();
//       if (res.success) {
//         this.setState({questions: res.json});
//       }
//     } catch (err) {
//       // console.log("Error occurred: " + err);
//     }

//   }

//   async saveQuestion(id) {
//     try {
//       const token = await AsyncStorage.getItem("id");
//       let response = await fetch('http://192.168.0.16:3000/questions/save',{
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token,
//         },
//         body: JSON.stringify({
//           "question_id": id
//         })
//       });
//       let res = await response.json();
//       // console.log(res.message);
//     } catch (err) {
//       // console.log(err);
//     }
//   }

//   async getQuestions() {
//     try {
//       const token = await AsyncStorage.getItem("admin");
//       let response = await fetch('http://192.168.0.16:3000/questions/all', {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token
//         },
//       });
//       let json = await response.json();
//       this.setState({questions: json});
//     } catch (err) {
//       console.log("Error occured");
//       this.setState({error: err});
//     }
//   }
//   async _handleRefresh() {
//     this.setState({isLoading: true});
//     this.getQuestions();
//     this.setState({isLoading: false});
//   }

//   render() {
//       return (
//         <ScrollView refreshControl={<RefreshControl 
//           refreshing={this.state.isLoading}
//           onRefresh={() => this._handleRefresh()}
//           stickyIndices
//         />}>
//           <SearchBar 
//           onChangeText={(item) => this.setState({search: item})}
//           onClearText={()=> this.setState({search: ''})}
//           lightTheme
//           placeholder='Enter here....'
//           /> 
//           {/* Alert.alert('Add Question?', 'Add this Question to your Favourites?', [ {text: 'No', onPress: () => console.log("refused")}, {text: 'Yes', onPress: () => this.saveQuestion(item._id)}]) */}
//           <FlatList 
//             data={this.state.questions}
//             renderItem = {({item}) =>
//               <ListItem
//                 title={item.name}
//                 subtitle={item.topic}
//                 bottomDivider
//                 chevron
//                 onPress={() => this.props.navigation.navigate("AdminViewQuestion", {question: item})}
//               />
//             }
//             keyExtractor = {(item, index) => index.toString()}
//           />
//         </ScrollView>
//       );
//   }
// }

// class ViewQuestion extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       question: [],
//       q_type: '',
//     };
//   }

//   async componentDidMount() {
//     var qid = this.props.navigation.getParam('id');
//     console.log(qid);
//     this.setState({question: qid}); 
//   }

//   async saveQuestion(id) {
//     try {
//       const token = await AsyncStorage.getItem("id");
//       let response = await fetch('http://192.168.0.16:3000/questions/save',{
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token,
//         },
//         body: JSON.stringify({
//           "question_id": id
//         })
//       });
//       let res = await response.json();
//       if (res.success == true) {
//         alert("Question has been saved to Favourites!");
//       }
//       // console.log(res.message);
//     } catch (err) {
//       // console.log(err);
//     }
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//       <Card style={styles.container}>
//       <Text>Name: {this.state.question.name}</Text>
//         <Text>Topic: {this.state.question.topic}</Text>
//         <Text>Type of question: {this.state.question.type}</Text>
//         <Text>{this.state.question.accesses} people have tried this question!</Text>
//         <Text>Mean mark: {this.state.question.correct / this.state.question.accesses > 0 ? this.state.question.correct / this.state.question.accesses : 0}</Text>
//         <Button title="Add to Favourites" onPress={() => this.saveQuestion(this.state.question._id)} />
//       </Card>
//       </View>
//     );
//   }
// }

// class AdminViewQuestion extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       question: [],
//     }
//   }

//   async componentDidMount() {
//     this.setState({question: this.props.navigation.getParam("question")});
//   }

//   async saveQuestion(id) {
//     try {
//       const token = await AsyncStorage.getItem("id");
//       let response = await fetch('http://192.168.0.16:3000/admin/save',{
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token,
//         },
//         body: JSON.stringify({
//           "question_id": id
//         })
//       });
//       let res = await response.json();
//       // console.log(res.message);
//     } catch (err) {
//       // console.log(err);
//     }
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//           <Card style={styles.container}>
//           <Text status='control' category='h4'> Name: {this.state.question.name}</Text>
//           <Text>Topic: {this.state.question.topic}</Text>
//           <Text>Type: {this.state.question.type}</Text>
//           <Text>Question definition: {this.state.question.question}</Text>
//           <Text>Answer: {this.state.question.answer}</Text>
//           <Text>Solution: {this.state.question.solution}</Text>
//           <Text>{this.state.question.accesses} people have tried this question!</Text>
//           <Text>Mean mark: {this.state.question.correct / this.state.question.accesses}</Text>
//           <Button title="Edit Question" onPress={() => this.props.navigation.navigate("EditQuestion", { Question: this.state.question})} />
//           <Button title="Simulate" onPress={() => this.props.navigation.navigate("TestQuiz", {Question: this.state.question})} />
//         </Card>
//       </View>
//     );
//   }
// }

// class TestQuiz extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: true,
//       correct: false, 
//       answered: false,
//       value: "",
//       questions: [],
//       normalAnswer: "",
//       answer: ""
//     }
//   }

//   componentDidMount() {
//     this.setState({questions: this.props.navigation.getParam('Question'), isLoading: false}, () => console.log("Questions: " + this.state.questions));
//   }

//   isCorrect(value) {
//     // console.log("Value: " + value);
//     this.setState({
//       answered: true, answer: value, 
//     });
//     if (value === this.state.questions.answer) {
//       this.setState({correct: true}, () => {
//         this.props.navigation.navigate("CheckAnswer", {
//           Question: this.state.questions,
//           correct: this.state.correct,
//           chosenAnswer: value,
//         });
//       });
//     } else {
//       this.setState({correct: false}, () => {
//         this.props.navigation.navigate("CheckAnswer", {
//           Question: this.state.questions,
//           correct: this.state.correct,
//           chosenAnswer: value,
//         });
//       });

//     }
//   }

//   render() {
//     if (!this.state.isLoading) {
//       if (this.state.questions.type == "true_false") {
//         return (
//           <View style={styles.container}>
//             <Text>{this.state.questions.question}</Text>
//             <Button containerStyle={styles.truefalse_button} title="True" onPress={() => this.isCorrect("true")} />
//             <Button containerStyle={styles.truefalse_button} title="False" onPress={() => this.isCorrect("false")} />
//           </View>
//         );
//       } else if (this.state.questions.type == "multi_choice") {
//         return (
//           <View style={styles.container}>
//             <Text> {this.state.questions.question}</Text>
//             <View style={styles.inlinebuttons}>
//               <Button title={this.state.questions.options[0]} value={this.state.questions.options[0]} onPress={() => this.isCorrect(this.state.questions.options[0])} />
//               <Button title={this.state.questions.options[1]} value ={this.state.questions.options[1]} onPress={() => this.isCorrect(this.state.questions.options[1])} />
//             </View>
//             <View style={styles.inlinebuttons}>
//               <Button title={this.state.questions.options[2]} value={this.state.questions.options[2]} onPress={() => this.isCorrect(this.state.questions.options[2])} />
//               <Button title={this.state.questions.options[3]} value={this.state.questions.options[3]} onPress={() => this.isCorrect(this.state.questions.options[3])} />
//             </View>
//           </View>
//         );
//       } else if (this.state.questions.type == "normal_answer") {
//         return (
//           <View style={styles.container}>
//             <Text> {this.state.questions.question}</Text>
//             <Input placeholder="Answer here" onChangeText={(item) => this.setState({normalAnswer: item})}/>
//             <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
//           </View>
//         );
//       } else {
//         return (
//           <View style={styles.container}>
//             <Text> {this.state.questions.question}</Text>
//             <Input placeholder="Answer here" onChangeText={(answer) => this.setState({normalAnswer: answer})}/>
//             <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
//           </View>
//         );
//       }
//     } else {
//       return (
//         <View> 
//           <ActivityIndicator />
//           <Text>Loading Question.....This may take unknown time.</Text>
//         </View>
//       );
//     }
//   }
// }

// class CheckAnswer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       question: [],
//       correct: false,
//       selectedAnswer: "",
//       isSending: true
//     }
//   }

//   async componentDidMount() {  
//     // console.log("chosenAnswer" + this.props.navigation.getParam("chosenAnswer"));
//     // console.log(this.props.navigation.getParam("Question"));
//     // console.log(this.props.navigation.getParam("Question").options[0] + "This is the answer");
//     this.setState({
//       question: this.props.navigation.getParam("Question"),
//       correct: this.props.navigation.getParam("correct"),
//       selectedAnswer: this.props.navigation.getParam("chosenAnswer")
//     }, () => console.log(this.props.navigation.getParam("chosenAnswer") + "=" + this.state.selectedAnswer));
//     // const setParamsAction = NavigationActions.setParams({
//     //   params: {hideTabBar: true},
//     //   key: 'tab-name'
//     // });
//     // this.props.navigation.dispatch(setParamsAction);
//     // console.log("isSending: " + this.state.isSending);
//     // console.log("id: " + this.state.question._id);
//     // let token = await AsyncStorage.getItem("id");
//     // try {
//     //   let response = await fetch('http://192.168.0.16:3000/questions/marks', {
//     //     method: "POST",
//     //     headers: {
//     //       Accept: 'application/json',
//     //       "Content-Type": 'application/json',
//     //       "Authorization": "Bearer " + token,
//     //     },
//     //     body: JSON.stringify({
//     //       question_id: this.state.question._id,
//     //       correct: this.state.correct,
//     //       answer: this.state.answer
//     //     }),
//     //   });
//     //   let res = await response.json();
//     //   if (res.success === true) {
//     //     this.setState({isSending: false}); 
//     //   // } else {
//     //   //   this.props.navigation.navigate("Questions");
//     //   //   alert("Not done");
//     //   }
//     //   // }
//     // } catch (err) {
//     //   // console.log(err);
//     //   // console.log("Error occurred");
//     // }
//   }

//   selectedStyle(value) {
//     const styles = {};
//     if (value == this.state.selectedAnswer) {
//       styles.borderColor = 'blue';
//       styles.borderWidth = 0.5; 
//       if (value != this.state.question.answer) {
//         styles.backgroundColor = 'red';
//       }
//     }
//     if (value == this.state.question.answer) {
//       styles.backgroundColor = 'green';
//     }
//     return styles;
//   }

//   render() {
//     if (this.state.question.type === "true_false") {
//       return (
//         <View style={styles.container}>
//           <Text>{this.state.question.question}</Text>
//           <Button disabled title="True" disabledStyle={this.selectedStyle("True")} />
//           <Button disabled title="False" disabledStyle={this.selectedStyle("False")} />
//           <AnswerScheme isAnswered={true} answer={this.state.question.answer} answerScheme={this.state.question.solution} correct={this.state.correct} givenAnswer={this.state.selectedAnswer} />
//           <View>
//             <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
//           </View>
//         </View>
//       );
//     } else if (this.state.question.type === "multi_choice") {
//       return (
//         <View style={styles.container}>
//           <Text> {this.state.question.question}</Text>
//           <Button title={this.state.question.options[0]} value={this.state.question.options[0]} disabled disabledStyle={this.selectedStyle(this.state.question.options[0])} />
//           <Button title={this.state.question.options[1]} value={this.state.question.options[1]} disabled disabledStyle={this.selectedStyle(this.state.question.options[1])} />
//           <Button title={this.state.question.options[2]} value={this.state.question.options[2]} disabled disabledStyle={this.selectedStyle(this.state.question.options[2])} />
//           <Button title={this.state.question.options[3]} value={this.state.question.options[3]} disabled disabledStyle={this.selectedStyle(this.state.question.options[3])} />
//           <AnswerScheme isAnswered={true} givenAnswer={this.state.selectedAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
//           <View>
//             <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
//           </View>
//         </View>
//       );
//     } else if (this.state.question.type === "normal_answer") {
//       return (
//         <ScrollView>
//           <Text> {this.state.question.question}</Text>
//           <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle} />
//           <Button title="Check answer" disabled />
//           <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
//           <View>
//             <View>
//               <ActivityIndicator />
//               <Text>Just wait, your result is being sent!</Text>
//             </View>
//             <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
//           </View>
//         </ScrollView>
//       );
//     } else {
//       return (
//         <ScrollView>
//           <Text> {this.state.question.question}</Text>
//           <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle}/>
//           <Button title="Check answer" disabled/>
//           <AnswerScheme isAnswered={true} givenAnswer={this.state.chosenAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
//           <View>          
//             <Button title="Click here to go home!" onPress={() => this.props.navigation.popToTop()}/> 
//           </View>
//         </ScrollView>
//       );
//     }
//   }
// }

// class EditQuestion extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       id: null,
//       name: "",
//       question: "",
//       type: "",
//       topic: "",
//       options: [],
//       optionList: [],
//       option1: "",
//       option2: "",
//       option3: "",
//       option4: "",
//       answer: "",
//       solution: "",
//       difficulty: 1,
//       isLoading: false,
//       selectedType: "",
//     }
//   }

//   async componentDidMount() {
//     this.setState({
//       id: this.props.navigation.getParam("Question")._id,
//       name: this.props.navigation.getParam("Question").name,
//       question: this.props.navigation.getParam("Question").question,
//       topic: this.props.navigation.getParam("Question").topic,
//       option1:  this.props.navigation.getParam("Question").options[0],
//       option2: this.props.navigation.getParam("Question").options[1],
//       option3:this.props.navigation.getParam("Question").options[2],
//       option4: this.props.navigation.getParam("Question").options[3],
//       answer: this.props.navigation.getParam("Question").answer,
//       solution: this.props.navigation.getParam("Question").solution,
//       difficulty: this.props.navigation.getParam("Question").difficulty,
//     });
//     switch (this.state.type) {
//       case "true_false":
//         this.setState({selectedType: "True-False"});
//         break;
//         case "multi_choice":
//           this.setState({selectedType: "Multiple Choice"});
//           break;
//         case "normal_answer":
//           this.setState({selectedType: "Normal Answer"});
//           break;
//         default: 
//           this.setState({selectedType: "Normal Answer"});
//           break;
//     }
//     this.addToArray();
//     // let response = await fetch("http://192.168.0.16:3000/topics/all", {
//     //   method: 'GET',
//     //   headers: {
//     //     Accept: 'application/json',
//     //     'Content-Type': 'application/json'
//     //   },
//     // });
//     // let res = await response.json();
//     // if (res.success === true) {
//     //   for (i in res.topics) {
//     //     var element = {text: res.topics.name}
//     //     this.topics.push(element);
//     //   }
//     // } else {
      
//     // }
//   }

//   async editQuestion() {
//     let adminToken = await AsyncStorage.getItem("admin");
//     let response = await fetch('http://192.168.0.16:3000/admin/edit', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + adminToken,
//       },
//       body: JSON.stringify({
//         id: this.state.id,
//         name: this.state.name,
//         question: this.state.question,
//         topic: this.state.topic,
//         type: this.state.type,
//         options: this.state.options,
//         answer: this.state.answer,
//         solution: this.state.solution,
//         difficulty: this.state.difficulty,
//       })
//     });
//     let res = await response.json();
//     if (res.success === true) {
//       alert("Done");
//       this.props.navigation.goBack();
//     } else {
//       console.log("Not done");
//     }
//   }

//   addToArray() {
//     var objectArray = [];
//     var array = [this.state.option1, this.state.option2, this.state.option3, this.state.option4];
//     console.log(array);
//     for (var i = 0; i < array.length; i++) {
//       var object = {
//         text: array[i]
//       };
//       console.log("Opt: " + object);
//       objectArray[i] = (object);
//     }
//     this.setState({optionList: objectArray, options: array}, () => console.log("List: " + this.state.optionList + "\nOptions: " + this.state.options));
//     console.log(this.state.optionList);
//   }
  
//   async removeObject(item) {
//     var entry = item.text;
//     console.log(item.text);
//     this.setState({answer: entry});
//   }

//   async booleanToObject(item) {
//     var entry = item.text;
//     var boolean = false; 
//     if (entry === "True") {
//       boolean = true;
//     } else {
//       boolean = false;
//     }
//     this.setState({answer: boolean});
//   }

//   async addType(item) {
//     var entry = item.text;
//     this.setState({selectedType: entry});
//     console.log(item.text);
//     switch (entry) {
//       case "True-False":
//         this.setState({type: "true_false"});
//         break;
//       case "Multiple Choice":
//         this.setState({type: "multi_choice"});
//         break;
//       case "Normal Answer":
//         this.setState({type: "normal_answer"});
//         break;
//       default: 
//         this.setState({type: "normal_answer"});
//         break;
//     }
//   }
//   render() {
//     const types = [
//       {text: "True-False"},
//       {text: "Multiple Choice"},
//       {text: "Normal Answer"},
//     ];
//     const topics = [
//       {text: "Regular Languages"},
//       {text: "Context Free Languages"},
//       {text: "Turing Machines"},
//     ];
//     const boolean = [
//       {text: "True"},
//       {text: "False"}
//     ];
//     return (
//       <ScrollView>
//       <Text>Here we can make new questions!</Text>
//       <Input placeholder={this.state.name} onChangeText={(name) => this.setState({name: name})} />
//       <Input placeholder={this.state.question} multiline={true} onChangeText={(ques) => this.setState({question: ques})} />
//       <Text>Please select the question topic:</Text>
//       <Select
//           placeholder={this.state.topic}
//           data={topics}
//           selectedOption={this.state.topic}
//           onSelect={(item) => this.setState({topic: item.text}, () => console.log(this.state.topic))} 
//         />  
//         <Text>Please set a question type:</Text>
//         <Select
//           placeholder="Select Question Type"
//           data={types}
//           selectedOption={this.state.type}
//           onSelect={(item) => this.addType(item)}
//         />
//         {(this.state.selectedType == "Multiple Choice") && (
//         <View style={styles.container}> 
//           <Input placeholder="Option 1" onChangeText={(text) => this.setState({option1: text})} />
//           <Input placeholder="Option 2" onChangeText={(text) => this.setState({option2: text})} />
//           <Input placeholder="Option 3" onChangeText={(text) => this.setState({option3: text})} />
//           <Input placeholder="Option 4" onChangeText={(text) => this.setState({option4: text})} />
//           <Button raised type="outline" title="Set your options here!" onPress={() => this.addToArray()} />
//           <Text>Select your answer here!</Text>
//           <Text></Text>
//           <Select 
//             placeholder="Select Answer"
//             data={this.state.optionList}
//             selectedOption={this.state.answer}
//             onSelect={(object) => this.removeObject(object)}
//           />
//         </View>
//         )}
//         {(this.state.selectedType == "Normal Answer") && (
//         <View style={styles.container}>
//           <Text>No options required - move onto next field!</Text> 
//           <Input placeholder="Enter your answer here" onChangeText={(text) => this.setState({answer: text})} />
//         </View>
//         )}
//         {(this.state.selectedType == "True-False") && (
//           <View style={styles.container}>
//             <Button disabled title="True"/> 
//             <Button disabled title="False"/>
//             <Select
//               data={boolean}
//               selectedOption={this.state.answer}
//               onSelect={(object) => this.booleanToObject(object)}
//             />
//           </View>
//         )}
//       <View style={styles.container}>
//         <Input placeholder={this.state.solution} multiline={true} numberOfLines={5} maxLength={1000} onChangeText={(text) => this.setState({solution: text})} />
//       </View>
//       <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onSlidingComplete={(value) => this.setState({difficulty: value})} />
//       <Text>Difficulty: {this.state.difficulty}</Text>
//       <Button raised type="outline" style={styles.button} title="Submit question!" onPress={() => this.editQuestion()} />
//     </ScrollView>
//   );
//   }
// }

// class Favourites extends Component { 
//   constructor() {
//     super();
//     this.interval = null;
//     this.state = {
//       questions: [],
//       error: null,
//       isLoading: true,
//     }
//   }
  
//   async componentDidMount() {
//     this.getFavourites();
//   }

//   async getFavourites() {
//     try {
//       const token = await AsyncStorage.getItem("id");
//       const response = await fetch('http://192.168.0.16:3000/user/questions', {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token
//         },
//       });
//       const json = await response.json();
//       this.setState({questions: json, isLoading: false});
//       //console.log("Success on getting questions");
//     } catch (err) {
//       this.setState({error: err}, () => console.log("Error: " + this.state.error));
//     }
//   }
  

//   async sendData(item) {
//     try {
//       let token = await AsyncStorage.getItem("id");
//       let response = await fetch('http://192.168.0.16:3000/questions/log', {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token,
//         },
//         body: JSON.stringify({
//           id: item._id,
//         })
//       });
//       let res = await response.json();
//       // if (res.success == true) {
//         this.props.navigation.navigate("Quiz", {Question: item});
//       // } else {
//       //   alert("Connection lost");
//       //}
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   render() {
//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//           <FlatList 
//             data={this.state.questions}
//             renderItem = {({item, index}) => (
//                   <Card style={styles.cardContainer} onPress={() => this.sendData(item)}>
//                     <Text>{item.name}</Text>
//                     <Text>Topic: {item.topic}</Text>
//                     <Text>Difficulty: {item.difficulty}</Text>
//                   </Card>
//             )}
//             keyExtractor={(item, index) => index.toString()}
//           />
//         </ScrollView>
//     );
//   }
// }






// class MakeQuestion extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       name: '',
//       type: '',
//       question: '',
//       topic: '',
//       difficulty: 1,
//       content: '',
//       answer: '',
//       solution: '',
//       options: [],
//       optionList: [],
//       option1: '',
//       option2: '',
//       option3: '',
//       option4: '',
//       selectedType: '',
//     }
//   }

//   async sendData() {
//     if (this.state.type == "true_false") {
//       this.setState({options: [true, false]});
//     }
//     console.log(this.state.type);
//     try { 
//       var token = await AsyncStorage.getItem("id");
//       // console.log(this.state);
//       let response = await fetch('http://192.168.0.16:3000/questions/new', {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           "Content-Type": 'application/json',
//           "Authorization": "Bearer " + token
//         },
//         body: JSON.stringify({
//           name: this.state.name,
//           type: this.state.type,
//           question: this.state.question,
//           options: this.state.options,
//           difficulty: this.state.difficulty,
//           answer: this.state.answer,
//           solution: this.state.solution,
//           topic: this.state.topic
//         }),
//       });
//       let res = await response.json();
//       if (res.success == true) {
//         alert("Question made");
//       } else {
//         alert("Question not made");
//       }
//       this.props.navigation.navigate("Questions");
//     } catch (err) {
//       // console.log(err);
//       alert(err);
//     }
//   }

//   addToArray() {
//     var objectArray = [];
//     var array = [this.state.option1, this.state.option2, this.state.option3, this.state.option4];
//     console.log(array);
//     for (var i = 0; i < array.length; i++) {
//       var object = {
//         text: array[i]
//       };
//       console.log("Opt: " + object);
//       objectArray[i] = (object);
//     }
//     this.setState({optionList: objectArray, options: array}, () => console.log("List: " + this.state.optionList + "\nOptions: " + this.state.options));
//     console.log(this.state.optionList);
//   }
  
//   async removeObject(item) {
//     var entry = item.text;
//     console.log(item.text);
//     this.setState({answer: entry}, () => console.log(this.state.answer));
//   }

//   async booleanToObject(item) {
//     var entry = item.text;
//     var boolean = false; 
//     if (entry === "True") {
//       boolean = true;
//     } else {
//       boolean = false;
//     }
//     this.setState({answer: boolean}, () => console.log(this.state.answer));
//   }

//   async addType(item) {
//     var entry = item.text;
//     this.setState({selectedType: entry});
//     console.log(item.text);
//     switch (entry) {
//       case "True-False":
//         this.setState({type: "true_false"});
//         break;
//       case "Multiple Choice":
//         this.setState({type: "multi_choice"});
//         break;
//       case "Normal Answer":
//         this.setState({type: "normal_answer"});
//         break;
//       default: 
//         this.setState({type: "normal_answer"});
//         break;
//     }
//   }

//   render() {
//     const types = [
//       {text: "True-False"},
//       {text: "Multiple Choice"},
//       {text: "Normal Answer"},
//     ];
//     const topics = [
//       {text: "Regular Languages"},
//       {text: "Context Free Languages"},
//       {text: "Turing Machines"},
//     ];
//     const boolean = [
//       {text: "True"},
//       {text: "False"}
//     ];

//     return (
//       <ScrollView>
//         <Text>Here we can make new questions!</Text>
//         <Input placeholder="Question Title"  onChangeText={(name) => this.setState({name: name})} />
//         <Input placeholder="Name the question" multiline={true} onChangeText={(ques) => this.setState({question: ques})} />
//         <Text>Please select the question topic:</Text>
//         <Select
//           placeholder="Select Question Topic"
//           data={topics}
//           selectedOption={this.state.topic}
//           onSelect={(item) => this.setState({topic: item.text}, () => console.log(this.state.topic))} 
//         />  
//         <Text>Please set a question type:</Text>
//         <Select
//           placeholder="Select Question Type"
//           data={types}
//           selectedOption={this.state.type}
//           onSelect={(item) => this.addType(item)}
//         />
//         {(this.state.selectedType == "Multiple Choice") && (
//         <View style={styles.container}> 
//           <Input placeholder="Option 1" onChangeText={(text) => this.setState({option1: text})} />
//           <Input placeholder="Option 2" onChangeText={(text) => this.setState({option2: text})} />
//           <Input placeholder="Option 3" onChangeText={(text) => this.setState({option3: text})} />
//           <Input placeholder="Option 4" onChangeText={(text) => this.setState({option4: text})} />
//           <Button raised type="outline" title="Set your options here!" onPress={() => this.addToArray()} />
//           <Text>Select your answer here!</Text>
//           <Text></Text>
//           <Select 
//             placeholder="Select Answer"
//             data={this.state.optionList}
//             selectedOption={this.state.answer}
//             onSelect={(object) => this.removeObject(object)}
//           />
//         </View>
//         )}
//         {(this.state.selectedType == "Normal Answer") && (
//         <View style={styles.container}>
//           <Text>No options required - move onto next field!</Text> 
//           <Input placeholder="Enter your answer here" onChangeText={(text) => this.setState({answer: text})} />
//         </View>
//         )}
//         {(this.state.selectedType == "True-False") && (
//           <View style={styles.container}>
//             <Button disabled title="True"/> 
//             <Button disabled title="False"/>
//             <Select
//               data={boolean}
//               selectedOption={this.state.answer}
//               onSelect={(object) => this.booleanToObject(object)}
//             />
//           </View>
//         )}
//         <View style={styles.container}>
//           <Input placeholder="Solution to problem" multiline={true} numberOfLines={5} maxLength={1000} onChangeText={(text) => this.setState({solution: text})} />
//         </View>
//         <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onSlidingComplete={(value) => this.setState({difficulty: value})} />
//         <Text>Difficulty: {this.state.difficulty}</Text>
//         <Button raised type="outline" style={styles.button} title="Submit question!" onPress={() => this.sendData()} />
//       </ScrollView>
//     );
//   }
// }

// class Quiz extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: true,
//       correct: false, 
//       answered: false,
//       value: "",
//       questions: [],
//       normalAnswer: "",
//       answer: ""
//     }
//   }

//   componentDidMount() {
//     this.setState({questions: this.props.navigation.getParam('Question'), isLoading: false}, () => console.log("Questions: " + this.state.questions));
//   }

//   isCorrect(value) {
//     // console.log("Value: " + value);
//     this.setState({
//       answered: true, answer: value, 
//     });
//     if (value === this.state.questions.answer) {
//       this.setState({correct: true}, () => {
//         this.props.navigation.navigate("DataUpload", {
//           Question: this.state.questions,
//           correct: this.state.correct,
//           chosenAnswer: value,
//         });
//       });
//     } else {
//       this.setState({correct: false}, () => {
//         this.props.navigation.navigate("DataUpload", {
//           Question: this.state.questions,
//           correct: this.state.correct,
//           chosenAnswer: value,
//         });
//       });

//     }
//   }

//   render() {
//     if (!this.state.isLoading) {
//       if (this.state.questions.type == "true_false") {
//         return (
//           <View style={styles.container}>
//             <Text>{this.state.questions.question}</Text>
//             <Button title="True" onPress={() => this.isCorrect("true")} />
//             <Button title="False" onPress={() => this.isCorrect("false")} />
//           </View>
//         );
//       } else if (this.state.questions.type == "multi_choice") {
//         return (
//           <View style={styles.container}>
//             <Text> {this.state.questions.question}</Text>
//             <View style={styles.inlinebuttons}>
//               <Button title={this.state.questions.options[0]} value={this.state.questions.options[0]} onPress={() => this.isCorrect(this.state.questions.options[0])} />
//               <Button title={this.state.questions.options[1]} value ={this.state.questions.options[1]} onPress={() => this.isCorrect(this.state.questions.options[1])} />
//             </View>
//             <View style={styles.inlinebuttons}>
//               <Button title={this.state.questions.options[2]} value={this.state.questions.options[2]} onPress={() => this.isCorrect(this.state.questions.options[2])} />
//               <Button title={this.state.questions.options[3]} value={this.state.questions.options[3]} onPress={() => this.isCorrect(this.state.questions.options[3])} />
//             </View>
//           </View>
//         );
//       } else if (this.state.questions.type == "normal_answer") {
//         return (
//           <View style={styles.container}>
//             <Text> {this.state.questions.question}</Text>
//             <Input placeholder="Answer here" onChangeText={(item) => this.setState({normalAnswer: item})}/>
//             <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
//           </View>
//         );
//       } else {
//         return (
//           <View style={styles.container}>
//             <Text> {this.state.questions.question}</Text>
//             <Input placeholder="Answer here" onChangeText={(answer) => this.setState({normalAnswer: answer})}/>
//             <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
//           </View>
//         );
//       }
//     } else {
//       return (
//         <View> 
//           <ActivityIndicator />
//           <Text>Loading Question.....This may take unknown time.</Text>
//         </View>
//       );
//     }
//   }
// }

// class Profile extends Component {
//   constructor(props) {
//     super(props);
//   }

//   async _handleLogout(){
//     let token = await AsyncStorage.getItem("id");
//     if (token != null) {
//       let response = await fetch("http://192.168.0.16:3000/auth/logout", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Authorization": "Bearer " + token
//         }
//       });
//       let res = await response.json();
//       await AsyncStorage.removeItem("id");
//     }
//     let admin = await AsyncStorage.getItem("admin");
//     if (admin != null) {
//       // let response = await fetch("http://192.168.0.16:3000/admin/logout", {
//       //   method: "GET",
//       //   headers: {
//       //     Accept: "application/json",
//       //     "Content-Type": "application/json",
//       //     "Authorization": "Bearer " + admin
//       //   }
//       // });
//       // let res = await response.json();
//       await AsyncStorage.removeItem("admin");
//     }
//     this.props.navigation.navigate("Login");
//   }


//   render() {
//     const list = [
//       {
//         title: 'View my scores',
//         icon: 'graph',
//         page: 'Statistics',
//       },
//       {
//         title: 'My Account',
//         icon: 'person',
//         page: 'Account',
//       },
//       {
//         title: 'General Settings',
//         icon: 'settings',
//         page: 'Settings',
//       },
//       {
//         title: 'Edit Profile',
//         icon: 'edit',
//         page: 'Personal',

//       }
//     ];

//     return (
//       <ScrollView>
//         {/* <Personal />
//         <Settings />
//         <Statistics />
//         <Account /> */}
//         {list.map((item, i) => (
//           <ListItem
//             key={i}
//             title={item.title}
//             bottomDivider
//             chevron
//             onPress={() => this.props.navigation.navigate(item.page)}
//           />
//         ))
//         }
//         <Button containerStyle={styles.forgotButton} title="Logout" onPress={() => this._handleLogout()} />
//       </ScrollView>
//     );
//   }
// }

// class Settings extends Component {
//   constructor(props) {
//     super(props);
//   }


//   render() {
//     return (
//       <View>
//         <Text>Settings Screen</Text>
//         <Text>Adjust brightness</Text>
//         <Text>Adjust colour schemes</Text> 
//       </View>
//     );
//   }
// }

// class Accordion extends Component {
//   constructor() {
//     super();
//     this.state = {
//       question: [],
//       expanded: false,
//     };
//   }

//   componentDidMount() {
//     this.setState({question: this.props.question});
//   }

//   render() {
//     return (
//       <Card>
//         <View>
//           <Text>{this.state.question.name}</Text>
//           <Icon />
//         </View>
//         {this.state.expanded && (
//           <View>
//             <Text>Topic: {this.state.question.topic}</Text>
//             <Text>Type: {this.state.question.type} </Text>
//             <Text>Question: {this.state.question.question}</Text>
//             <Text>Mean:</Text>
//             <Text>{this.state.question.correct / this.state.question.accesses}</Text>
//           </View>
//         )}
//       </Card>
//     );
//   }
// }

// class Statistics extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user_scores: [],
//       q_history: [],
//       questions_made: [],
//       sessions: [],
//       questions_made: [],
//       rldata: [],
//       ctldata: [],
//       tmdata: [],
//     }
//   }

//   async componentDidMount() {
//     let token = await AsyncStorage.getItem("id");
//     let response = await fetch("http://192.168.0.16:3000/user/statistics", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + token
//       }
//     });
//     let res = await response.json();
//     var array = [];
//     if (res.success == true) {
//       this.setState({user_scores: res.user_scores, questions_made: res.questions, q_history: res.user.question_history, sessions: res.user.last_10_sessions_length});
//       for (var i = 0; i < this.state.user_scores.length; i++) {
//         console.log(this.state.user_scores[i].topic);
//         if (this.state.user_scores[i].topic == "Regular Languages") {
//           array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
//           this.setState({rldata: array});
//         } else if (res.user_scores[i].topic == "Context Free Languages") {
//           array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
//           this.setState({ctldata: array});
//         } else if (res.user_scores[i].topic == "Turing Machines") {
//           array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
//           this.setState({tmdata: array});
//         }
//       }
//     } else {
//       console.log("Error occured");
//     }
//   }
//   render() {
//     const chartConfig = {
//       backgroundColor: '#ffffff',
//       backgroundGradientFrom: '#ffffff',
//       backgroundGradientTo: '#ffffff',
//       color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`
//     };
//     const data = {
//       labels: ["RL", "CFL", "TM"],
//       legend: ["D1", "D2"],
//       data: [this.state.rldata, this.state.ctldata, this.state.tmdata],
//       barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
//     };
//     return (
//       <ScrollView>
//         <Text>These are your statistics as follows:</Text>
//         <Text>Marks over all questions:</Text>
//         <StackedBarChart 
//           data={data}
//           width={WIDTH}
//           height={400}
//           chartConfig={chartConfig}
//         />
//         <Text>Usage Statistics: </Text>
//         <Text>Record of sessions:</Text>
//         <ContributionGraph
//           values={this.state.sessions}
//           endDate={new Date()}
//           numDays={50}
//           chartConfig={chartConfig}
//         />
//         <Text>Last sessions:</Text>
//         <Text>Questions you've made:</Text>
//         <FlatList
//           data={this.state.questions_made}
//           renderItem = {({item, index}) =>
//             <Accordion
//               question={item}
//             />
//           }
//           keyExtractor={(item, index) => index.toString()}
//         />
//         <ScrollView></ScrollView>
//         <Text>Question History:</Text>
//         <Text>Average time spent on questions:</Text>
//       </ScrollView>
//     );
//   }
// }

// class Personal extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sessions: [],
//     }
//   }

//   async componentDidMount() {
//     let token = await AsyncStorage.getItem("id");
//     let response = await fetch("http://192.168.0.16:3000/user/profile", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + token
//       }
//     });
//     let res = await response.json();
//     this.setState({user: res.user}, function(err, success) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("User: " + this.state.user);
//       }
//     });
//   }

//   render() {
//     return (
//       <View>
//         <Text>Last sessions:</Text>
//         <Text>Questions you've made:</Text>
//         <ScrollView></ScrollView>
//         <Text>Question History:</Text>
//         {/* <ListView /> */}
//         <Text>Average time spent on questions:</Text>
//        { /* add chart here  */}
//       </View>
//     );
//   }
// }

// class Account extends Component {
//   constructor(props) {
//     super(props);
//     this.user = [];
//     this.state = {
//       username: '',
//       firstname: '',
//       lastname: '',
//       password: '',
//       newpassword: '',  
//       newpasswordconf: '',
//       email: '',
//       edit: false,
//     }
//   }

//   async componentDidMount() {
//       let token = await AsyncStorage.getItem("id");
//       let response = await fetch("http://192.168.0.16:3000/user/profile", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Authorization": "Bearer " + token
//         }
//       });
//       let res = await response.json();
//       if (res.success == true) {
//         this.setState({
//           username: res.user.username,
//           firstname: res.user.firstname,
//           lastname: res.user.lastname,
//           password: res.user.password,
//           email: res.user.email
//         });
//       }
//     }

//   async sendData() {
//     let token = await AsyncStorage.getItem("id");
//     let response = await fetch("http://192.168.0.16:3000/user/profile", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + token
//       },
//       body: JSON.stringify({
//         username: this.state.username, 
//         firstname: this.state.firstname,
//         lastname: this.state.lastname,
//         email: this.state.email
//       }),
//     });
//     let res = await response.json();
//     if (res.success == true) {
//       this.setState({
//         username: req.body.username,
//         firstname: req.body.firstname, 
//         lastname: req.body.lastname, 
//         email: req.body.email
//       });
//       this.props.navigation.pop();
//     } 
//   }

//   render() {
//     return (
//       <View>
//         <Button title="Edit" onPress={() => this.setState({edit: !this.state.edit})} />
//         <Text status='Control'>My details: </Text>
//         <Text>Personal Information:</Text>
//         <View>
//           <Text>Username: {this.state.username}</Text>
//           <Text>First Name: {this.state.firstname}</Text>
//           <Text>Last Name: {this.state.lastname}</Text>
//           <Text>Email address: {this.state.email}</Text>
//         </View>
//         {/* {this.state.edit && (
//         // <View>
//         //   <Input placeholder={this.state.username} label="Edit your username here" onEndEditing={(text) => this.setState({username: text})} />
//         //   <Input placeholder={this.state.firstname} label="Edit your first name here:" onEndEditing={(text) => this.setState({firstname: text})}/>
//         //   <Input placeholder={this.state.lastname} label="Edit your last name here:" onEndEditing={(text) => this.setState({lastname: text})} />
//         //   <Input placeholder={this.state.email} label="Edit the email address used for correspondence" onEndEditing={(text) => this.setState({email: text})} />
//         //   <Button title="Save changes" onPress={() => this.sendData()} />
//         // </View>
//         )} */}
//       </View>
//     );
//   }
// }

// class DataUpload extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       question: [],
//       correct: false,
//       answer: "",
//       isSending: true
//     }
//   }

//   async componentDidMount() {  
//     // console.log("chosenAnswer" + this.props.navigation.getParam("chosenAnswer"));
//     // console.log(this.props.navigation.getParam("Question"));
//     // console.log(this.props.navigation.getParam("Question").options[0] + "This is the answer");
//     this.setState({
//       question: this.props.navigation.getParam("Question"),
//       correct: this.props.navigation.getParam("correct"),
//       answer: this.props.navigation.getParam("chosenAnswer")
//     });
//     // const setParamsAction = NavigationActions.setParams({
//     //   params: {hideTabBar: true},
//     //   key: 'tab-name'
//     // });
//     // this.props.navigation.dispatch(setParamsAction);
//     // console.log("isSending: " + this.state.isSending);
//     // console.log("id: " + this.state.question._id);
//     let token = await AsyncStorage.getItem("id");
//     try {
//       let response = await fetch('http://192.168.0.16:3000/questions/marks', {
//         method: "POST",
//         headers: {
//           Accept: 'application/json',
//           "Content-Type": 'application/json',
//           "Authorization": "Bearer " + token,
//         },
//         body: JSON.stringify({
//           question_id: this.state.question._id,
//           correct: this.state.correct,
//           answer: this.state.answer
//         }),
//       });
//       let res = await response.json();
//       if (res.success === true) {
//         this.setState({isSending: false}); 
//       // } else {
//       //   this.props.navigation.navigate("Questions");
//       //   alert("Not done");
//       }
//       // }
//     } catch (err) {
//       // console.log(err);
//       // console.log("Error occurred");
//     }
//   }

//   selectedStyle(value) {
//     const styles = {};
//     if (value == this.state.answer) {
//       styles.borderColor = 'blue';
//       styles.borderWidth = 0.5; 
//       if (value != this.state.question.answer) {
//         styles.backgroundColor = 'red';
//       }
//     }
//     if (value == this.state.question.answer) {
//       styles.backgroundColor = 'green';
//     }
//     return styles;
//   }

//   render() {
//     if (this.state.question.type === "true_false") {
//       return (
//         <View style={styles.container}>
//           <Text>{this.state.question.question}</Text>
//           <Button title="True" disabled disabledStyle={this.selectedStyle("true")} />
//           <Button title="False" disabled disabledStyle={this.selectedStyle("false")} />
//           <AnswerScheme isAnswered={true} answer={this.state.question.answer} answerScheme={this.state.question.solution} correct={this.state.correct} givenAnswer={this.state.answer} />
//           <View>
//           {this.state.isSending ? 
//             <View>
//               <ActivityIndicator />
//                 <Text>Just wait, your result is being sent!</Text>
//             </View>
//             :
//             <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
//           }
//           </View>
//         </View>
//       );
//     } else if (this.state.question.type === "multi_choice") {
//       return (
//         <View style={styles.container}>
//           <Text> {this.state.question.question}</Text>
//           <Button title={this.state.question.options[0]} value="A" disabled disabledStyle={this.selectedStyle(this.state.question.options[0])} />
//           <Button title={this.state.question.options[1]} value="B" disabled disabledStyle={this.selectedStyle(this.state.question.options[1])} />
//           <Button title={this.state.question.options[2]} value="C" disabled disabledStyle={this.selectedStyle(this.state.question.options[2])} />
//           <Button title={this.state.question.options[3]} value="D" disabled disabledStyle={this.selectedStyle(this.state.question.options[3])} />
//           <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
//           <View>
//           {this.state.isSending ?
//           <View> 
//             <ActivityIndicator />
//               <Text>Just wait, your result is being sent!</Text>
//           </View>
//           :
//           <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
//           }
//           </View>
//         </View>
//       );
//     } else if (this.state.question.type === "normal_answer") {
//       return (
//         <View style={styles.container}>
//           <Text> {this.state.question.question}</Text>
//           <Input placeholder={this.state.answer} disabled disabledInputStyle={this.selectedStyle} />
//           <Button title="Check answer" disabled />
//           <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
//           <View>
//           {this.state.isSending ? 
//             <View>
//               <ActivityIndicator />
//               <Text>Just wait, your result is being sent!</Text>
//             </View>
//           :
//             <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
//           }
//           </View>
//         </View>
//       );
//     } else {
//       return (
//         <ScrollView>
//           <Text> {this.state.question.question}</Text>
//           <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle}/>
//           <Button title="Check answer" disabled/>
//           <AnswerScheme isAnswered={true} givenAnswer={this.state.chosenAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
//           <View>
//           {this.state.isSending ? 
//             <View>
//               <ActivityIndicator />
//               <Text>Just wait, your result is being sent!</Text>
//             </View>
//             :
//             <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
//           }
//           </View>
//         </ScrollView>
//       );
//     }
//   }
// }

// class AnswerScheme extends Component {
//   render() {
//     console.log(this.props.answer)
//     if (this.props.isAnswered) {
//       return (
//         <View>
//           {this.props.correct && (
//             <Text>Congratulations! You answered {this.props.givenAnswer} and the answer was {this.props.answer}!</Text>
//           )}
//           {!this.props.correct && (
//             <Text>Sorry! Whereas you picked {this.props.givenAnswer}, the answer was {this.props.answer}!</Text>
//           )}
//           <Text>Here's the solution:</Text>
//           <Text>{this.props.answerScheme}</Text>
//         </View>
//       );
//     } else {
//       return null;
//     }
//   }
// }

// const AuthStack = createStackNavigator({
//   Login: {
//     screen: Login,
//     path: '',
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
//   Forgot: {
//     screen: ForgotPassword,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },  
//   Register: {
//     screen: Register,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
// });

// const AdminQuestionStack = createStackNavigator({
//   Questions: {
//     screen: AdminQuestions,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
//   AdminViewQuestion: {
//     screen: AdminViewQuestion,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
//   MakeQuestion: {
//     screen: MakeQuestion,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
//   EditQuestion: {
//     screen: EditQuestion,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
//   TestQuiz: {
//     screen: TestQuiz,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
//   CheckAnswer: {
//     screen: CheckAnswer,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
// });

// AdminQuestionStack.navigationOptions = {
//   tabBarLabel: 'Questions',
//   initialRouteName: 'Questions'
// };  

// const QuestionStack = createStackNavigator({
//   Questions: {
//     screen: Questions,
//   },
//   ViewQuestion: {
//     screen: ViewQuestion,
//   },
//   MakeQuestion: {
//     screen: MakeQuestion,
//   },
// });

// QuestionStack.navigationOptions = {
//   initialRouteName: 'Questions',
//   defaultNavigationOptions: {
//     headerStyle: {
//       backgroundColor: 'purple',
//       color: 'white',
//     },
//     headerTintColor: '#fff',
//     headerTitleStyle: {
//       fontWeight: 'bold',
//     }
//   }
// };


// const QuestionSwitch = createSwitchNavigator({
//   Favourites: {
//     screen: Favourites,
//   },
//   Quiz: Quiz,
//   DataUpload: {
//     screen: DataUpload,
//   }
// });

// QuestionSwitch.navigationOptions = { 
//   tabBarLabel: 'Favourites',
//   initialRouteName: 'Favourites',
//   // tabBarVisible: navigation.state.getParam("hideTabBar") != null ? !(navigation.state.getParam("hideTabBar")) : true,
// };

// const ProfileStack = createStackNavigator({
//   Profile: {
//     screen: Profile,
//   },
//   Settings: {
//     screen: Settings,
//   },
//   Statistics: {
//     screen: Statistics,
//   },
//   Personal: {
//     screen: Personal,
//   },
//   Account: {
//     screen: Account,
//   }
// });

// ProfileStack.navigationOptions = {
//   tabBarLabel: 'Profile',
//   initialRouteName: 'Profile'
// };


// // adminQuestionSwitchNavigator.navigationOptions = {
// //   tabBarLabel: 'Favourites',
// //   initialRouteName: 'Favourites',
// // };

// // const topTabNavigator = createMaterialTopTabNavigator({
// //   questionStack: questionStackNavigator,
// //   MakeQuestion: MakeQuestion,
// //   Questions: Questions,
// // });

// // topTabNavigator.navigationOptions = {
// //   initialRouteName: 'questionStack',
// // };

// const AdminHomepageTab = createBottomTabNavigator({
//   Home: AdminHome,
//   Question: AdminQuestionStack,
//   BlacklistUsers,
//   Profile: ProfileStack,
// });

// const HomepageTab = createBottomTabNavigator({
//   Home,
//   Questions: QuestionStack,
//   QuestionSwitch,
//   ProfileStack
// });

// const AppSwitch = createSwitchNavigator({
//   Auth: AuthStack, 
//   ForgotPassword: {
//     screen: ForgotPasswordForm,
//     path: 'forgotpassword/:token'
//   },
//   AdminLogin: AdminLogin,
//   Home: HomepageTab,
//   AdminHomepage: AdminHomepageTab
// });

const AppContainer = createAppContainer(AppSwitch);

// main = StackNavigator
// ->Login
// ->Forgot
// ->LoginwithWarwickAccount
// -> StackNavigator {
//   ->TabNavigator {
//   ->Settings
//   ->FindQuestionSets
//   ->FindResources
//   ->SaveStuff
//   ->Logout
//   }
//}


const styles = StyleSheet.create({
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
