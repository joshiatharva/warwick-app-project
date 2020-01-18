import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator, TextInput, TouchableOpacity, Switch} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { WebView } from 'react-native-webview';

const web = require('./test.html');
// import Welcome from './components/Welcome';
// import Home from './components/Home';
// import Login from './components/Login';
// import Questions from './components/Questions';
// import Quiz from './components/Quiz';

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVerified: false
    }
  }

  async componentDidMount() {
    var token = await AsyncStorage.getItem("id");
    if (token != null) {
      try {
        let response = await fetch('http://172.31.40.77:3000/auth/login', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer' + " " + token
          }
        });
        let res = await response.json();
        if (res.success === "true") {
          this.setState({isVerified: true});
        } else {
          this.setState({isVerified: false});
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      this.setState({isVerified: false});
    }
  }
  render() {
    if (this.state.isVerified) {
      return (
        <View style={styles.container}>
          <Button title="Login" onPress={() => this.props.navigation.navigate("Home")} />
          <Button title="Haven't got an account? Register here!" onPress={() => this.props.navigation.navigate("Register")} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Button title="Login" onPress={() => this.props.navigation.navigate('Login')} />
          <Button title="Haven't got an account? Register here!" onPress={() => this.props.navigation.navigate("Register")} />
        </View>
      );
    }
  }
}


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pswd: '',
      isVerified: false,
      remember: false
    }
  }

  async sendData() {
    try {
      var username = this.state.user;
      var password = this.state.pswd;
      let response = await fetch('http://172.31.40.77:3000/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer'
        },
          body: JSON.stringify({
          "username": username,
          "password": password
        })
      })
      let res = await response.json()
      if (res.success === "true") {
        const id_token = res.id_token;
        await AsyncStorage.setItem('id', id_token);
        this.props.navigation.navigate('Home');
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  setRemember() {

  }
  render() {
    if (this.state.isVerified) {
      this.props.navigation.navigate("Home");
      return null;
    } else {
      return (
        <View style={styles.container}>
          <TextInput placeholder='Username' onChangeText={(username) => this.setState({user: username})} />
          <TextInput placeholder='Password' secureTextEntry={true} onChangeText={(password) => this.setState({pswd: password})} />
          <Button style={!remember ? styles.rememberDisabled : styles.rememberEnabled} title="Remember Me" onPress={this.setRemember.bind(this)} />
          <Button 
            title="Signin" 
            onPress={this.sendData.bind(this)}
          />
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
    if (this.state.passwordconf === this.state.password) {
      try {
        let response = await fetch('http://172.31.40.77:3000/auth/register', {
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
            "email": this.state.email
          })
        });
        let res = await response.json();
        if (res.success === "true") {
          const id_token = res.id_token;
          AsyncStorage.setItem('id', id_token);
          this.props.navigation.navigate('Home');
        } else {
          alert(res.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Given passwords do not match!");
    }
  }

  render() {
      return (
        <View style={styles.container}>
          <TextInput placeholder="First Name" onEndEditing={(item) => this.setState({username: item})} />
          <TextInput placeholder="Last Name" onEndEditing={(item) => this.setState({lastname: item})} />
          <TextInput placeholder="Email" onEndEditing={(item) => this.setState({email: item})} />
          <TextInput placeholder="Username" onEndEditing={(item) => this.setState({username: item})} />
          <TextInput placeholder="Password" secureTextEntry={true} onEndEditing={(item) => this.setState({password: item})} />
          <TextInput placeholder="Confirm Password" secureTextEntry={true} onEndEditing={(item) => this.setState({passwordconf : item})} />
          <Button onPress={this.sendData()} title="Register now!" />
        </View> 
      );
  }
}

class Home extends Component {
  render() {
    return (
        <WebView
          originWhitelist={['*']}
          source={web}
          javaScriptEnabled={true}
        />
    );
  }
}

class Search extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Search Screen!</Text>
        <View></View>
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
      error: null
    }
  }


  componentWillMount() {
    this.fetchData();
  }
  

  async fetchData() {
    try {
      var token = await AsyncStorage.getItem("id");
      const response = await fetch('http://172.31.40.77:3000/questions/getquestions/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer' + " " + token
        }
      });
      const json = await response.json();
      this.setState({isLoading: false, questions: json});
      console.log(this.state.questions);
    } catch (err) {
      this.setState({isLoading: false, error: err});
      console.log(this.state.error);
    }
  }

  render() {
      return (
        <View style={styles.container}>
        {this.state.questions.map((item) => {
          return (
            <View key={item._id} style={styles.question}>
            <Text>{item.name}</Text>
            <Text>{item.topic}</Text>
            <Text>{item.difficulty}</Text>
          </View> 
          );
        })
        }
        </View>
      );
  }
}

class Local extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      type: null,
      topic: '',
      difficulty: 0,
      content: '',
      answer: '',
      solution: ''

    }
  }

  sendData = () => {
    var token = AsyncStorage.getItem("id");
    fetch('http://172.31.40.77:3000/questions/makequestion', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
        "Authorization": "Bearer" + " " + token
      },
      body: JSON.stringify({
        name: this.state.name,
        type: this.state.type,
        topic: this.state.topic,
        difficulty: this.state.difficulty,
        answer: this.state.answer,
        solution: this.state.solution
      })
    }).then((res) => alert(res.json()))
      .then(() => this.props.navigation.navigate("Questions"))
      .catch((err) => alert(err)).done(); 
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Here we can make new questions!</Text>
        <TextInput placeholder="Question Title"  onChangeText={(name) => this.setState(name)}  />
        <Picker
          selectedValue={this.state.type}
          mode={Picker.MODE_DROPDOWN}
          onValueChange={(itemValue) => this.setState({type: itemValue})}>
          <Picker.Item value="true-false">True-False</Picker.Item>
          <Picker.Item value="multi-choice">Multiple Choice</Picker.Item>
          <Picker.Item value="normal">Normal</Picker.Item>
        </Picker>
        <Picker
          selectedValue={this.state.topic}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 50, width: 100}}
          onValueChange={(itemValue) => this.setState({topic: itemValue})}>
          <Picker.Item label = "DFA's, NFA's, Regular Languages"value="automata" />
          <Picker.Item label="Context-Free Languages" value="cfls" />
          <Picker.Item label="Turing Machines" value="turing" />
          <Picker.Item label="Lexing-Parsing" value="lexing-parsing" />
        </Picker>
      </View>
    );
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  async logout() {
    await AsyncStorage.removeItem("id", function(err) {
      console.log(err);
    });
    this.props.navigation.navigate("Welcome");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Log out here!!!</Text>
        <Button onPress={this.logout()} title="Log Out" />
      </View>
    );
  }
}

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showResult: false,
      correct: false, 
      index: 1,
      answered: false,
      questions: [],
    }
  }

  componentDidMount(){
    this.setState({questions: this.navigation.state.data, isLoading: false});
  }

  isCorrect = (value) => {
    if (value === this.state.questions.answer) {
      this.setState({correct: true});
      alert("Correct!");
      this.props.navigation.navigate('DataUpload');
    } else {
      this.setState({correct: false});
      alert(`Sorry! The correct answer was ${this.state.questions.answer}!`);
      this.props.navigation.navigate('DataUpload');
    }
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.qbackground}>
          <View>
            <Button onPress={()=> this.props.navigation.goBack()} />
          </View>
          
          <Text style={styles.question}> {this.state.questions.question}</Text>
          <Button placeholder="True" value="true" onPress={() => this.isCorrect(true).bind(this)} />
          <Button placeholder="False" value ="false" onPress={() => this.isCorrect(false).bind(this)} />
        </View>
      );
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

class DataUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
      question_id: null,
      correct: false
    }
  }

  componentDidMount(){ 
    this.setState({user_id: this.props.navigation.state})  
  }

  render() {
    return (
      <View>
        <ActivityIndicator size="large" color="0000ff" />
        <Text style={styles.loading}>This will just be a minute.</Text>
        <Button title="Go to Questions" onPress={this.props.navigation.navigate("Questions")} />
      </View>
    );
  }
}

const HomepageTabNavigator = createBottomTabNavigator({
  Home,
  Search,
  Questions,
  Local,
  Profile
});

const questionStackNavigator = createStackNavigator({
  Questions: Questions,
  Quiz: Quiz
});

const questionSwitchNavigator = createSwitchNavigator({
  questionStackNavigator: questionStackNavigator,
  DataUpload: DataUpload,
  Home: Home
});

questionSwitchNavigator.navigationOptions = { 
  tabBarLabel: 'Questions'
}



// const HomepageDrawerNavigator =  createDrawerNavigator({
//   Homepage: {
//     screen: HomepageStackNavigator
//   }
// });

const AuthStack = createStackNavigator({
  Welcome: Welcome, 
  Login: Login,
  Register: Register
});

const AppSwitchNavigator = createSwitchNavigator({
  Auth: AuthStack, 
  Homepage: HomepageTabNavigator,
  Welcome: Welcome
});


const AppContainer = createAppContainer(AppSwitchNavigator);


// main = StackNavigator
// ->Login
// ->ForgotPassword
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
  container: {
    flex: 1,
    alignItems: 'center',
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
  rememberDisabled: {
    color: '#4c8bf5'
  },
  rememberEnabled: {
    color: '0078d7'
  }
});
