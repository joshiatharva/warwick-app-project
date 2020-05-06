import Profile from '../screens/Profile';
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
    fetch.mockResponse(JSON.stringify({"success": true, "token": "token2"}));
    window.alert = () => {};
});

const profileComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Profile navigation={{
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

test('tests handleLogout()', async () => {
    await AsyncStorage.setItem("id", "atharva");
    fetch.mockResponse(JSON.stringify({
        "success": true
    }));
    const component = profileComponent.root.findByType(Profile).instance;
    var state = component.state;
    expect(state.status).toBe("");
    const val = await AsyncStorage.getItem("id");
    expect(val).toBe("atharva");
    await component.handleLogout();
    state = component.state;
    expect(state.status).toBe("User");
    const value = await AsyncStorage.getItem("id");
    expect(value).toBe(null);
});

test('tests handleLogout()', async () => {
    await AsyncStorage.setItem("admin", "atharva");
    fetch.mockResponse(JSON.stringify({
        "success": true
    }));
    const component = profileComponent.root.findByType(Profile).instance;
    component.setState({status: ""});
    var state = component.state;
    const val = await AsyncStorage.getItem("admin");
    expect(val).toBe("atharva");
    expect(state.status).toBe("");
    await component.handleLogout();
    state = component.state;
    expect(state.status).toBe("Admin");
    const value = await AsyncStorage.getItem("admin");
    expect(value).toBe(null);
});

