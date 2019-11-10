import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;

class WelcomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="Login" onPress={() => this.props.navigation.navigate("Login") } />
        <Button title="Haven't got an account? Register here!" onPress={() => alert('Signup!')} />
      </View>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn = false;
    }
  }
  render() {
    return (
      <View>
        <TextInput placeholder="Username" label="Username" name="username" autoCapitalise="none" autoCorrect={false} onChangeText={(text) => this.setState({username: text})} value={this.state.text} />
      </View>
      <View>
        <TextInput placeholder="Password" label="Password" name="password" secureTextEntry={true} autoCapitalise="none" autoCorrect={false} onChangeText={(text) => this.setState({password: text})}
        value={this.state.text}
      </View>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome back!</Text>
      </View>
    );
  }
}

class Search extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Search Screen!</Text>
      </View>
    );
  }
}

class Trending extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Trending Screen!</Text>
      </View>
    );
  }
}

class Local extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Local Screen!</Text>
      </View>
    );
  }
}

class Profile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Profile Screen!</Text>
      </View>
    );
  }
}

const HomepageTabNavigator = createBottomTabNavigator({
  Home,
  Search,
  Trending,
  Local,
  Profile
},
{
  navigationOptions: ({ navigation }) => {
    const { pageName } = navigation.state.routes[navigation.state.index];
    return { headerTitle: pageName };
  }
}
);

const HomepageStackNavigator = createStackNavigator({
  HomepageTabNavigator: HomepageTabNavigator
});

const HomepageDrawerNavigator =  createDrawerNavigator({
  Homepage: {
    screen: HomepageStackNavigator
  }
});

const AppSwitchNavigator = createSwitchNavigator({
  Welcome: { screen: WelcomeScreen },
  Homepage: { screen: HomepageDrawerNavigator }
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
  }
});
