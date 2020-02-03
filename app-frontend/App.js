import React, { Component } from 'react';
import { StyleSheet, Text, View,  FlatList, AsyncStorage, Picker, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { SearchBar, CheckBox, Input, Button, ListItem, Icon, Card } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { Linking } from 'expo';

const web = require('./test.html');
// import Welcome from './components/Welcome';
// import Home from './components/Home';
// import Login from './components/Login';
// import Questions from './components/Questions';
// import Quiz from './components/Quiz';

const WIDTH = Dimensions.get('window').width; 

const initialUrl = Linking.makeUrl('/');

class App extends Component {
  render() {
    return <AppContainer uriPrefix={initialUrl}/>;
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
    // if (Platform.OS === 'android') {
    //   Linking.getInitialURL().then((url) => {this.navigate(url)});
    // } else {
    //   Linking.addEventListener('url', this.handleOpenURL)
    // }

    var token = await AsyncStorage.getItem("id");
    if (token != null) {
      try {
        let response = await fetch('http://192.168.0.12:3000/auth/login', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
          }
        });
        let res = await response.json();
        if (res.success === "true") {
          this.setState({isVerified: true});
        } else {
          this.setState({isVerified: false});
        }
      } catch (err) {
        alert(err);
      }
    } else {
      this.setState({isVerified: false});
    }
  }

  // componentWillUnmount() {
  //   Linking.removeEventListener('url', this.handleOpenURL);
  // }

  // handleOpenURL = (url) => {
  //   let {path, token} = Linking.parse(url);
  //   let navPath = path.charAt(0).toUpperCase();
  //   this.props.navigation.navigate(navPath, {token: token});
  // }

  render() {
    if (this.props.isVerified) {
      return (
        <View>
          <Button title="Login" onPress={() => this.props.navigation.navigate("Home")} />
          <Button title="Haven't got an account? Register here!" onPress={() => this.props.navigation.navigate("Register")} />
          <Button title="Forgot Password? Click here" onPress={() => this.props.navigation.navigate("Forgot")} /> 
        </View>
      );
    } else {
      return (
        <View>
          <Button title="Login" onPress={() => this.props.navigation.navigate("Login")} />
          <Button title="Haven't got an account? Register here!" onPress={() => this.props.navigation.navigate("Register")} />
          <Button title="Forgot Password? Click here" onPress={() => this.props.navigation.navigate("Forgot")} /> 
        </View>
      );
    }
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false,
      color: '#4c8bf5'
    }
  }

  async sendData() {
    console.log(`Username: ${this.state.username}\nPassword: ${this.state.password}\nRemember: ${this.state.remember}`);
    try {
      let response = await fetch('http://192.168.0.12:3000/auth/login', {
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
        if (res.remember === true) {
          await AsyncStorage.setItem('remember', true);
        }
        this.props.navigation.navigate('Home');
        console.log(res);
      } else {
        console.log (res.message);
      }
    } catch (err) {
      console.log(err);
    }
    console.log(AsyncStorage.getItem('remember'));
  }

  setRemember() {
    if (this.state.remember === true) {
      var colour = '#4c8bf5';
    } else {
      colour = '#0078d7';
    }
    this.setState({remember: !this.state.remember, color: colour});
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
        if (res.success === true) {
          const id_token = res.token;
          await AsyncStorage.setItem('id', id_token);
          this.props.navigation.navigate('Home');
        } else {
          alert(res.errors);
        }
      } catch (err) {
        alert(err);
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

class ForgotPassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: null,
      received: false,
      error: null
    }
  }

  async sendData() {
    let response = await fetch('http://192.168.0.12:3000/auth/forgot', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Basic"
      },
      body: JSON.stringify({
        "email": this.state.email,
        "url" : initialUrl,
        "routeName": "forgotpassword"
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

  async componentDidMount() {
    Linking.addEventListener('url', this.handleDeepLink);
    let response = await fetch(`http://192.168.0.12:3000/auth/reset/${token}`, {
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
    let response = await fetch(`http://192.168.0.12:3000/auth/reset/${token}`, {
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

class Questions extends Component {
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
      const token = await AsyncStorage.getItem("id");
      const response = await fetch('http://192.168.0.12:3000/questions/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      const json = await response.json();
      this.setState({questions: json, isLoading: false});
      console.log(this.state.questions);
    } catch (err) {
      console.log("Error occured");
      this.setState({error: err});
    }
  }

  async sendData() {
    try {
      let response = await fetch(`http://192.168.0.12:3000/questions/${this.state.type}/${this.state.search}`, {
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


  render() {
      return (
        <ScrollView>
          <SearchBar 
          onChangeText={(item) => this.setState({search: item})}
          onClearText={()=> this.setState({search: ''})}
          lightTheme
          placeholder='Enter here....'
          /> 
          <Button title="Apply" onPress={(item) => this.sendData(item)} />
          <FlatList 
            data={this.state.questions}
            renderItem = {({item, index}) => 
                <TouchableOpacity style={styles.container}>
                  <Card/>
                  <Text>{item.name}</Text>
                  <Text>{item.topic}</Text>
                  <Text>{item.difficulty}</Text>
                </TouchableOpacity>
            }
            keyExtractor={item.name}
          />
        </ScrollView>
      );
  }
}

class Favourites extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      error: null,
      isLoading: true
    }
  }
  
  async componentDidMount() {
    try {
      var token = await AsyncStorage.getItem("id");
      const response = await fetch('http://192.168.0.12:3000/user/questions', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      const json = await response.json();
      this.setState({questions: json, isLoading: false});
      console.log(this.state.questions);
    } catch (err) {
      console.log("Error occured");
      this.setState({error: err});
    }
  }

  render() {
    return (
      <ScrollView>
          <FlatList 
            data={this.state.questions}
            renderItem = {({item, index}) => 
                <View style={styles.itemStyle}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Quiz", {questions: item})}>
                  <Text>{item.name}</Text>
                  </TouchableOpacity>
                </View>
            }
            keyExtractor={this.state.questions.name}
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
      difficulty: 0,
      content: '',
      answer: '',
      solution: '',
      options: [],
      correct: false
    }
  }

  sendData = () => {
    var token = AsyncStorage.getItem("id");
    fetch('http://192.168.0.12:3000/questions/makequestion', {
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
      })
    }).then((res) => console.log(res.json()))
      .then(this.props.navigation.navigate("MakeQuestion"))
      .catch((err) => console.log(err)).done(); 
  }
  render() {
    return (
      <View style={styles.makequestion}>
        <Text>Here we can make new questions!</Text>
        <Input placeholder="Question Title"  onChangeText={(name) => this.setState(name)}  />
        <View>
        <Text>Please set a question type:</Text>
          <Picker selectedValue={this.state.type} mode={Picker.MODE_DROPDOWN} onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})} style={styles.picker}>
            <Picker.Item value="true-false">True-False</Picker.Item>
            <Picker.Item value="multi-choice">Multiple Choice</Picker.Item>
            <Picker.Item value="normal">Normal</Picker.Item>
          </Picker>
        </View>
        {(this.state.type === "multi-choice") && 
          <View>
            <Input placeholder="Option 1" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
            <Input placeholder="Option 2" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
            <Input placeholder="Option 3" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
            <Input placeholder="Option 4" onChangeText={(text) => this.setState({options: this.state.options.concat(text)})} />
          </View>
        }
        <View>
          <Text>Please select the question topic:</Text>
          <Picker selectedValue={this.state.topic} style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 50, width: 100}} onValueChange={(itemValue) => this.setState({topic: itemValue})}>
            <Picker.Item label="Regular Languages" value="automata" />
            <Picker.Item label="Context-Free Languages" value="cfls" />
            <Picker.Item label="Turing Machines" value="turing" />
            <Picker.Item label="Lexing-Parsing" value="lexing-parsing" />
          </Picker>  
        </View>
        <Input placeholder="Answer to Question" onChangeText={(text) => {
          if (this.state.type === "multi-choice") {
            this.setState({options: this.state.options.concat(text)});
          }
          this.setState({answer: text});
        }} />
        <Input placeholder="Solution to problem" multiline={true} onChangeText={(text) => this.setState({solution: text})} />
        <Button style={styles.button} title="Submit question!" onPress={this.sendData()} />
      </View>
    );
  }
}

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      remember: false
    }
  }


  _handleLogout = () => {
    if (!this.state.remember) {
      AsyncStorage.removeItem("id");
      this.props.navigation.navigate("Welcome");
    } else {
      this.props.navigation.navigate("Welcome");
    }
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.container}>
          <Text>Log out here!!!</Text>
          <Button style={styles.button} onPress={this._handleLogout} title="Log Out" />
        </View>
      );
    } else {
      return null;
    }
  }
}

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      correct: false, 
      index: 1,
      answered: false,
      questions: [],
      normalAnswer: ""
    }
  }

  componentDidMount() {
    this.setState({questions: this.props.navigation.getParam('questions'), isLoading: false});
  }

  isCorrect(value) {
    if (value === this.state.questions.answer[0]) {
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
      if (this.state.questions.type === "true_false") {
        return (
          <View style={styles.truefalse}>
            <Text>{this.state.questions.question}</Text>
            <Button title="True" onPress={() => this.isCorrect(true)} />
            <Button title="False" onPress={() => this.isCorrect(false)} />
          </View>
        );
      } else if (this.state.questions.type === "multi_choice") {
        return (
          <View style={styles.multichoice}>
            <Text> {this.state.questions.question}</Text>
            <Button title={this.state.questions.options[0]} value="A" onPress={() => this.isCorrect(this.state.questions.options[0])} />
            <Button title={this.state.questions.options[1]} value ="B" onPress={() => this.isCorrect(this.state.questions.options[1])} />
            <Button title={this.state.questions.options[2]} value="C" onPress={() => this.isCorrect(this.state.questions.options[2])} />
            <Button title={this.state.questions.options[3]} value="D" onPress={() => this.isCorrect(this.state.questions.options[3])} />
            <Text style={styles.question}> {this.state.questions.question}</Text>
          </View>
        );
      } else if (this.state.questions.type === "normal_answer") {
        return (
          <View>
            <Text> {this.state.questions.question}</ Text>
            <Input placeholder="Answer here" onChangeText={(item) => this.setState({normalAnswer: item})}/>
            <Button title="Check answer" onPress={() => this.isCorrect(this.state.normalAnswer)} />
          </View>
        );
      } else {
        return (
          <View>
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
      </View>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <View>
        <Text>Settings Screen</Text>
      </View>
    );
  }
}

class Statistics extends Component {
  render() {
    return(
      <View>
        <Text>Its Timmy T</Text>
      </View>
    );
  }
}

class Personal extends Component {
  render() {
    return (
      <View>
        <Text>Data Preferences</Text>
      </View>
    );
  }
}

class Account extends Component {
  render() {
    return (
      <View>
        <Text>My details: </Text>
        <Text>Personal Information</Text>
      </View>
    );
  }
}

class DataUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question_id: null,
      correct: false
    }
  }

  componentDidMount(){ 
    this.setState({
      question_id: this.props.navigation.getParam('question_id'),
      correct: this.props.navigation.getParam('correct')
    }); 
  }

  async sendData() {
    let token = await AsyncStorage.getItem("id");
    try {
      let response = await fetch('http://192.168.0.12:3000/sendanswer', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "Authorization": "Bearer" + token
        },
        body: JSON.stringify({
          question_id: this.state.question_id,
          correct: this.state.correct
        })
      });
      let res = await response.json();
      if (res.success === true) {
        this.props.navigation.navigate("Questions");
        console.log("Question successfully made!");
        alert("Done");
      } else {
        this.props.navigation.navigate("Question");
        console.log("Question logging failed");
        alert("Not done");
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <View>
        <ActivityIndicator size="large" color="0000ff" />
        <Text>This will just be a minute.</Text>
      </View>
    );
  }
}

const AuthStack = createStackNavigator({
  Welcome: {
    screen: Welcome,
    routeName: ''
  },
  Login: {
    screen: Login,
    routeName: 'login'
  },
  Forgot: {
    screen: ForgotPassword,
    routeName: 'forgot'
  },  
  Register: {
    screen: Register,
    routeName: 'register'
  }
});

const questionStackNavigator = createStackNavigator({
  Questions: {
    screen: Questions,
    routeName: 'questions/:user'
  },
  MakeQuestion: {
    screen: MakeQuestion,
    routeName: 'questions/make/:user'
  }, 
  Quiz: Quiz
});

const questionSwitchNavigator = createSwitchNavigator({
  questionStackNavigator: questionStackNavigator,
  DataUpload: DataUpload,
  Home: {
    screen: Home,
    routeName: 'home/:user'
  }
});

questionSwitchNavigator.navigationOptions = { 
  tabBarLabel: 'Questions',
  initialRouteName: 'Questions'
};

const profileNavigator = createStackNavigator({
  Profile: {
    screen: Profile,
    routeName: 'profile/:user',
  },
  Settings: {
    screen: Settings,
    routeName: 'settings/:user',
  },
  Statistics: {
    screen: Statistics,
    routeName: 'statistics/:user',
  },
  Personal: {
    screen: Personal,
    routeName: 'personal/:user',
  },
  Account: {
    screen: Account,
    routeName: 'account/:user',
  },
  Logout: Logout
});

profileNavigator.navigationOptions = {
  tabBarLabel: 'Profile',
  initialRouteName: 'Profile'
};

const HomepageTabNavigator = createBottomTabNavigator({
  Home,
  questionSwitchNavigator,
  Favourites,
  profileNavigator
});




// const HomepageDrawerNavigator =  createDrawerNavigator({
//   Homepage: {
//     screen: HomepageStackNavigator
//   }
// });

const AppSwitchNavigator = createSwitchNavigator({
  Auth: AuthStack, 
  ForgotPassword: {
    screen: ForgotPasswordForm,
    routeName: 'forgotpassword/:token'

  },
  Homepage: HomepageTabNavigator,
  Welcome: Welcome
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  rememberDisabled: {
    backgroundColor: '#4c8bf5'
  },
  rememberEnabled: {
    backgroundColor: '#0078d7'
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
  }
});
