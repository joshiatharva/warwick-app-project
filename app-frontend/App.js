import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, Picker, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert } from 'react-native';
import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { SearchBar, CheckBox, Input, Button, ListItem, Icon, Slider } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { Linking } from 'expo';
import Canvas from 'react-native-canvas';
import SlidingUpPanel from 'rn-sliding-up-panel';
import MathJax from 'react-native-mathjax';
import { ApplicationProvider, Select, Text, Card } from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';

const test = require('./test.js');
// import Welcome from './components/Welcome';
// import Home from './components/Home';
// import Login from './components/Login';
// import Questions from './components/Questions';
// import Quiz from './components/Quiz';

//TODO: 

{
	"question_id": "5e1a332d2cef8707f4b01190",
	"correct": false
}


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
          this.setState({isVerified: true}, () => console.log(this.state.isVerified));
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

  // componentWillUnmount() {
  //   Linking.removeEventListener('url', this.handleOpenURL);
  // }

  // handleOpenURL = (url) => {
  //   let {path, token} = Linking.parse(url);
  //   let navPath = path.charAt(0).toUpperCase();
  //   this.props.navigation.navigate(navPath, {token: token});
  // }
  

  render() {
    if (this.state.isVerified) {
      return (
        <View style={styles.welcome}>
          <Button title="Login" onPress={() => this.props.navigation.navigate("Home")} />
          <Button title="Haven't got an account? Register here!" onPress={() => this.props.navigation.navigate("Register")} />
          <Button title="Forgot Password? Click here" onPress={() => this.props.navigation.navigate("Forgot")} /> 
        </View>
      );
    } else {
      return (
        <View style={styles.welcome}>
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
        <View style={styles.container}>
          <Text>Math component here</Text>
          <MathFormulaeComponent />
          <DFADrawingComponent />
        </View>
    );
  }
}

// class ForgotPassword extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       email: null,
//       received: false,
//       error: null
//     }
//   }

//   async sendData() {
//     let response = await fetch('http://192.168.0.16:3000/auth/forgot', {
//       method: 'POST',
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Basic"
//       },
//       body: JSON.stringify({
//         "email": this.state.email,
//         "url" : initialUrl,
//         "path": "forgotpassword"
//       })
//     });
//     let res = await response.json();
//     if (!res.error) {
//       this.setState({received: true, error: false}, () => console.log("received: " + this.state.received + "\nerror: " + this.state.error));
//     } else {
//       this.setState({received: true, error: true}, () => console.log("received: " + this.state.received + "\nerror: " + this.state.error));
//     }
//   }

//   render() {
//     if (!this.state.received && !this.state.error) {
//       return (
//         <View>
//           <Text>Please enter your email to receive your reset password link:</Text>
//           <Input placeholder="Enter your email here" onChangeText={(item) => this.setState({email: item})} />
//           <Button raised title="Send link" onPress={() => this.sendData()} />
//         </View>
//       );
//     } else if (this.state.received && !this.state.error) {
//       <View>
//         <Text>Your email has been sent to your account at {this.state.email}!</Text>
//       </View>
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

//   async componentDidMount() {
//     Linking.addEventListener('url', this.handleDeepLink);
//     let response = await fetch(`http://192.168.0.16:3000/auth/reset/${token}`, {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer'
//       },
//     });
//     let res = await response.json();
//     this.setState({error: res.error});
//   }

//   async sendData() {
//     let token = 12345;
//     let response = await fetch(`http://192.168.0.16:3000:3000/auth/reset/${token}`, {
//       method: "POST",
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer'

//       },
//       body: JSON.stringify({
//         "password": this.state.password,
        
//       })
//     });
//     let res = await response.json();
//     this.props.navigation.navigate("Home");
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
//       type: 'all',
//     }
//   }

//   static navigationOptions = ({navigation}) => {
//     return {
//       headerRight: () => (
//         <Button
//           type="clear"
//           title="New Question"
//           onPress={() => {navigation.navigate("MakeQuestion")}}
//         />
//       ),
//     };
//   }

//   async componentDidMount() {
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
//       this.setState({questions: json, isLoading: false}, () => console.log("Questions: " + this.state.questions + "\nisLoading: " + this.state.isLoading));
//     } catch (err) {
//       this.setState({error: err}, () => console.log("Error: " + this.state.error));
//     }
//   }

//   async getData() {
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
//       console.log("Error occurred: " + err);
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
//       if (res.success == true) {
//         console.log(res);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   render() {
//       return (
//         <ScrollView>
//           <SearchBar 
//           onChangeText={(item) => this.setState({search: item})}
//           onClearText={()=> this.setState({search: ''})}
//           lightTheme
//           placeholder='Enter here....'
//           /> 
//           <Button title="Apply" onPress={(item) => this.getData(item)} />
//           <FlatList 
//             data={this.state.questions}
//             renderItem = {({item, index}) =>
//                 <Card>
//                   <TouchableOpacity style={styles.container} onPress={() => {
//                   Alert.alert('Add Question?', 'Add this Question to your Favourites?', [ {text: 'No', onPress: () => console.log("refused")}, {text: 'Yes', onPress: () => this.saveQuestion(item._id)}])}
//                   }>
//                     <Text>{item.name}</Text>
//                     <Text>{item.topic}</Text>
//                     <Text>{item.difficulty}</Text> 
//                 </TouchableOpacity>
//                 </Card>
//             }
//             keyExtractor={this.state.questions._id}
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
//       this.setState({questions: json, isLoading: false});
//     } catch (err) {
//       console.log("Error occured");
//       this.setState({error: err});
//     }
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

//   render() {
//       return (
//         <ScrollView>
//           <SearchBar 
//           onChangeText={(item) => this.setState({search: item})}
//           onClearText={()=> this.setState({search: ''})}
//           lightTheme
//           placeholder='Enter here....'
//           /> 
//           <Button title="Apply" onPress={(item) => this.sendData(item)} />
//           <FlatList 
//             data={this.state.questions}
//             renderItem = {({item, index}) =>
//               <View> 
//                 <TouchableOpacity style={styles.container} onPress={() => Alert.alert('Add Question?', 'Add this Question to your Favourites?', [ {text: 'No', onPress: () => console.log("refused")}, {text: 'Yes', onPress: () => this.saveQuestion(item._id)}])}>
//                   <Card>
//                     <Text>{item.name}</Text>
//                     <Text>{item.topic}</Text>
//                     <Text>{item.difficulty}</Text> 
//                   </Card>
//                 </TouchableOpacity>
//               </View>
//             }
//             keyExtractor={this.state.questions.name}
//           />
//         </ScrollView>
//       );
//   }
// }

// class EditQuestion extends Component {
//   constructor(props) {
//     this.topics = [];
//     super(props);
//     this.state = {
//       question_id: null,
//       question_name: "",
//       question_question: "",
//       question_type: "",
//       question_options: [],
//       question_answer: "",
//       question_solution: "",
//       question_difficulty: 1,
//       question_topic: "",
//       isLoading: false,
//     }
//   }

//   async componentDidMount() {
//     this.setState({
//       question_name: this.props.navigation.getParam("Question").name,
//       question_question: this.props.navigation.getParam("Question").question,
//       question_type: this.props.navigation.getParam("Question").type,
//       question_options: this.props.navigation.getParam("Question").options,
//       question_answer: this.props.navigation.getParam("Question").answer,
//       question_solution: this.props.navigation.getParam("Question").solution,
//       question_difficulty: this.props.navigation.getParam("Question").difficulty,
//     });
//     let response = await fetch("http://192.168.0.16:3000/topics/all", {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//     });
//     let res = await response.json();
//     this.topics = res;
//   }

//   async editQuestion() {

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
//     return (
//           <View style={styles.makequestion}>
//             <Text>Here we can make new questions!</Text>
//             <Input placeholder={this.state.question_name} onChangeText={(name) => this.setState({question_name: name})} />
//             <Input placeholder={this.state.question_question} multiline={true} onChangeText={(text) => this.setState({question_question: text})} />
//             <View>
//             <Text>Please set a question type:</Text>
//               <Select
//                 placeholder={this.state.question_type}
//                 data={types}
//                 selectedOption={this.state.question_type}
//                 onSelect={(value) => this.setState({type: value.text}, () => console.log(this.state.type))}/>
//             </View>
//             {(this.state.type.text === "Multiple Choice") && (
//             <View>
//               <Input placeholder={this.state.question_options[0]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
//               <Input placeholder={this.state.question_options[1]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
//               <Input placeholder={this.state.question_options[2]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
//               <Input placeholder={this.state.question_options[3]} onChangeText={(text) => this.setState({options: options.concat(text)})} />
//             </View>
//             )}
//             {(this.state.type === "Normal Answer") && (
//               <View>
//                 <Text>No options required - move onto next field!</Text> 
//               </View>
//             )}
//             {(this.state.type === "True-False") && (
//               <View>
//                 <Button disabled title="True"/> 
//                 <Button disabled title="False"/>
//               </View> 
//             )}
//             <View>
//               <Text>Please select the question topic:</Text>
//               <Select 
//                 data={topics}
//                 selectedOption={this.state.question_topic}
//                 onSelect={(item) => this.setState({question_topic: item.text})} 
//               />  
//             </View>
//             <Input placeholder="Answer to Question" onChangeText={(text) =>
//               this.setState({question_answer: text}, () => {
//                 if (this.state.type == "multi_choice" && !this.state.options.includes(text)) {
//                   alert("Answer must also be included within the options provided!");
//                 }
//               }); 
//             } />
//             <Input placeholder="Solution to problem" multiline={true} onChangeText={(text) => this.setState({question_solution: text})} />
//             <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.question_difficulty} onValueChange={value => this.setState({question_difficulty: value}, () => console.log("Difficulty: " + this.state.question_difficulty))} />
//             <Button style={styles.button} title="Submit question!" onPress={this.sendData()} />
//           </View>
//     );
//   }
// }

class MathFormulaeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: "",
      loaded: false
    }
  }

  render() {
    let string = "$\\sum_{i=0}^n i^2 = \\frac{(n^2+n)(2n+1)}{6}$";
    return <MathJax 
      html={string}
      mathJaxOptions={{
        messageStyle: 'none',
        extensions: [ 'tex2jax.js' ],
        jax: [ ' input/TeX', 'output/HTML-CSS'],
        tex2jax: {
          inlineMath: [ ['$', '$'], ['\\(','\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]'] ],
          processEscapes: true,
        },
        TeX: {
          extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
        }
      }}
    />;
  }
}

class DFADrawingComponent extends Component {
  constructor(){
    super();
    this.ctx = {};
    this.state = {
      ctx: null,
    }
  }

  handleCanvas = async (canvas) => {
    if (canvas != null) {
      this.setState({ctx: canvas.getContext('2d')});
      try {
        this.state.ctx.lineWidth = 10;

      // Wall
        await this.state.ctx.strokeRect(75, 140, 150, 110);

      // Door
        await this.state.ctx.fillRect(130, 190, 40, 60);

      // Roof
        await this.state.ctx.moveTo(50, 140);
        await this.state.ctx.lineTo(150, 60);
        await this.state.ctx.lineTo(250, 140);
        await this.state.ctx.closePath();
        await this.state.ctx.stroke();
      } catch (err) {
        // console.log(err);
      }
    } else {
      alert("canvas is null");
    }
  }

  // drawCircle = (evt) => {
  //   ctx.beginPath();
  //   ctx.arc(evt.pageX, evt.pageY, 12, 0, Math.PI*2, true);
  //   ctx.stroke();
  //   alert(evt.pageX + ", " + evt.pageY);
  // }

  render() {
    return (
        <Canvas ref={this.handleCanvas} />
    )
  }
}

class Favourites extends Component { 
  constructor() {
    // this.questions = [];
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

  render() {
    return (
      <ScrollView>
          <FlatList 
            data={this.state.questions}
            renderItem = {({item, index}) => (
                <View style={styles.itemStyle}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Quiz", {questions: item}, () => console.log(item))}>
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
      options: []
    }
  }

  async sendData() {
    if (this.state.answer != null && !this.state.options.includes(this.state.answer)) {
      alert("Answer must be included in Options selection!");
      return;
    }
    if (this.state.type == "true_false") {
      this.setState({options: [true, false]});
    }
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
        <Input placeholder="Question Title"  onChangeText={(name) => this.setState({name: name})} />
        <View>
        <Text>Please set a question type:</Text>
          <Select
            data={types}
            selectedOption={this.state.types}
            onSelect={(value) => this.setState({type: value}, () => console.log(this.state.type))}/>
        </View>
        {(this.state.type === "multi_choice") && (
        <View>
          <Input placeholder="Option 1" onChangeText={(text) => this.setState({options: options.concat(text)})} />
          <Input placeholder="Option 2" onChangeText={(text) => this.setState({options: options.concat(text)})} />
          <Input placeholder="Option 3" onChangeText={(text) => this.setState({options: options.concat(text)})} />
          <Input placeholder="Option 4" onChangeText={(text) => this.setState({options: options.concat(text)})} />
        </View>
        )}
        {(this.state.type === "normal_answer") && (
          <View>
            <Text>No options required - move onto next field!</Text> 
          </View>
        )}
        {(this.state.type === "true_false") && (
          <View>
            <Button disabled title="True"/> 
            <Button disabled title="False"/>
          </View> 
        )}
        <View>
          <Text>Please select the question topic:</Text>
          <Select 
            data={topics}
            selectedOption={this.state.topics}
            onSelect={(item) => this.setState({topic: item})} 
          />  
        </View>
        <Input placeholder="Answer to Question" onChangeText={(text) =>
          this.setState({answer: text}, () => console.log(this.state.answer)) }/>  
        <Input placeholder="Solution to problem" multiline={true} onChangeText={(text) => this.setState({solution: text})} />
        <Slider maximumValue={5} minimumValue={1} step={1} value={this.state.difficulty} />
        <Button style={styles.button} title="Submit question!" onPress={this.sendData()} />
      </View>
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

// class Profile extends Component {
//   constructor(props) {
//     super(props);
//   }

//   async _handleLogout(){
//     let token = await AsyncStorage.getItem("id");
//     let response = await fetch("http://192.168.0.16:3000/auth/logout", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + token
//       }
//     });
//     let res = await response.json();
//     if (res.remember != true) {
//       await AsyncStorage.removeItem("id");
//     }
//     this.props.navigation.navigate("Welcome");
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
//       <View>
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

//         <Button title="Logout" onPress={() => this._handleLogout()} />
//       </View>
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

// class Statistics extends Component {
//   constructor(props) {
//     super(props);
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

//   }
//   render() {
//     return(
//       <View>
//         <Text>These are your statistics as follows:</Text>
//         <Text>Marks over all questions:</Text>
//         <Text>Usage Statistics: </Text>
//       </View>
//     );
//   }
// }

// class Personal extends Component {
//   constructor(props) {
//     super(props);
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

//   }

//   render() {
//     return (
//       <View>
//         <Text>Data Preferences</Text>
//       </View>
//     );
//   }
// }

// class Account extends Component {
//   render() {
//     return (
//       <View>
//         <Button title="Edit" />
//         <Text>My details: </Text>
//         <Text>Personal Information:</Text>
//         <Text>Username: {this.state.username}</Text>
//         <Text>First Name: {this.state.firstname}</Text>
//         <Text>Last Name: {this.state.lastname}</Text>
//         <Text></Text>
//       </View>
//     );
//   }
// }

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
    console.log("chosenAnswer" + this.props.navigation.getParam("chosenAnswer"));
    // console.log(this.props.navigation.getParam("Question"));
    // console.log(this.props.navigation.getParam("Question").options[0] + "This is the answer");
    this.setState({
      question: this.props.navigation.getParam("Question"),
      correct: this.props.navigation.getParam("correct"),
      selectedAnswer: this.props.navigation.getParam("chosenValue"),
    }, () => console.log(this.state.question + ", " + this.state.correct));
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
          <AnswerScheme isAnswered={true} answer={this.state.question.answer} answerScheme={this.state.question.solution} correct={this.state.correct} givenAnswer={this.state.chosenAnswer} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
                <Text>Just wait, your result is being sent!</Text>
            </View>
            :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Home")}/> 
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
          <AnswerScheme isAnswered={true} givenAnswer={this.props.navigation.getParam("chosenAnswer")} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ?
          <View> 
            <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
          </View>
          :
          <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Home")}/> 
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
          <AnswerScheme isAnswered={true} givenAnswer={this.state.chosenAnswer} answerScheme={this.state.question.solution} answer={this.state.question.answer} correct={this.state.correct} />
          <View>
          {this.state.isSending ? 
            <View>
              <ActivityIndicator />
              <Text>Just wait, your result is being sent!</Text>
            </View>
          :
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Home")}/> 
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
            <Button title="Click here to go home!" onPress={() => this.props.navigation.navigate("Home")}/> 
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

// const AdminTabNavigator = createBottomTabNavigator({
//   Home, 
//   adminQuestionSwitchNavigator, 
//   Favourites, 
//   profileNavigator
// });

// const adminQuestionSwitchNavigator = createSwitchNavigator({
//   adminQuestionStackNavigator: adminQuestionStackNavigator,
//   DataUpload: DataUpload,
//   Home: {
//     screen: Home,
//   }
// });

// adminQuestionSwitchNavigator.navigationOptions = {
//   tabBarLabel: 'Questions',
//   initialRouteName: 'Questions'
// };

// const adminQuestionStackNavigator = createStackNavigator({
//   Questions: {
//     screen: Questions,
//   },
//   MakeQuestion: {
//     screen: MakeQuestion,
//   },
//   EditQuestion: {
//     screen: EditQuestion,
//   },
//   Quiz: Quiz,
// });

const AuthStack = createStackNavigator({
  Welcome: {
    screen: Welcome,
    path: ''
  },
  Login: {
    screen: Login,
    path: 'login'
  },
  // Forgot: {
  //   screen: ForgotPassword,
  //   path: 'forgot'
  // },  
  Register: {
    screen: Register,
    path: 'register'
  }
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



const questionStackNavigator = createStackNavigator({
  // Questions: {
  //   screen: Questions,
  // },
  // MakeQuestion: {
  //   screen: MakeQuestion
  // }, 
  Favourites: {
    screen: Favourites,
  },
  Quiz: Quiz
});

const questionSwitchNavigator = createSwitchNavigator({
  questionStackNavigator: questionStackNavigator,
  DataUpload: {
    screen: DataUpload,
  }
});

questionSwitchNavigator.navigationOptions = ({navigation, screenProps}) => ({ 
  tabBarLabel: 'Favourites',
  initialRouteName: 'Favourites',
  // tabBarVisible: navigation.state.getParam("hideTabBar") != null ? !(navigation.state.getParam("hideTabBar")) : true,
});

// const profileNavigator = createStackNavigator({
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

// profileNavigator.navigationOptions = {
//   tabBarLabel: 'Profile',
//   initialRouteName: 'Profile'
// };

const HomepageTabNavigator = createBottomTabNavigator({
  Home,
  questionSwitchNavigator
  // Favourites,
  // profileNavigator
});

const AppSwitchNavigator = createSwitchNavigator({
  Auth: AuthStack, 
  // ForgotPassword: {
  //   screen: ForgotPasswordForm,
  //   path: 'forgotpassword/:token'

  // },
  Homepage: HomepageTabNavigator,
  // AdminHomepage: AdminTabNavigator,
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
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
  },
  katex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
