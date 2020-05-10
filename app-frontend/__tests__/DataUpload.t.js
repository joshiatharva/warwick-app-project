import DataUpload from '../screens/DataUpload';
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

const question = { 
    name: "2+2",
    question: "What is 2+2?",
    type: "multi_choice",
    difficulty: 2,
    topic: "Formal Languages",
    options: ["1", "2", "3", "4"],
    answer: "4",
    solution: "2+2=4"
};

const viewComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <DataUpload navigation={{
            getParam: (param) => {
                if (param == "Question") {
                    return question;
                } else {
                    return param;
                }
            },
            navigate: () => {}
        }}
        />
    </ApplicationProvider>
);
test('renders', () => {
    const tree = viewComponent.toJSON();
    expect(tree).toMatchSnapshot();
});

test('tests componentDidMount() 1', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
    }));
    const component = viewComponent.root.findByType(DataUpload).instance;
    component.setState({
        question: [],
        correct: false,
        answer: "",
        isSending: true
      });
    await component.componentDidMount();
    const state = component.state;
    expect(state.isSending).toBe(false);
});

test('tests componentDidMount() 2', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
    }));
    const component = viewComponent.root.findByType(DataUpload).instance;
    component.setState({
        question: [],
        correct: false,
        answer: "",
        isSending: true
      });
    await component.componentDidMount();
    const result = await AsyncStorage.getItem("question_conn_fail");
    expect(result.answer).toBe("chosenAnswer");
    expect(result.correct).toBe("correct");
});
