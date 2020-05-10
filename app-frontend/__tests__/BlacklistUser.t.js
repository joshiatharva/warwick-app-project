import BlacklistUser from '../screens/admin/BlacklistUser';
import { ApplicationProvider } from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import React from 'react';
import MockAsyncStorage from "mock-async-storage";
import renderer from 'react-test-renderer';

const mock = () => {
    const mockImpl = new MockAsyncStorage();
    jest.mock('react-native/Libraries/Storage/AsyncStorage', () => mockImpl);
}
mock();

import { AsyncStorage } from 'react-native';


beforeEach(async () => {
    fetch.resetMocks();
    await AsyncStorage.setItem("admin", "atharva");
    window.alert = () => {};
});

// const question = { 
//     name: "2+2",
//     question: "What is 2+2?",
//     type: "multi_choice",
//     difficulty: 2,
//     topic: "Normal Answer",
//     options: [],
//     answer: "4",
//     solution: "2+2=4"
// };

// const question2 = { 
//     name: "2+2",
//     question: "What is 2+2?",
//     type: "multi_choice",
//     difficulty: 2,
//     topic: "Multiple Choice",
//     options: ["1", "2", "3", "4"],
//     answer: "4",
//     solution: "2+2=4"
// };

const viewComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <BlacklistUser navigation={{
            navigate: () => {}
        }}
        />
    </ApplicationProvider>
);
// test('renders', () => {
//     const tree = accountComponent.toJSON();
//     expect(tree).toMatchSnapshot();
// });

test('tests componentDidMount() 1', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "msg": [{name: "Yeetus deletus"}]
    }));
    const component = viewComponent.root.findByType(BlacklistUser).instance;
    component.setState({
        username: '',
        reason: '',
        date: null,
        users: []
    });
    const date = new Date(); 
    await component.componentDidMount();
    const state = component.state;
    expect(state.date).toStrictEqual(date);
    expect(state.users[0].name).toBe("Yeetus deletus");
});

test('tests selectedAnswer - correct answer', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
        "msg": "Token invalid"
    }));
    const component = viewComponent.root.findByType(BlacklistUser).instance;
    component.setState({
        username: '',
        reason: '',
        date: null,
        users: []
    });
    await component.componentDidMount();
    const date = new Date().toLocaleDateString("en-US"); 
    const state = component.state;
    const result = await AsyncStorage.getItem("admin");
    expect(state.date.toLocaleDateString("en-US")).toStrictEqual(date);
    expect(result).toBe(null);
});

test('tests sendData() - wrong answer', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true
    }));
    const component = viewComponent.root.findByType(BlacklistUser).instance;
    component.setState({
        username: 'atharva',
        reason: 'abcdefgh',
        date: new Date(),
        users: []
    });
    await component.sendData();
    const state = component.state;
    expect(state.username).toBe("");
    expect(state.reason).toBe("");
    expect(state.date).toBe(null);
});

test('tests sendData() - wrong answer', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
    }));
    const date = new Date();
    const component = viewComponent.root.findByType(BlacklistUser).instance;
    component.setState({
        username: 'atharva',
        reason: 'abcdefgh',
        date: date,
        users: []
    });
    await component.sendData();
    const state = component.state;
    expect(state.username).toBe("atharva");
    expect(state.reason).toBe("abcdefgh");
    expect(state.date.toLocaleDateString("en-US")).toBe(date.toLocaleDateString("en-US"));
});