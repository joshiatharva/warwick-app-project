import Statistics from '../screens/Statistics';
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

// const questions = [
//     { 
//         name: "2+2",
//         question: "What is 2+2?",
//         type: "multi_choice",
//         difficulty: 2,
//         topic: "Formal Languages",
//         options: ["1", "2", "3", "4"],
//         answer: "4",
//         solution: "2+2=4"
//     },
//     {
//         name: "1+3",
//         question: "What is 0+3",
//         type: "normal_answer",
//         difficulty: 3,
//         topic: "Formal Languages",
//         options: [],
//         answer: "4",
//         solution: "2+2=4"
//     }
// ];

const statsComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Statistics navigation={{
            navigate: (param) => {
                return param;
            },
            goBack: () => {}
        }}
        />
    </ApplicationProvider>
);
test('renders', () => {
    const tree = statsComponent.toJSON();
    expect(tree).toMatchSnapshot();
});

test('tests componentDidMount() 1', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "user_scores":[{
            topic: "Regular Languages",
            d1_correct: 1,
            d1_total: 2,
            d2_correct: 2,
            d2_total: 1,
            d3_correct: 2,
            d3_total: 2,
            d4_correct: 1,
            d4_total: 1,
            d5_correct: 1,
            d5_total: 1
        }],
        "questions": question,
        "user": {
            "question_history": ["a", "b", "c"],
            "last_10_sessions_length": [1,2,3,4,5,6]
        }
    }));
    const component = statsComponent.root.findByType(Statistics).instance;
    component.setState({
        user_scores: [],
        q_history: [],
        questions_made: [],
        sessions: [],
        questions_made: [],
        rldata: [],
        ctldata: [],
        tmdata: [],
        rltotal: [],
        ctltotal: [],
        tmtotal: [],
        array: [],
        type: '',
        topic: ''
      });
    await component.componentDidMount();
    const state = component.state;
    expect(state.rldata).toStrictEqual([1,2,2,1,1]);
    expect(state.rltotal).toStrictEqual([2,1,2,1,1]);
    expect(state.question_history).toStrictEqual(["a","b","c"]);
    expect(state.sessions).toStrictEqual([1,2,3,4,5,6]);
});

test('tests componentDidMount() 2', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "user_scores":[{
            topic: "Context Free Languages",
            d1_correct: 2,
            d1_total: 2,
            d2_correct: 2,
            d2_total: 3,
            d3_correct: 2,
            d3_total: 2,
            d4_correct: 4,
            d4_total: 3,
            d5_correct: 1,
            d5_total: 1
        }],
        "questions": question,
        "user": {
            "question_history": ["a", "b", "c"],
            "last_10_sessions_length": [1,2,3,4,5,6]
        }
    }));
    const component = statsComponent.root.findByType(Statistics).instance;
    component.setState({
        user_scores: [],
        q_history: [],
        questions_made: [],
        sessions: [],
        questions_made: [],
        rldata: [],
        ctldata: [],
        tmdata: [],
        rltotal: [],
        ctltotal: [],
        tmtotal: [],
        array: [],
        type: '',
        topic: ''
      });
    await component.componentDidMount();
    const state = component.state;
    expect(state.ctldata).toStrictEqual([2,2,2,4,1]);
    expect(state.ctltotal).toStrictEqual([2,3,2,3,1]);
    expect(state.question_history).toStrictEqual(["a","b","c"]);
    expect(state.sessions).toStrictEqual([1,2,3,4,5,6]);
});

test('tests componentDidMount() 3', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "user_scores":[{
            topic: "Turing Machines",
            d1_correct: 1,
            d1_total: 2,
            d2_correct: 2,
            d2_total: 1,
            d3_correct: 2,
            d3_total: 2,
            d4_correct: 1,
            d4_total: 1,
            d5_correct: 1,
            d5_total: 1
        }],
        "questions": question,
        "user": {
            "question_history": ["a", "b", "c"],
            "last_10_sessions_length": [1,2,3,4,5,6]
        }
    }));
    const component = statsComponent.root.findByType(Statistics).instance;
    component.setState({
        user_scores: [],
        q_history: [],
        questions_made: [],
        sessions: [],
        questions_made: [],
        rldata: [],
        ctldata: [],
        tmdata: [],
        rltotal: [],
        ctltotal: [],
        tmtotal: [],
        array: [],
        type: '',
        topic: ''
      });
    await component.componentDidMount();
    const state = component.state;
    expect(state.tmdata).toStrictEqual([1,2,2,1,1]);
    expect(state.tmtotal).toStrictEqual([2,1,2,1,1]);
    expect(state.question_history).toStrictEqual(["a","b","c"]);
    expect(state.sessions).toStrictEqual([1,2,3,4,5,6]);
});

test('tests componentDidMount() 4', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": false
    }));
    const component = statsComponent.root.findByType(Statistics).instance;
    component.setState({
        user_scores: [],
        q_history: [],
        questions_made: [],
        sessions: [],
        questions_made: [],
        rldata: [],
        ctldata: [],
        tmdata: [],
        rltotal: [],
        ctltotal: [],
        tmtotal: [],
        array: [],
        type: '',
        topic: '',
        status: ''
      });
    await component.componentDidMount();
    const state = component.state;
    expect(state.status).toBe("error");
});

test('tests componentDidMount() 5', async () => {
    const component = statsComponent.root.findByType(Statistics).instance;
    component.setState({
        user_scores: [],
        q_history: [],
        questions_made: [],
        sessions: [],
        questions_made: [],
        rldata: [],
        ctldata: [],
        tmdata: [],
        rltotal: [],
        ctltotal: [],
        tmtotal: [],
        array: [],
        type: '',
        topic: '',
        status: ''
      });
    await component.addTopic({text: "abcd"});
    const state = component.state;
    expect(state.topic).toBe("abcd");
});