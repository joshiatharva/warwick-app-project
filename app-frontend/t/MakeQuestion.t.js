import MakeQuestion from './screens/MakeQuestion';
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

const q = { 
    name: '1+1?',
    type: 'multi_choice',
    question: 'What is 1+1?',
    topic: 'Formal Languages',
    difficulty: 1,
    answer: '2',
    solution: '1+1 = 2',
    options: ["1", "2", "3", "4"],
    optionList: ["1", "2", "3", "4"],
    option1: '1',   
    option2: '2',
    option3: '3',
    option4: '4',
    selectedType: '',
    blankNameMsg: 'Please provide a name!',
    blankQuestionMsg: 'Please provide the question.',
    blankTypeMsg: 'Please provide a type!',
    blankTopicMsg: 'Please provide a question topic.',
    blankNormalMsg: 'Please fill in an answer.',
    blankSolutionMsg: 'Please provide a solution.',
    blankOption1Msg: 'Please provide the first option.',
    blankOption2Msg: 'Please provide the second option.',
    blankOption3Msg: 'Please provide the third option.',
    blankOption4Msg: 'Please provide the fourth option.',
    blankAnswerMsg: 'Please provide an answer.',
    blankNameFlag: false,
    blankQuestionFlag: false,
    blankTypeFlag: false,
    blankTopicFlag: false,
    blackNormalFlag: false,
    blankSolutionFlag: false,
    blankOption1Flag: false,
    blankOption2Flag: false,
    blankOption3Flag: false,
    blankOption4Flag: false,
    blankAnswerFlag: false,
    status: ""
};

const q2 = { 
    name: '1+1?',
    type: 'multi_choice',
    question: 'What is 1+1?',
    topic: 'Formal Languages',
    difficulty: 1,
    answer: '2',
    solution: '1+1 = 2',
    options: [],
    optionList: [],
    option1: '1',   
    option2: '2',
    option3: '3',
    option4: '4',
    selectedType: '',
    blankNameMsg: 'Please provide a name!',
    blankQuestionMsg: 'Please provide the question.',
    blankTypeMsg: 'Please provide a type!',
    blankTopicMsg: 'Please provide a question topic.',
    blankNormalMsg: 'Please fill in an answer.',
    blankSolutionMsg: 'Please provide a solution.',
    blankOption1Msg: 'Please provide the first option.',
    blankOption2Msg: 'Please provide the second option.',
    blankOption3Msg: 'Please provide the third option.',
    blankOption4Msg: 'Please provide the fourth option.',
    blankAnswerMsg: 'Please provide an answer.',
    blankNameFlag: false,
    blankQuestionFlag: false,
    blankTypeFlag: false,
    blankTopicFlag: false,
    blackNormalFlag: false,
    blankSolutionFlag: false,
    blankOption1Flag: false,
    blankOption2Flag: false,
    blankOption3Flag: false,
    blankOption4Flag: false,
    blankAnswerFlag: false,
    status: ""
};

const q3 = { 
    name: 'Epsilon is empty?',
    type: 'true_false',
    question: 'Epsilon is empty?',
    topic: 'Formal Languages',
    difficulty: 2,
    answer: false,
    solution: 'Epsilon is empty',
    options: [],
    optionList: [],
    option1: '',   
    option2: '',
    option3: '',
    option4: '',
    selectedType: '',
    blankNameMsg: 'Please provide a name!',
    blankQuestionMsg: 'Please provide the question.',
    blankTypeMsg: 'Please provide a type!',
    blankTopicMsg: 'Please provide a question topic.',
    blankNormalMsg: 'Please fill in an answer.',
    blankSolutionMsg: 'Please provide a solution.',
    blankOption1Msg: 'Please provide the first option.',
    blankOption2Msg: 'Please provide the second option.',
    blankOption3Msg: 'Please provide the third option.',
    blankOption4Msg: 'Please provide the fourth option.',
    blankAnswerMsg: 'Please provide an answer.',
    blankNameFlag: false,
    blankQuestionFlag: false,
    blankTypeFlag: false,
    blankTopicFlag: false,
    blackNormalFlag: false,
    blankSolutionFlag: false,
    blankOption1Flag: false,
    blankOption2Flag: false,
    blankOption3Flag: false,
    blankOption4Flag: false,
    blankAnswerFlag: false,
    status: ""
};

const q4 = { 
    name: 'Epsilon is empty?',
    type: "",
    question: 'Epsilon is empty?',
    topic: "",
    difficulty: 3,
    answer: false,
    solution: 'Epsilon is empty',
    options: [],
    optionList: [],
    option1: '',   
    option2: '',
    option3: '',
    option4: ''
};

const makeComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <MakeQuestion navigation={{
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

test('tests validateResults', async () => {
    const component = makeComponent.root.findByType(MakeQuestion).instance;
    component.setState({type: "normal_answer"});
    const result = component.validateResults();
    expect(result).toBe(false);
});

test('tests sendData', async () => {
    fetch.mockResponse(JSON.stringify({ 
        "success": true,
    }));
    const component = makeComponent.root.findByType(MakeQuestion).instance;
    component.setState(q);
    await component.sendData();
    const state = component.state;
    expect(state.status).toBe("Made");
});

test('tests addToArray', async () => {
    const component = makeComponent.root.findByType(MakeQuestion).instance;
    component.setState(q2);
    var state = component.state;
    expect(state.options.length).toBe(0)
    await component.addToArray();
    state = component.state;
    expect(state.options.length).toBe(4);
});

test('tests removeObject', async () => {
    const component = makeComponent.root.findByType(MakeQuestion).instance;
    component.setState(q2);
    var state = component.state;
    expect(state.answer).toBe("2")
    await component.removeObject({text: "3"});
    state = component.state;
    expect(state.answer).toBe("3");
});

test('tests booleanToObject', async () => {
    const component = makeComponent.root.findByType(MakeQuestion).instance;
    component.setState(q3);
    var state = component.state;
    expect(state.answer).toBe(false)
    await component.booleanToObject({text: "True"});
    state = component.state;
    expect(state.answer).toBe(true);
});

test('tests booleanToObject', async () => {
    const component = makeComponent.root.findByType(MakeQuestion).instance;
    component.setState(q4);
    var state = component.state;
    expect(state.type).toBe("")
    await component.addType({text: "True-False"});
    state = component.state;
    expect(state.type).toBe("true_false");

    component.setState({type: ""});
    await component.addType({text: "Multiple Choice"});
    state = component.state;
    expect(state.type).toBe("multi_choice");

    component.setState({type: ""});
    await component.addType({text: "Normal Answer"});
    state = component.state;
    expect(state.type).toBe("normal_answer");
});