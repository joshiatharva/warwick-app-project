import Questions from './screens/Questions';
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

const questions = [
    { 
        name: "2+2",
        question: "What is 2+2?",
        type: "multi_choice",
        difficulty: 2,
        topic: "Formal Languages",
        options: ["1", "2", "3", "4"],
        answer: "4",
        solution: "2+2=4"
    },
    {
        name: "1+3",
        question: "What is 0+3",
        type: "normal_answer",
        difficulty: 3,
        topic: "Formal Languages",
        options: [],
        answer: "4",
        solution: "2+2=4"
    }
];

const questionComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Questions navigation={{
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

test('tests componentDidMount()', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "msg": questions
    }));
    const component = questionComponent.root.findByType(Questions).instance;
    await component.getQuestions();
    var state = component.state;
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe("success");
    expect(state.questions).toStrictEqual(questions);
    expect(state.filteredQuestions).toStrictEqual(questions);
});

test('tests componentDidMount()', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
        "msg": "Token expired"
    }));
    const component = questionComponent.root.findByType(Questions).instance;
    await component.getQuestions();
    var state = component.state;
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe("token");
});

test('tests componentDidMount()', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "msg": "Successful"
    }));
    const component = questionComponent.root.findByType(Questions).instance;
    component.setState({status: "", isLoading: true, questions: [], filteredQuestions: []});
    await component.saveQuestion("abcd");
    var state = component.state;
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe("saved");
});

test('tests componentDidMount()', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false,
        "msg": "Token expired"
    }));
    const component = questionComponent.root.findByType(Questions).instance;
    component.setState({status: "", isLoading: true, questions: [], filteredQuestions: []});
    await component.saveQuestion("abcd");
    var state = component.state;
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe("not saved");
});

test('tests viewQuestion()', async() => {
    const component = questionComponent.root.findByType(Questions).instance;
    await component.viewQuestion("abcd");
    var state = component.state;
    expect(state.status).toBe("viewQuestion");
})

test('tests getData()', async() => {
    const component = questionComponent.root.findByType(Questions).instance;
    component.setState({status: "", isLoading: true, questions: questions, filteredQuestions: questions});
    await component.getData("1+3");
    var state = component.state;
    expect(state.search).toBe("1+3");
    expect(state.filteredQuestions[0].name).toBe("1+3");
});

test('tests getData()', async() => {
    const component = questionComponent.root.findByType(Questions).instance;
    component.setState({status: "", isLoading: true, questions: questions, filteredQuestions: questions});
    await component.getData("");
    var state = component.state;
    expect(state.search).toBe("");
    expect(state.filteredQuestions).toStrictEqual(questions);
});

test('tests resetData()', async() => {
    const component = questionComponent.root.findByType(Questions).instance;
    component.setState({status: "", search: "1+4", isLoading: true, questions: questions, filteredQuestions: []});
    await component.resetData();
    var state = component.state;
    expect(state.search).toBe("");
    expect(state.filteredQuestions).toStrictEqual(questions);
});

test('tests handleRefresh()', async() => {
    const component = questionComponent.root.findByType(Questions).instance;
    component.setState({status: "", search: "1+4", isLoading: true, questions: questions, filteredQuestions: []});
    await component.handleRefresh();
    var state = component.state;
    expect(state.isLoading).toBe(false);
});




