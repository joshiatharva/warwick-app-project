import Quiz from '../screens/Quiz';
import AnswerScheme from "../screens/AnswerScheme";
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
});

const answerComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Quiz navigation={{
            getParam: (param) => {
                return param;
            },
            navigate: (param, {object}) => {
                return {object};
            }    
        }} 
        />
    </ApplicationProvider>
);
test('renders', () => {
    const tree = answerComponent.toJSON();
    expect(tree).toMatchSnapshot();
});

test('tests componentDidMount', () => {
    const state = answerComponent.root.findByType(Quiz).instance.state;
    expect(state.isLoading).toBe(false);
    expect(state.questions).toBe('Question');
});

test('tests isCorrect', () => {
    const q = {
        name: "abcd",
        type: "normal_answer",
        question: "What is 2+2?",
        answer: "4"
    };
    const component = answerComponent.root.findByType(Quiz).instance;
    component.setState({
        questions: q
    });
    const nav = {
        Question: component.state.questions,
        correct: false,
        chosenAnswer: "3"
    };
    component.isCorrect("3");
    expect(component.state.emptyAnswerFlag).toBe(true);
    expect(component.state.answered).toBe(false);
});

test('tests isCorrect - incorrect', () => {
    const component = answerComponent.root.findByType(Quiz).instance;
    const q = {
        name: "abcd",
        type: "multi_choice",
        question: "What is 2+2?",
        answer: "4",
        options: ["1", "2", "3", "4"]
    };
    // const nav = {
    //     Question: component.state.questions,
    //     correct: false,
    //     chosenAnswer: "3"
    // };
    component.setState({
        questions: q,
        emptyAnswerFlag: false
    });
    const isCorrect = component.isCorrect("3");
    expect(component.state.emptyAnswerFlag).toBe(false);
    expect(component.state.answered).toBe(true);
    expect(component.state.answer).toBe("3");
    expect(component.state.correct).toBe(false);
    expect(component.state.page).toBe('DataUpload');
});

test('tests isCorrect - correct ', () => {
    const component = answerComponent.root.findByType(Quiz).instance;
    const q = {
        name: "abcd",
        type: "multi_choice",
        question: "What is 2+2?",
        answer: "4",
        options: ["1", "2", "3", "4"]
    };
    // const nav = {
    //     Question: component.state.questions,
    //     correct: false,
    //     chosenAnswer: "3"
    // };
    component.setState({
        questions: q,
        emptyAnswerFlag: false
    });
    const isCorrect = component.isCorrect("4");
    expect(component.state.emptyAnswerFlag).toBe(false);
    expect(component.state.answered).toBe(true);
    expect(component.state.answer).toBe("4");
    expect(component.state.correct).toBe(true);
    expect(component.state.page).toBe('DataUpload');
});
