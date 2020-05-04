import ForgotPassword from '../screens/ForgotPassword';
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
    await AsyncStorage.setItem("id", "token");
    fetch.mockResponse(JSON.stringify({"success": true, "token": "token2"}));
    window.alert = () => {};
});

const forgotComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <ForgotPassword navigation={{
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
        "success": true,
        "msg": "abcdefgh12345678",
        "id": "yeet"
    }));
    const component = forgotComponent.root.findByType(ForgotPassword).instance;
    component.setState({email: "abcd@gmail.com", received: false});
    const state1 = component.state;
    expect(state1.received).toBe(false);
    await component.sendData();
    const state = component.state;
    expect(state.received).toBe(true);
    const id_token = await AsyncStorage.getItem("id_token");
    const forgot_token = await AsyncStorage.getItem("forgot_Token");
    expect(id_token).toBe("yeet");
    expect(forgot_token).toBe("abcdefgh12345678");
});

test('tests sendData - token exists', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
        "msg": "/",
        "id": "yeet"
    }));
    const component = forgotComponent.root.findByType(ForgotPassword).instance;
    component.setState({email: "abcd@gmail.com"});
    await component.sendData();
    const state = component.state;
    expect(state.error).toBe(true);
});