import Home from './screens/Home';
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

const homeComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Home navigation={{
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
        "rg": 2,
        "cfl": 3,
        "tm": 5,
        "user": {"name": "Atharva"}
    }));
    const component = homeComponent.root.findByType(Home).instance;
    component.setState({password: "password", passwordconf: "passwordconf"});
    const state1 = component.state;
    expect(state1.rlscore).toBe(0);
    expect(state1.cflscore).toBe(0);
    expect(state1.tmscore).toBe(0);
    await component.componentDidMount();
    const state = component.state;
    expect(state.rlscore).toBe(2);
    expect(state.cflscore).toBe(3);
    expect(state.tmscore).toBe(5);
    expect(state.status).toBe("Success");
});

test('tests componentDidMount - nulls', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "rg": null,
        "cfl": null,
        "tm": 5,
        "user": {"name": "Atharva"}
    }));
    const component = homeComponent.root.findByType(Home).instance;
    component.setState({rlscore: 0, cflscore: 0, tmscore: 0, status: "", user: []});
    await component.componentDidMount();
    const state = component.state;
    expect(state.rlscore).toBe(0);
    expect(state.cflscore).toBe(0);
    expect(state.tmscore).toBe(5);
    expect(state.status).toBe("Success");
});

test('tests componentDidMount - token expired', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
        "msg": "Token expired"
    }));
    const component = homeComponent.root.findByType(Home).instance;
    component.setState({rlscore: 0, cflscore: 0, tmscore: 0, status: "", user: []});
    await component.componentDidMount();
    const state = component.state;
    expect(state.status).toBe("Failed");
});

test('tests componentDidMount - no token', async () => {
    await AsyncStorage.removeItem("id");
    const component = homeComponent.root.findByType(Home).instance;
    component.setState({rlscore: 0, cflscore: 0, tmscore: 0, status: "", user: []});
    await component.componentDidMount();
    const state = component.state;
    expect(state.err).toBe("No token");
    expect(state.status).toBe("Failed");
});

