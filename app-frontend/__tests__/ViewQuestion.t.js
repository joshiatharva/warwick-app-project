import ViewQuestion from '../screens/ViewQuestion';
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

const viewComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <ViewQuestion navigation={{
            getParam: () => {
                return [1,2,3,4];
            }
        }}
        />
    </ApplicationProvider>
);
// test('renders', () => {
//     const tree = accountComponent.toJSON();
//     expect(tree).toMatchSnapshot();
// });

test('tests componentDidMount() 1', async () => {
    const component = viewComponent.root.findByType(ViewQuestion).instance;
    component.setState({
        question: [], 
        status: ""
      });
    await component.componentDidMount();
    const state = component.state;
    expect(state.question).toStrictEqual([1,2,3,4]);
});

test('tests sendData() - true', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true
    }));
    const component = viewComponent.root.findByType(ViewQuestion).instance;
    component.setState({
        question: [], 
        status: ""
      });
    await component.saveQuestion("id");
    const state = component.state;
    expect(state.status).toBe("success");
});

test('tests sendData() - false', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false
    }));
    const component = viewComponent.root.findByType(ViewQuestion).instance;
    component.setState({
        question: [], 
        status: ""
      });
    await component.saveQuestion("id");
    const state = component.state;
    expect(state.status).toBe("failure");
});
