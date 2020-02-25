import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView } from 'react-native';
import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { SearchBar, CheckBox, Button, ListItem, Icon, Slider, Avatar, Header } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { Linking } from 'expo';
import Canvas from 'react-native-canvas';
import SlidingUpPanel from 'rn-sliding-up-panel';
import MathJax from 'react-native-mathjax';
import { ApplicationProvider, Select, Text, Card, Datepicker, Input } from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart } from "react-native-chart-kit"

const test = require('./test.js');
// import Welcome from './components/Welcome';
// import Home from './components/Home';
// import Login from './components/Login';
// import Questions from './components/Questions';
// import Quiz from './components/Quiz';

//TODO: 

// {
// 	"question_id": "5e1a332d2cef8707f4b01190",
// 	"correct": false
// }


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
    // return (
    //   <NavigationContainer>
    //     <AuthStackNavigator />
    //   </NavigationContainer>
    // );
  }
}

export default App;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false,
      admin: false,
      isSending: false
    }
  }

  async componentDidMount() {
    var token = await AsyncStorage.getItem("id");
    if (token != null) {
      try {
        let response = await fetch('http://192.168.0.16:3000/auth/login', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
          }
        });
        let res = await response.json();
        if (res.success === "true") {
          this.props.navigation.navigate("Home");
          // console.log("Token present and valid");
        } else {
          this.setState({isVerified: false});
          // console.log("Token present, expired");
          await AsyncStorage.removeItem("id"); 
        }
      } catch (err) {
        alert(err);
        // console.log(err);
      }
    } else {
      this.setState({isVerified: false});
      // console.log("Token not present");
    }
  }

  async sendData() {
    this.setState({isSending: true});
    if (!this.state.admin) {
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
          this.setState({isSending: false});
          this.props.navigation.navigate('Home');
        } else {
          console.log(res.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        let response = await fetch('http://192.168.0.16:3000/admin/login', {
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
          console.log("success");
          await AsyncStorage.setItem('admin', res.token);
          // if (res.remember === true) {
          //   await AsyncStorage.setItem('remember', true);
          // }
          this.setState({isSending: false});
          this.props.navigation.navigate('AdminLogin');
        } else {
          console.log (res.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  render() {
    if (this.state.isVerified) {
      this.props.navigation.navigate("Home");
      return null;
    } else {
      return (
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text>Hello</Text>
            <Text>Sign in to your account:</Text>
            <Button buttonStyle={styles.signUpButton} type="clear" title="Sign Up" onPress={() => this.props.navigation.navigate("Register")} />
          </View>
          <View style={styles.formContainer}>
            <Input 
              placeholder='Username'  
              onChangeText={(item) => this.setState({username: item})} 
            />
            <Input 
              style={styles.passwordInput}
              placeholder='Password' 
              secureTextEntry={true} 
              onChangeText={(item) => this.setState({password: item})} 
            />
          </View>
          <CheckBox center title='Remember Me' checked={this.state.remember} checkedColor='blue' onPress={() => this.setState({remember: !this.state.remember})} />
          <CheckBox center title='I am an Admin' checked={this.state.admin} checkedColor='red' onPress={() => this.setState({admin: !this.state.admin})} />
          <Button style={styles.signinButton} title="Signin" onPress={() => this.sendData()} loading={this.state.isSending} buttonStyle={styles.signinButton} />
          <View style={styles.forgotContainer}>
            <Button buttonStyle={styles.forgotButton} type="clear" title="Forgot Password?" onPress={() => this.props.navigation.navigate("Forgot")} style={styles.forgotButton}/>
          </View>
        </ScrollView>
        /* <Avatar rounded title="User" onPress={() => this.setState({admin: false})}/>
        <Avatar rounded title="Admin" onPress={() => this.setState({admin: true})}/> */ 
      );
    }
  }
}

class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      isLoading: false,
      isSending: false,
      err: '',
      answer: ','
    }
  }

  async componentDidMount() {
    this.setState({isLoading: true})
    let token = await AsyncStorage.getItem("admin");
    let response = await fetch("http://192.168.0.16:3000/admin/2fa", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    if (res.success === true) {
      this.setState({question: res.question, isLoading: false})
    } else {
      this.setState({isLoading: false, err: res.message});
    }
  }

  async sendData() {
    this.setState({isSending: true});
    let adminToken = await AsyncStorage.getItem("admin");
    let response = await fetch("http://192.168.0.16:3000/admin/2fa", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + adminToken
      },
      body: JSON.stringify({
        question: this.state.question,
        answer: this.state.answer,
      })
    });
    let res = await response.json();
    if (res.success === true) {
      this.setState({isSending: false});
      this.props.navigation.navigate("AdminHomepage");
    }
  }

  render() {
    if (!this.state.err) {
        return (
          <View styles={formContainer}>
            <Text>Password confirmed! For security reasons, please enter the relevant answer to the provided security question!</Text>
            <Text>{this.state.question}</Text>
            <Input placeholder="Enter your answer here!" onChangeText={(text) => this.setState({answer: text})} />
            <Button title="Submit your answer!" loading={this.state.isSending} onPress={() => this.sendData()} />
          </View>
        );

    }
  }
}

class Register extends Component {
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
          <View style={styles.headerContainer}></View>
          <View style={styles.formContainer}>
            <Input placeholder="First Name" onChangeText={(item) => this.setState({firstname: item})} />
            <Input placeholder="Last Name" onChangeText={(item) => this.setState({lastname: item})} />
            <Input placeholder="Email" onChangeText={(item) => this.setState({email: item})} />
            <Input placeholder="Username" onChangeText={(item) => this.setState({username: item})} />
            <Input placeholder="Password" secureTextEntry={true} onChangeText={(item) => this.setState({password: item})} />
            <Input placeholder="Confirm Password" secureTextEntry={true} onChangeText={(item) => this.setState({passwordconf: item})} />
          </View>
          <Button onPress={() => this.sendData()} title ="Register now!" />
        </ScrollView> 
      );
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      scores: [],
      err: '',
    }
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch('http://192.168.0.16:3000/user/profile', {
      method: "GET",
      headers : {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    if (res.success === true) {
      this.setState({user: res.user});
    } else {
      this.setState({err: res.message});
    }
  }

  render() {
    return (
    // <DFADrawingComponent />
    <View>
      <Text>Welcome back,</Text>
      <Text>{this.state.user.firstname}!</Text>

      <Text>Let's get started with quizzing:</Text>
      <Button title="Get Started!" onPress={() => this.props.navigation.navigate("Questions")} />

      <Text>Here is your total score breakdown:</Text>
      
    </View>
    );
  }
}

class BlacklistUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      reason: '',
      date: null,
    }
  }

  async componentDidMount() {
    this.setState({date: new Date()});
  }

  render() {
    return (
      <View>
        <Text>Here is the facility for blacklisting users.</Text>
        <Text>
          NOTE: all blacklist actions require CLEAR and SIGNIFICANT actions against the University of Warwick's Policy.
          This justification will also be sent to the blacklisted user to understand the actions committed and for their chance to appeal the decision.
        </Text>

        <Input />
        <Input placeholder="Enter the justification for blacklisting this user here" multiline={true} numberOfLines={5} onChangeText={(text) => this.setState({reason: text})} />
        <Datepicker placeholder='Date to be banned until' date={this.state.date} onSelect={(newdate) => this.setState({date: newdate})} boundingMonth={false} />
      </View>
    );
  }
}

class ForgotPassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: null,
      received: false,
      error: false
    }
  }

  async sendData() {
    let response = await fetch('http://192.168.0.16:3000/auth/forgot', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer"
      },
      body: JSON.stringify({
        "email": this.state.email,
        "url" : initialUrl,
        "path": "forgotpassword"
      })
    });
    let res = await response.json();
    if (res.message == "/") {
      alert("You have already logged in and have a token present on your device. Please log into your account and reset your password from there!");
    }
    if (res.success == "true") {
      this.setState({received: true});
      await AsyncStorage.setItem("forgot_Token", res.msg);
    }
    
  }

  render() {
    if (!this.state.received && !this.state.error) {
      return (
        <View>
          <View>
            <Text>Please enter your email to receive your reset password link:</Text>
          </View>
          <Input placeholder="Enter your email here" onChangeText={(item) => this.setState({email: item})} />
          <Button raised title="Send link" onPress={() => this.sendData()} />
        </View>
      );
    } else if (this.state.received) {
      <View>
        <Text>Your email has been sent to your account at {this.state.email}!</Text>
      </View>
    }
  }
}

class ForgotPasswordForm extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      passwordconf: "",
      isLoading: true,
      error: null
    }
  }

  handleDeepLink = (url) => {
    const { path, token } = Linking.parse(url);
    console.log("token = " + token);
  }

  async componentDidMount() {
    // var forgot = await AsyncStorage.getItem("forgot_Token");
    // Linking.addEventListener('url', this.handleDeepLink);
    // let response = await fetch(`http://192.168.0.16:3000/auth/reset/${forgot}`, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer'
    //   },
    // });
    // let res = await response.json();
    // this.setState({error: res.error});
  }

  async sendData() {
    let response = await fetch(`http://192.168.0.16:3000:3000/auth/reset/${forgot}`, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'

      },
      body: JSON.stringify({
        "password": this.state.password,
        "passwordconf": this.state.passwordconf,
      })
    });
    let res = await response.json();
    if (res.success == "true")
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

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      isLoading: true,
      error: null,
      search: '',
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerRight: () => (
        <Icon
          name='plus'
          type='font-awesome'
          onPress={() => {navigation.navigate("MakeQuestion")}}
        />
      ),
    };
  }

  async componentDidMount() {
    this.getQuestions();
    setInterval(() => this.getQuestions(), 5000);
  }

  async getQuestions() {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.16:3000/questions/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      let json = await response.json();
      this.setState({questions: json, isLoading: false});
    } catch (err) {
      this.setState({error: err}, () => console.log("Error: " + this.state.error));
    }
  }

  async getData() {
    const token = await AsyncStorage.getItem("id");
    try {
      let response = await fetch(`http://192.168.0.16:3000/questions/${this.state.topic}/${this.state.search}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,  
        }
      });
      let res = await response.json();
      if (res.success) {
        this.setState({questions: res.json});
      }
    } catch (err) {
      console.log("Error occurred: " + err);
    }

  }

  async saveQuestion(id) {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.16:3000/questions/save',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          "question_id": id
        })
      });
      let res = await response.json();
      if (res.success == true) {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getQuestion(item) {
    console.log(item);
    this.props.navigation.navigate("ViewQuestion", {
      id: item
    });
  }

  render() {
      return (
        <ScrollView>
          <SearchBar 
          onChangeText={(item) => this.setState({search: item})}
          onClearText={()=> this.setState({search: ''})}
          lightTheme
          placeholder='Enter here....'
          />
          <FlatList 
            data={this.state.questions}
            renderItem = {({item, index}) =>
              <ListItem
                title={item.name}
                subtitle={item.topic}
                bottomDivider
                chevron
                onPress={() => this.getQuestion(item)}
              />
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      );
  }
}

class AdminQuestions extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      isLoading: true,
      error: null,
      search: '',
      type: 'all'
    }
  }

  async componentDidMount() {
    try {
      const token = await AsyncStorage.getItem("admin");
      let response = await fetch('http://192.168.0.16:3000/questions/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      let json = await response.json();
      this.setState({questions: json, isLoading: false});
    } catch (err) {
      console.log("Error occured");
      this.setState({error: err});
    }
  }

  async sendData() {
    const token = await AsyncStorage.getItem("id");
    try {
      let response = await fetch(`http://192.168.0.16:3000/questions/${this.state.type}/${this.state.search}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,  
        }
      });
      let res = await response.json();
      if (res.success) {
        this.setState({questions: res.json});
      }
    } catch (err) {
      // console.log("Error occurred: " + err);
    }

  }

  async saveQuestion(id) {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.16:3000/questions/save',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          "question_id": id
        })
      });
      let res = await response.json();
      // console.log(res.message);
    } catch (err) {
      // console.log(err);
    }
  }

  render() {
      return (
        <ScrollView>
          <SearchBar 
          onChangeText={(item) => this.setState({search: item})}
          onClearText={()=> this.setState({search: ''})}
          lightTheme
          placeholder='Enter here....'
          /> 
          {/* Alert.alert('Add Question?', 'Add this Question to your Favourites?', [ {text: 'No', onPress: () => console.log("refused")}, {text: 'Yes', onPress: () => this.saveQuestion(item._id)}]) */}
          <FlatList 
            data={this.state.questions}
            renderItem = {({item}) =>
              <ListItem
                title={item.name}
                subtitle={item.topic}
                bottomDivider
                chevron
                onPress={(item) => this.props.navigation.navigate("AdminViewQuestion", {question: item})}
              />
            }
            keyExtractor = {(item, index) => index.toString()}
          />
        </ScrollView>
      );
  }
}

class ViewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      q_type: '',
    };
  }

  async componentDidMount() {
    var qid = this.props.navigation.getParam('id');
    console.log(qid);
    this.setState({question: qid}); 
  }

  async saveQuestion(id) {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.16:3000/questions/save',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          "question_id": id
        })
      });
      let res = await response.json();
      // console.log(res.message);
    } catch (err) {
      // console.log(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Name: {this.state.question.name}</Text>
        <Text>Topic: {this.state.question.topic}</Text>
        <Text>Type of question: {this.state.question.type}</Text>
        <Text>{this.state.question.accesses} people have tried this question!</Text>
        <Text>Mean mark: {this.state.question.correct / this.state.question.accesses > 0 ? this.state.question.correct / this.state.question.accesses : 0}</Text>
        <Button title="Add to Favourites" onPress={() => this.saveQuestion(this.state.question._id)} />
      </View>
    );
  }
}

class AdminViewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
    }
  }

  async componentDidMount() {
    this.setState({question: this.props.navigation.getParam("question")});
  }

  async saveQuestion(id) {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.16:3000/admin/save',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          "question_id": id
        })
      });
      let res = await response.json();
      // console.log(res.message);
    } catch (err) {
      // console.log(err);
    }
  }

  render() {
    return (
      <View>
        <Text>{this.state.question.name}</Text>
        <Text>{this.state.question.topic}</Text>
        <Text>{this.state.question.type}</Text>
        <Text>{this.state.question.question}</Text>
        <Text>Answer: {this.state.question.answer}</Text>
        <Text></Text>
        <Text>{this.state.question.accesses} people have tried this question!</Text>
        <Text>Mean mark: {this.state.question.correct / this.state.question.accesses}</Text>
        <Button title="Edit Question" onPress={() => this.props.navigation.navigate("EditQuestion", {question: this.state.question})} />
      </View>
    );
  }
}

class EditQuestion extends Component {
  constructor(props) {
    this.topics = [];
    super(props);
    this.state = {
      id: null,
      name: "",
      question: "",
      type: "",
      options: [],
      answer: "",
      solution: "",
      difficulty: 1,
      topic: "",
      isLoading: false,
    }
  }

  async componentDidMount() {
    this.setState({
      name: this.props.navigation.getParam("Question").name,
      question: this.props.navigation.getParam("Question").question,
      type: this.props.navigation.getParam("Question").type,
      options: this.props.navigation.getParam("Question").options,
      answer: this.props.navigation.getParam("Question").answer,
      solution: this.props.navigation.getParam("Question").solution,
      difficulty: this.props.navigation.getParam("Question").difficulty,
    });
    let response = await fetch("http://192.168.0.16:3000/topics/all", {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    let res = await response.json();
    if (res.success === true) {
      for (i in res.topics) {
        var element = {text: res.topics.name}
        this.topics.push(element);
      }
    } else {
      
    }
  }

  async editQuestion() {
    let adminToken = await AsyncStorage.getItem("admin");
    let response = await fetch('http://192.168.0.16:3000/admin/edit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + adminToken,
      },
      body: JSON.stringify({
        name: this.state.name,
        question: this.state.question,
        topic: this.state.topic,
        type: this.state.type,
        options: this.state.options,
        answer: this.state.answer,
        solution: this.state.solution,
        difficulty: this.state.difficulty,
      })
    });
    let res = await response.json();
    if (res.success === true) {
      alert("Done");
      this.props.navigate.goBack();
    } else {
      console.log("Not done");
    }
  }

  render() {
    const types = [
      {text: "True-False"},
      {text: "Multiple Choice"},
      {text: "Normal Answer"},
    ];
    const topics = [
      {text: "Regular Languages"},
      {text: "Context Free Languages"},
      {text: "Turing Machines"},
    ];
    return (
          <View style={styles.makequestion}>
            <Text>Here we can make new questions!</Text>
            <Input placeholder={this.state.name} onChangeText={(name) => this.setState({name: name})} />
            <Input placeholder={this.state.question} multiline={true} onChangeText={(text) => this.setState({question: text})} />
            <View>
            <Text>Please set a question type:</Text>
              <Select
                placeholder={this.state.type}
                data={types}
                selectedOption={this.state.type}
                onSelect={(value) => this.setState({type: value.text}, () => console.log(this.state.type))}/>
            </View>
            {(this.state.type.text === "Multiple Choice") && (
            <View>
              <Input placeholder={this.state.options[0]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
              <Input placeholder={this.state.options[1]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
              <Input placeholder={this.state.options[2]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
              <Input placeholder={this.state.options[3]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
            </View>
            )}
            {(this.state.type === "Normal Answer") && (
              <View>
                <Text>No options required - move onto next field!</Text> 
              </View>
            )}
            {(this.state.type === "True-False") && (
              <View>
                <Button disabled title="True"/> 
                <Button disabled title="False"/>
              </View> 
            )}
            <View>
              <Text>Please select the question topic:</Text>
              <Select 
                data={topics}
                selectedOption={this.state.topic}
                onSelect={(item) => this.setState({topic: item.text})} 
              />  
            </View>
            <Input placeholder="Answer to Question" onChangeText={(text) =>
              this.setState({answer: text}, () => {
                if (this.state.type == "multi_choice" && !this.state.options.includes(text)) {
                  alert("Answer must also be included within the options provided!");
                }
              }) 
            } />
            <Input placeholder="Solution to problem" multiline={true} onChangeText={(text) => this.setState({solution: text})} />
            <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onValueChange={value => this.setState({difficulty: value}, () => console.log("Difficulty: " + this.state.difficulty))} />
            <Button style={styles.button} title="Submit question!" onPress={this.sendData()} />
          </View>
    );
  }
}

class Favourites extends Component { 
  constructor() {
    super();
    this.state = {
      questions: [],
      error: null,
      isLoading: true
    }
  }
  
  async componentDidMount() {
    try {
      const token = await AsyncStorage.getItem("id");
      const response = await fetch('http://192.168.0.16:3000/user/questions', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      const json = await response.json();
      this.setState({questions: json, isLoading: false});
      //console.log("Success on getting questions");
    } catch (err) {
      this.setState({error: err}, () => console.log("Error: " + this.state.error));
    }
  }
  
  async sendData(item) {
    try {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.16:3000/questions/log', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          id: item._id,
        })
      });
      let res = await response.json();
      if (res.success == "true") {
        this.props.navigation.navigate("Quiz", {Question: item});
      } else {
        alert("Connection lost");
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <ScrollView>
          <FlatList 
            data={this.state.questions}
            renderItem = {({item, index}) => (
                <View style={styles.itemStyle}>
                  <TouchableOpacity onPress={() => this.sendData(item)}>
                  <Text>{item.name}</Text>
                  </TouchableOpacity>
                </View>
            )}
            keyExtractor={this.state.questions._id}
          />
        </ScrollView>
    );
  }
}

class MakeQuestion extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      type: '',
      question: '',
      topic: '',
      difficulty: 1,
      content: '',
      answer: '',
      solution: '',
      options: [],
      optionList: [],
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      selectedType: '',
    }
  }

  async sendData() {
    if (this.state.type == "true_false") {
      this.setState({options: [true, false]});
    }
    console.log(this.state.type);
    try { 
      var token = await AsyncStorage.getItem("id");
      // console.log(this.state);
      let response = await fetch('http://192.168.0.16:3000/questions/new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          name: this.state.name,
          type: this.state.type,
          question: this.state.question,
          options: this.state.options,
          difficulty: this.state.difficulty,
          answer: this.state.answer,
          solution: this.state.solution,
          topic: this.state.topic
        }),
      });
      let res = await response.json();
      if (res.success == true) {
        alert("Question made");
      } else {
        alert("Question not made");
      }
      this.props.navigation.navigate("Questions");
    } catch (err) {
      // console.log(err);
      alert(err);
    }
  }

  async addToArray() {
    var objectArray = [];
    var array = [this.state.option1, this.state.option2, this.state.option3, this.state.option4];
    console.log(array);
    for (var i = 0; i < array.length; i++) {
      var object = {
        text: array[i]
      };
      console.log("Opt: " + object);
      objectArray[i] = (object);
    }
    this.setState({optionList: objectArray, options: array}, () => console.log("List: " + this.state.optionList + "\nOptions: " + this.state.options));
    console.log(this.state.optionList);
  }
  
  async removeObject(item) {
    var entry = item.text;
    console.log(item.text);
    this.setState({answer: entry}, () => console.log(this.state.answer));
  }

  async booleanToObject(item) {
    var entry = item.text;
    var boolean = false; 
    if (entry === "True") {
      boolean = true;
    } else {
      boolean = false;
    }
    this.setState({answer: boolean}, () => console.log(this.state.answer));
  }

  async addType(item) {
    var entry = item.text;
    this.setState({selectedType: entry});
    console.log(item.text);
    switch (entry) {
      case "True-False":
        this.setState({type: "true_false"});
        break;
      case "Multiple Choice":
        this.setState({type: "multi_choice"});
        break;
      case "Normal Answer":
        this.setState({type: "normal_answer"});
        break;
      default: 
        this.setState({type: "normal_answer"});
        break;
    }
  }

  render() {
    const types = [
      {text: "True-False"},
      {text: "Multiple Choice"},
      {text: "Normal Answer"},
    ];
    const topics = [
      {text: "Regular Languages"},
      {text: "Context Free Languages"},
      {text: "Turing Machines"},
    ];
    const boolean = [
      {text: "True"},
      {text: "False"}
    ];

    return (
      <ScrollView>
        <Text>Here we can make new questions!</Text>
        <Input placeholder="Question Title"  onChangeText={(name) => this.setState({name: name})} />
        <Input placeholder="Name the question" multiline={true} onChangeText={(ques) => this.setState({question: ques})} />
        <Text>Please select the question topic:</Text>
        <Select 
          data={topics}
          selectedOption={this.state.topic}
          onSelect={(item) => this.setState({topic: item.text}, () => console.log(this.state.topic))} 
        />  
        <Text>Please set a question type:</Text>
        <Select
          data={types}
          selectedOption={this.state.type}
          onSelect={(item) => this.addType(item)}
        />
        {(this.state.selectedType == "Multiple Choice") && (
        <View style={styles.container}> 
          <Input placeholder="Option 1" onChangeText={(text) => this.setState({option1: text})} />
          <Input placeholder="Option 2" onChangeText={(text) => this.setState({option2: text})} />
          <Input placeholder="Option 3" onChangeText={(text) => this.setState({option3: text})} />
          <Input placeholder="Option 4" onChangeText={(text) => this.setState({option4: text})} />
          <Button title="Set your options here!" onPress={() => this.addToArray()} />
          <Text>Select your answer here!</Text>
          <Select 
            data={this.state.optionList}
            selectedOption={this.state.answer}
            onSelect={(object) => this.removeObject(object)}
          />
        </View>
        )}
        {(this.state.selectedType == "Normal Answer") && (
        <View style={styles.container}>
          <Text>No options required - move onto next field!</Text> 
          <Input placeholder="Enter your answer here" onChange={(text) => this.setState({answer: text})} />
        </View>
        )}
        {(this.state.selectedType == "True-False") && (
          <View style={styles.container}>
            <Button disabled title="True"/> 
            <Button disabled title="False"/>
            <Select
              data={boolean}
              selectedOption={this.state.answer}
              onSelect={(object) => this.booleanToObject(object)}
            />
          </View>
        )} 
        <Input placeholder="Solution to problem" multiline={true} numberOfLines={10} onChangeText={(text) => this.setState({solution: text})} />
        <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} onSlidingComplete={(value) => this.setState({difficulty: value})} />
        <Text>Difficulty: {this.state.difficulty}</Text>
        <Button style={styles.button} title="Submit question!" onPress={() => this.sendData()} />
      </ScrollView>
    );
  }
}

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      correct: false, 
      answered: false,
      value: "",
      questions: [],
      normalAnswer: "",
      answer: ""
    }
  }

  componentDidMount() {
    this.setState({questions: this.props.navigation.getParam('questions'), isLoading: false}, () => console.log("Questions: " + this.state.questions));
  }

  isCorrect(value) {
    // console.log("Value: " + value);
    this.setState({
      answered: true, answer: value, 
    });
    if (value === this.state.questions.answer) {
      this.setState({correct: true}, () => {
        this.props.navigation.navigate("DataUpload", {
          Question: this.state.questions,
          correct: this.state.correct,
          chosenAnswer: value,
        });
      });
    } else {
      this.setState({correct: false}, () => {
        this.props.navigation.navigate("DataUpload", {
          Question: this.state.questions,
          correct: this.state.correct,
          chosenAnswer: value,
        });
      });

    }
  }

  render() {
    if (!this.state.isLoading) {
      if (this.state.questions.type == "true_false") {
        return (
          <View style={styles.container}>
            <Text>{this.state.questions.question}</Text>
            <Button title="True" onPress={() => this.isCorrect("true")} />
            <Button title="False" onPress={() => this.isCorrect("false")} />
          </View>
        );
      } else if (this.state.questions.type == "multi_choice") {
        return (
          <View style={styles.container}>
            <Text> {this.state.questions.question}</Text>
            <Button title={this.state.questions.options[0]} value={this.state.questions.options[0]} onPress={() => this.isCorrect(this.state.questions.options[0])} />
            <Button title={this.state.questions.options[1]} value ={this.state.questions.options[1]} onPress={() => this.isCorrect(this.state.questions.options[1])} />
            <Button title={this.state.questions.options[2]} value={this.state.questions.options[2]} onPress={() => this.isCorrect(this.state.questions.options[2])} />
            <Button title={this.state.questions.options[3]} value={this.state.questions.options[3]} onPress={() => this.isCorrect(this.state.questions.options[3])} />
          </View>
        );
      } else if (this.state.questions.type == "normal_answer") {
        return (
          <View style={styles.container}>
            <Text> {this.state.questions.question}</Text>
            <Input placeholder="Answer here" onChangeText={(item) => this.setState({normalAnswer: item})}/>
            <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text> {this.state.questions.question}</Text>
            <Input placeholder="Answer here" onChangeText={(answer) => this.setState({normalAnswer: answer})}/>
            <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
          </View>
        );
      }
    } else {
      return (
        <View> 
          <ActivityIndicator />
          <Text>Loading Question.....This may take unknown time.</Text>
        </View>
      );
    }
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  async _handleLogout(){
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.16:3000/auth/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    let remember = await AsyncStorage.getItem("remember");
    if (remember == null) {
      await AsyncStorage.removeItem("id");
    }
    this.props.navigation.navigate("Login");
  }


  render() {
    const list = [
      {
        title: 'View my scores',
        icon: 'graph',
        page: 'Statistics',
      },
      {
        title: 'My Account',
        icon: 'person',
        page: 'Account',
      },
      {
        title: 'General Settings',
        icon: 'settings',
        page: 'Settings',
      },
      {
        title: 'Edit Profile',
        icon: 'edit',
        page: 'Personal',

      }
    ];

    return (
      <View>
        {list.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            bottomDivider
            chevron
            onPress={() => this.props.navigation.navigate(item.page)}
          />
        ))
        }
        <Button title="Logout" onPress={() => this._handleLogout()} />
      </View>
    );
  }
}

class Settings extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View>
        <Text>Settings Screen</Text>
        <Text>Adjust brightness</Text>
        <Text>Adjust colour schemes</Text> 
      </View>
    );
  }
}

class Accordion extends Component {
  constructor() {
    super();
    this.state = {
      question: this.props.question,
      expanded: false,
    };
  }

  render() {
    return (
      <Card>
        <View>
          <Text>{this.state.question.title}</Text>
          <Icon />
        </View>
        {this.state.expanded && (
          <View>
            <Text>Topic: {this.state.question.topic}</Text>
            <Text>Type: {this.state.question.type} </Text>
            <Text>Question: {this.state.question.question}</Text>
            <Text>Mean:</Text>
            <Text>{this.state.question.correct / this.state.question.accesses}</Text>
          </View>
        )}
      </Card>
    );
  }
}

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_scores: [],
      q_history: [],
      sessions: [],
      questions_made: [],
      rldata: [],
      ctldata: [],
      tmdata: [],
    }
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.16:3000/user/statistics", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    var array = [];
    if (res.success == true) {
      this.setState({user_scores: res.user_scores, q_history: res.user.question_history, sessions: res.user.last_10_sessions_length});
      for (var i = 0; i < this.state.user_scores.length; i++) {
        console.log(this.state.user_scores[i].topic);
        if (this.state.user_scores[i].topic == "Regular Languages") {
          array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
          this.setState({rldata: array});
        } else if (res.user_scores[i].topic == "Context Free Languages") {
          array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
          this.setState({ctldata: array});
        } else if (res.user_scores[i].topic == "Turing Machines") {
          array = [this.state.user_scores[i].d1_correct, this.state.user_scores[i].d2_correct, this.state.user_scores[i].d3_correct, this.state.user_scores[i].d4_correct, this.state.user_scores[i].d5_correct];
          this.setState({tmdata: array});
        }
      }
    } else {
      console.log("Error occured");
    }
  }
  render() {
    const chartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
    };
    const data = {
      labels: ["RL", "CFL", "TM"],
      legend: ["D1", "D2"],
      data: [this.state.rldata, this.state.ctldata, this.state.tmdata],
      barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
    };
    return (
      <ScrollView>
        <Text>These are your statistics as follows:</Text>
        <Text>Marks over all questions:</Text>
        <StackedBarChart 
          data={data}
          width={WIDTH}
          height={400}
          chartConfig={chartConfig}
        />
        <Text>Usage Statistics: </Text>
        <Text>Record of sessions:</Text>
        <ContributionGraph
          values={this.state.sessions}
          endDate={new Date()}
          numDays={50}
          chartConfig={chartConfig}
        />
        <Text>Last sessions:</Text>
        <Text>Questions you've made:</Text>
        <FlatList
          data={this.state.questions_made}
          renderItem = {({item, index}) =>
            <Accordion
              question={item}
            />
          }
          keyExtractor={(item, index) => index.toString()}
        />
        <ScrollView></ScrollView>
        <Text>Question History:</Text>
        <Text>Average time spent on questions:</Text>
      </ScrollView>
    );
  }
}

class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
    }
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.16:3000/user/profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    this.setState({user: res.user}, function(err, success) {
      if (err) {
        console.log(err);
      } else {
        console.log("User: " + this.state.user);
      }
    });
  }

  render() {
    return (
      <View>
        <Text>Last sessions:</Text>
        <Text>Questions you've made:</Text>
        <ScrollView></ScrollView>
        <Text>Question History:</Text>
        <ListView />
        <Text>Average time spent on questions:</Text>
       { /* add chart here  */}
      </View>
    );
  }
}

class Account extends Component {
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
    }
  }

  async componentDidMount() {
      let token = await AsyncStorage.getItem("id");
      let response = await fetch("http://192.168.0.16:3000/user/profile", {
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
          email: res.user.email
        });
      }
    }

  async sendData() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://192.168.0.16:3000/user/profile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        username: this.state.username, 
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email
      }),
    });
    let res = await response.json();
    if (res.success == true) {
      this.setState({
        username: req.body.username,
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        email: req.body.email
      });
      this.props.navigation.pop();
    } 
  }

  render() {
    return (
      <View>
        <Button title="Edit" onPress={() => this.setState({edit: !this.state.edit})} />
        <Text>My details: </Text>
        <Text>Personal Information:</Text>
        <Text>Username: {this.state.username}</Text>
        <Text>First Name: {this.state.firstname}</Text>
        <Text>Last Name: {this.state.lastname}</Text>
        <Text>Email address: {this.state.email}</Text>
        {this.state.edit && (
        <View>
          <Input placeholder={this.state.username} label="Edit your username here" onEndEditing={(text) => this.setState({username: text})} />
          <Input placeholder={this.state.firstname} label="Edit your first name here:" onEndEditing={(text) => this.setState({firstname: text})}/>
          <Input placeholder={this.state.lastname} label="Edit your last name here:" onEndEditing={(text) => this.setState({lastname: text})} />
          <Input placeholder={this.state.email} label="Edit the email address used for correspondence" onEndEditing={(text) => this.setState({email: text})} />
          <Button title="Save changes" onPress={() => this.sendData()} />
        </View>
        )}
      </View>
    );
  }
}

class DataUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      correct: false,
      selectedAnswer: "",
      isSending: true
    }
  }

  async componentDidMount() {  
    // console.log("chosenAnswer" + this.props.navigation.getParam("chosenAnswer"));
    // console.log(this.props.navigation.getParam("Question"));
    // console.log(this.props.navigation.getParam("Question").options[0] + "This is the answer");
    this.setState({
      question: this.props.navigation.getParam("Question"),
      correct: this.props.navigation.getParam("correct"),
      answer: this.props.navigation.getParam("chosenAnswer")
    }, () => console.log(this.props.navigation.getParam("chosenAnswer") + "=" + this.state.answer));
    // const setParamsAction = NavigationActions.setParams({
    //   params: {hideTabBar: true},
    //   key: 'tab-name'
    // });
    // this.props.navigation.dispatch(setParamsAction);
    // console.log("isSending: " + this.state.isSending);
    // console.log("id: " + this.state.question._id);
    let token = await AsyncStorage.getItem("id");
    try {
      let response = await fetch('http://192.168.0.16:3000/questions/marks', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          question_id: this.state.question._id,
          correct: this.state.correct,
          answer: this.state.answer
        }),
      });
      let res = await response.json();
      if (res.success === true) {
        alert("Done");
        this.setState({isSending: false}); 
      // } else {
      //   this.props.navigation.navigate("Questions");
      //   alert("Not done");
      }
      // }
    } catch (err) {
      // console.log(err);
      // console.log("Error occurred");
    }
  }

  selectedStyle(value) {
    const styles = {};
    if (value == this.state.selectedAnswer) {
      styles.borderColor = 'blue';
      if (value != this.state.question.answer) {
        styles.backgroundColor = 'red';
      }
    }
    if (value == this.state.question.answer) {
      styles.backgroundColor = 'green';
    }
  }

  render() {
    if (this.state.question.type === "true_false") {
      return (
        <View style={styles.truefalse}>
          <Text>{this.state.question.question}</Text>
          <Button title="True" style={this.selectedStyle("True")} />
          <Button title="False" style={this.selectedStyle("False")} />
          <AnswerScheme isAnswered={true} answer={this.state.question.answer} answerScheme={this.state.question.solution} correct={this.state.correct} givenAnswer={this.state.answer} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
                <Text>Just wait, your result is being sent!</Text>
            </View>
            :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </View>
      );
    } else if (this.state.question.type === "multi_choice") {
      return (
        <View style={styles.multichoice}>
          <Text> {this.state.question.question}</Text>
          <Button title={this.state.question.options[0]} value="A" disabled disabledStyle={this.selectedStyle(this.state.question.options[0])} />
          <Button title={this.state.question.options[1]} value="B" disabled disabledStyle={this.selectedStyle(this.state.question.options[1])} />
          <Button title={this.state.question.options[2]} value="C" disabled disabledStyle={this.selectedStyle(this.state.question.options[2])} />
          <Button title={this.state.question.options[3]} value="D" disabled disabledStyle={this.selectedStyle(this.state.question.options[3])} />
          <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ?
          <View> 
            <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
          </View>
          :
          <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </View>
      );
    } else if (this.state.question.type === "normal_answer") {
      return (
        <ScrollView>
          <Text> {this.state.question.question}</Text>
          <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle} />
          <Button title="Check answer" disabled />
          <AnswerScheme isAnswered={true} givenAnswer={this.state.answer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
            </View>
          :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView>
          <Text> {this.state.question.question}</Text>
          <Input placeholder={this.state.normalAnswer} disabled disabledInputStyle={this.selectedStyle}/>
          <Button title="Check answer" disabled/>
          <AnswerScheme isAnswered={true} givenAnswer={this.state.chosenAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
            </View>
            :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Favourites")}/> 
          }
          </View>
        </ScrollView>
      );
    }
  }
}

class AnswerScheme extends Component {
  render() {
    console.log(this.props.answer)
    if (this.props.isAnswered) {
      return (
        <View>
          {this.props.correct && (
            <Text>Congratulations! You answered {this.props.givenAnswer} and the answer was {this.props.answer}!</Text>
          )}
          {!this.props.correct && (
            <Text>Sorry! Whereas you picked {this.props.givenAnswer}, the answer was {this.props.answer}!</Text>
          )}
          <Text>Here's the solution:</Text>
          <Text>{this.props.answerScheme}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
}

const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    path: '',
    navigationOptions: {
      headerShown: false,
    },
  },
  Forgot: {
    screen: ForgotPassword,
    navigationOptions: {
      headerShown: false,
    },
  },  
  Register: {
    screen: Register,
    navigationOptions: {
      headerShown: false,
    },
  },
});

// const Stack = createStackNavigator();

// const AuthStackNavigator = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Welcome" component={Welcome} />
//     <Stack.Screen name="Login" component={Login} />
//     <Stack.Screen name="Register" component={Register} />
//     <Stack.Screen name="Forgot" component={Forgot} />
//   </Stack.Navigator>
// );

// const 

// const QuestionStackNavigator = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Questions" component={Questions}/>
//     <Stack.Screen name="Make" component={MakeQuestion} />
//     <Stack.Screen name="Quiz" component={Quiz} />
//   </Stack.Navigator>
// );

// const questionSwitchNavigator = (isDone) => (
//   <Stack.Navigator>
//     {isDone && (
     
//     )}
//   </Stack.Navigator>
// );

const adminQuestionStackNavigator = createStackNavigator({
  Questions: {
    screen: AdminQuestions,
  },
  AdminViewQuestion: {
    screen: AdminViewQuestion
  },
  MakeQuestion: {
    screen: MakeQuestion,
  },
  EditQuestion: {
    screen: EditQuestion,
  },
  Quiz: Quiz,
});

adminQuestionStackNavigator.navigationOptions = {
  tabBarLabel: 'Questions',
  initialRouteName: 'Questions'
};  

const questionStackNavigator = createStackNavigator({
  Questions: {
    screen: Questions,
  },
  MakeQuestion: {
    screen: MakeQuestion,
  },
  ViewQuestion: {
    screen: ViewQuestion,
  },
});

questionStackNavigator.navigationOptions = {
  tabBarLabel: 'Questions',
  initialRouteName: 'Questions',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'purple',
      color: 'white',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  }
};

const questionSwitchNavigator = createSwitchNavigator({
  Favourites: {
    screen: Favourites,
  },
  Quiz: Quiz,
  DataUpload: {
    screen: DataUpload,
  }
});

questionSwitchNavigator.navigationOptions = { 
  tabBarLabel: 'Favourites',
  initialRouteName: 'Favourites',
  headerStyle: {

  }
  // tabBarVisible: navigation.state.getParam("hideTabBar") != null ? !(navigation.state.getParam("hideTabBar")) : true,
};

const profileNavigator = createStackNavigator({
  Profile: {
    screen: Profile,
  },
  Settings: {
    screen: Settings,
  },
  Statistics: {
    screen: Statistics,
  },
  Personal: {
    screen: Personal,
  },
  Account: {
    screen: Account,
  }
});

profileNavigator.navigationOptions = {
  tabBarLabel: 'Profile',
  initialRouteName: 'Profile'
};

const adminQuestionSwitchNavigator = createSwitchNavigator({
  Favourites: {
    screen: Favourites,
  },
  Quiz: Quiz,
  DataUpload: {
    screen: DataUpload,
  },
  BlacklistUsers: BlacklistUsers,
});

adminQuestionSwitchNavigator.navigationOptions = {
  tabBarLabel: 'Favourites',
  initialRouteName: 'Favourites',
};

const AdminHomepageTabNavigator = createBottomTabNavigator({
  Home,
  adminQuestionStackNavigator,
  adminQuestionSwitchNavigator,
  profileNavigator,
});

const HomepageTabNavigator = createBottomTabNavigator({
  Home,
  questionStackNavigator,
  questionSwitchNavigator,
  profileNavigator
});

const AppSwitchNavigator = createSwitchNavigator({
  Auth: AuthStack, 
  ForgotPassword: {
    screen: ForgotPasswordForm,
    path: 'forgotpassword/:token'
  },
  AdminLogin: AdminLogin,
  Home: HomepageTabNavigator,
  AdminHomepage: AdminHomepageTabNavigator
});

const AppContainer = createAppContainer(AppSwitchNavigator);

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
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: 'purple',
    width: WIDTH,
    color: 'white',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 16,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  passwordInput: {
    marginTop: 16,
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
  picker: {
    height: 100,
    width: 100
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
  katex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
