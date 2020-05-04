import Personal from './screens/Personal';
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
    fetch.mockResponse(JSON.stringify({"success": true, "token": "token2"}));
    window.alert = () => {};
});

const makeComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Personal navigation={{
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

test('tests componentDidMount', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "user": {"name": "atthujoshi"},
        "msg": "Success"
    }));
    const component = makeComponent.root.findByType(Personal).instance;
    await component.componentDidMount();
    const state = component.state;
    expect(state.status).toBe("Correct");
    expect(state.user.name).toBe("atthujoshi");
});

test('tests componentDidMount', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
        "msg": "Token expired"
    }));
    const before = await AsyncStorage.getItem("id");
    expect(before).toBe("atharva");
    const component = makeComponent.root.findByType(Personal).instance;
    await component.componentDidMount();
    const state = component.state;
    expect(state.status).toBe("Token");
    const result = await AsyncStorage.getItem("id");
    expect(result).toBe(null);
});
