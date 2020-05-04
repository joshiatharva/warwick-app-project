import ForgotPasswordForm from './screens/ForgotPasswordForm';
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
    await AsyncStorage.setItem("forgot_Token", "abcd1234");
    await AsyncStorage.setItem("id_token", "atharva");
    fetch.mockResponse(JSON.stringify({"success": true, "token": "token2"}));
    window.alert = () => {};
});

const forgotComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <ForgotPasswordForm navigation={{
            navigate: (param) => {
                return param;
            },
            goBack: () => {}
        }} 
        />
    </ApplicationProvider>
);
// test('renders', () => {
//     const tree = accountComponent.toJSON();
//     expect(tree).toMatchSnapshot();
// });

test('tests sendData', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": "true",
        "status": "successful",
        "id": "yeet"
    }));
    const component = forgotComponent.root.findByType(ForgotPasswordForm).instance;
    component.setState({password: "password", passwordconf: "passwordconf"});
    const state1 = component.state;
    expect(state1.error).toBe(null);
    await component.sendData();
    const state = component.state;
    expect(state.page).toBe("Login");
    expect(state.status).toBe("Password changed");
});

test('tests sendData - token exists', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": "false",
        "status": "failed",
        "id": "yeet"
    }));
    const component = forgotComponent.root.findByType(ForgotPasswordForm).instance;
    component.setState({password: "password", passwordconf: "passwordconf", page: "", status: ""});
    await component.sendData();
    const state = component.state;
    expect(state.page).toBe("Login");
    expect(state.status).toBe("Failed");
});