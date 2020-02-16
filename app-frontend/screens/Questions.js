import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, AsyncStorage, Picker, ActivityIndicator } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

export default class Questions extends Component {
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
      let response = await fetch('http://192.168.0.12:3000/questions/all', {
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

  async saveQuestion(id) {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/save',{
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
      console.log(res.message);
    } catch (err) {
      console.log(err);
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
                <TouchableOpacity style={styles.container} onPress={() => Alert.alert('Add Question?', 'Add this Question to your Favourites?', [ {text: 'No', onPress: () => console.log("refused")}, {text: 'Yes', onPress: () => this.saveQuestion(item._id)}])}>
                  <Card>
                    <Text>{item.name}</Text>
                    <Text>{item.topic}</Text>
                    <Text>{item.difficulty}</Text> 
                  </Card>
                </TouchableOpacity>
            }
            keyExtractor={this.state.questions.name}
          />
        </ScrollView>
      );
  }
}

export const questionStackNavigator = createStackNavigator({
    Questions: Questions
    Quiz: Quiz
});

export const questionSwitchNavigator = createSwitchNavigator({
    questionStackNavigator: questionStackNavigator,
    DataUpload: DataUpload,
    Home: Home
});