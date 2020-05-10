import TestQuiz from '../screens/admin/TestQuiz';
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
        <TestQuiz navigation={{
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
    const component = viewComponent.root.findByType(TestQuiz).instance;
    component.setState({
        isLoading: true,
        correct: false, 
        answered: false,
        value: "",
        questions: [],
        normalAnswer: "",
        answer: ""
      });
    await component.componentDidMount();
    const state = component.state;
    expect(state.questions).toStrictEqual(question);
    expect(state.isLoading).toBe(false);
});

test('tests componentDidMount() 2', async () => {
    const component = viewComponent.root.findByType(TestQuiz).instance;
    component.setState({
        isLoading: true,
        correct: false, 
        answered: false,
        value: "",
        questions: question,
        normalAnswer: "",
        answer: ""
      });
    await component.isCorrect("3");
    const state = component.state;
    expect(state.correct).toBe(false);
    expect(state.answered).toBe(true);
    expect(state.answer).toBe("3");
});

test('tests componentDidMount() 2', async () => {
    const component = viewComponent.root.findByType(TestQuiz).instance;
    component.setState({
        isLoading: true,
        correct: false, 
        answered: false,
        value: "",
        questions: question,
        normalAnswer: "",
        answer: ""
      });
    await component.isCorrect("4");
    const state = component.state;
    expect(state.correct).toBe(true);
    expect(state.answered).toBe(true);
    expect(state.answer).toBe("4");
});
