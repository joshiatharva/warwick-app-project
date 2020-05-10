import CheckAnswer from '../screens/admin/CheckAnswer';
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
    topic: "Normal Answer",
    options: [],
    answer: "4",
    solution: "2+2=4"
};

const question2 = { 
    name: "2+2",
    question: "What is 2+2?",
    type: "multi_choice",
    difficulty: 2,
    topic: "Multiple Choice",
    options: ["1", "2", "3", "4"],
    answer: "4",
    solution: "2+2=4"
};

const viewComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <CheckAnswer navigation={{
            getParam: (param) => {
                if (param == "Question") {
                    return question;
                } else if (param == "correct") {
                    return true;
                } else {
                    return param;
                }
            },
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
    const component = viewComponent.root.findByType(CheckAnswer).instance;
    component.setState({
        question: [],
        correct: false,
        selectedAnswer: "",
        isSending: true
    });
    await component.componentDidMount();
    const state = component.state;
    expect(state.question).toStrictEqual(question);
    expect(state.correct).toBe(true);
    expect(state.selectedAnswer).toBe("chosenAnswer");
});

test('tests selectedAnswer - correct answer', async () => {
    const component = viewComponent.root.findByType(CheckAnswer).instance;
    component.setState({
        question: [],
        correct: false,
        selectedAnswer: "",
        isSending: true
    });
    await component.componentDidMount();
    component.setState({
        question: question2,
        correct: true,
        selectedAnswer: question2.answer,
        isSending: true
    });
    const result = component.selectedStyle(component.state.selectedAnswer);
    expect(result).toStrictEqual({borderColor: "blue", borderWidth: 0.5, backgroundColor: "green"});
});

test('tests selectedAnswer - wrong answer', async () => {
    const component = viewComponent.root.findByType(CheckAnswer).instance;
    component.setState({
        question: [],
        correct: false,
        selectedAnswer: "",
        isSending: true
    });
    await component.componentDidMount();
    component.setState({
        question: question2,
        correct: true,
        selectedAnswer: "2",
        isSending: true
    });
    const result = component.selectedStyle(component.state.selectedAnswer);
    expect(result).toStrictEqual({borderColor: "blue", borderWidth: 0.5, backgroundColor: "red"});
});
