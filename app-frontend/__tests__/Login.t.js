import React from 'react';
import Login from '../screens/Login';
import MockProvider from '../MockProvider';
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
    await AsyncStorage.setItem("id", "token");
    fetch.mockResponse(JSON.stringify({"success": true, "token": "token2"}));
    window.alert = () => {};
});


const loginComponent = renderer.create(
    <MockProvider component={<Login navigation={{
        navigate: (param) => {
            return param;
            }    
    }} />} />
);

// test('renders correctly', () => {
// const tree = renderer.create(<MockProvider component={<Login />} />).toJSON();
//     expect(tree).toMatchSnapshot();
// });


test('calling sendData() - no username', async () => {
    const component = loginComponent.root.findByType(Login);
    component.instance.setState({
        username: "", 
        password: "abcd", 
        usernameFlag: false, 
        passwordFlag: false
    });
    const login = await component.instance.sendData();
    const state = component.instance.state;
    expect(state.usernameFlag).toBe(true);
    expect(state.passwordFlag).toBe(false);
    expect(state.status).toBe("no username")
    expect(login).toBe(false);
})

test('calling sendData() - successful execution', async () => {
    const component = loginComponent.root.findByType(Login);
    component.instance.setState({
        username: "abcd", 
        password: "", 
        usernameFlag: false, 
        passwordFlag: false
    });
    const login = await component.instance.sendData();
    const state = component.instance.state;
    expect(state.usernameFlag).toBe(false);
    expect(state.passwordFlag).toBe(true);
    expect(state.status).toBe("no password");
    expect(login).toBe(false);
})

test('calling sendData() - no password', async () => {
    const component = loginComponent.root.findByType(Login);
    component.instance.setState({
        username: "abcd", 
        password: "abcd", 
        usernameFlag: false, 
        passwordFlag: false
    });
    const login = await component.instance.sendData();
    const state = component.instance.state;
    expect(state.usernameFlag).toBe(false);
    expect(state.passwordFlag).toBe(false);
    expect(state.status).toBe("token2");
    expect(login).toBe("HomeT");
    const token = await AsyncStorage.getItem("id");
    expect(token).toBe("token2");
});

test('calling sendData() - no success', async () => {
    fetch.mockResponse(JSON.stringify({"success": false}));
    const component = loginComponent.root.findByType(Login);
    component.instance.setState({
        username: "abcd", 
        password: "abcd", 
        usernameFlag: false, 
        passwordFlag: false
    });
    const login = await component.instance.sendData();
    const state = component.instance.state;
    expect(state.usernameFlag).toBe(false);
    expect(state.passwordFlag).toBe(false);
    expect(state.status).toBe("error");
    expect(login).toBe(false);
    const token = await AsyncStorage.getItem("id");
    expect(token).toBe("token");
});

test('calling sendData() - admin success', async () => {
    const component = loginComponent.root.findByType(Login);
    component.instance.setState({
        username: "abcd", 
        password: "abcd",
        admin: true,
        usernameFlag: false, 
        passwordFlag: false
    });
    const login = await component.instance.sendData();
    const state = component.instance.state;
    expect(state.usernameFlag).toBe(false);
    expect(state.passwordFlag).toBe(false);
    expect(state.status).toBe("admin success");
    expect(login).toBe("AdminLogin");
});



