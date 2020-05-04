import Register from './screens/Register';
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
    await AsyncStorage.setItem("id", "atharva");
    window.alert = () => {};
});

// const questions = [
//     { 
//         name: "2+2",
//         question: "What is 2+2?",
//         type: "multi_choice",
//         difficulty: 2,
//         topic: "Formal Languages",
//         options: ["1", "2", "3", "4"],
//         answer: "4",
//         solution: "2+2=4"
//     },
//     {
//         name: "1+3",
//         question: "What is 0+3",
//         type: "normal_answer",
//         difficulty: 3,
//         topic: "Formal Languages",
//         options: [],
//         answer: "4",
//         solution: "2+2=4"
//     }
// ];

const registerComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Register navigation={{
            navigate: (param) => {
                return param;
            }
        }}
        />
    </ApplicationProvider>
);
// test('renders', () => {
//     const tree = accountComponent.toJSON();
//     expect(tree).toMatchSnapshot();
// });

test('tests componentDidMount()', async () => {
    const component = registerComponent.root.findByType(Register).instance;
    component.setState({
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        passwordconf: ""
    });
    const result = await component.validateErrors();
    expect(result).toBe(true);
});

test('tests sendData() 1', async () => {
    const component = registerComponent.root.findByType(Register).instance;
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "token": "yeetus_deletus",
    }));
    component.setState({
        firstname: "Atharva",
        lastname: "Joshi",
        email: "abcd@gmail.com",
        username: "atthujoshi",
        password: "abcdefgh",
        passwordconf: "abcdefgh",
        firstnameFlag: false,
        lastnameFlag: false,
        emailFlag: false,
        emptyEmailFlag: false,
        usernameFlag: false,
        passwordFlag: false,
        passwordconfFlag: false,
        passwordMismatchFlag: false,
    });
    await component.sendData();
    const result = await AsyncStorage.getItem("id");
    expect(result).toBe("yeetus_deletus");
});

test('tests sendData() 2', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
        "typ": "password",
        "msg": "Mug"
    }));
    const component = registerComponent.root.findByType(Register).instance;
    component.setState({
        firstname: "Atharva",
        lastname: "Joshi",
        email: "abcd@gmail.com",
        username: "atthujoshi",
        password: "abcdefgh",
        passwordconf: "abcdefgh",
        firstnameFlag: false,
        lastnameFlag: false,
        emailFlag: false,
        emptyEmailFlag: false,
        usernameFlag: false,
        passwordFlag: false,
        passwordconfFlag: false,
        passwordMismatchFlag: false
    });
    await component.sendData();
    const state = component.state;
    expect(state.errorMsg).toBe("Mug");
});

test('tests sendData() 3', async () => {
    fetch.mockResponse(JSON.stringify([{name: "Atharva"}]));
    const component = registerComponent.root.findByType(Register).instance;
    component.setState({
        firstname: "Atharva",
        lastname: "Joshi",
        email: "abcd@gmail.com",
        username: "atthujoshi",
        password: "abcdefgh",
        passwordconf: "abcdefgh"
    });
    await component.sendData();
    expect(component.state.errorArray[0].name).toBe("Atharva");
});

