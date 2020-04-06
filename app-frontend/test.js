import Quiz from './screens/Quiz';
import AnswerScheme from "./screens/AnswerScheme";
import { ApplicationProvider } from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import React from 'react';
import renderer from 'react-test-renderer';

beforeEach(() => {
    fetch.resetMocks();
});

const component = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
    <Quiz navigation={{
        getParam: (param) => {
            return param;
            }    
        }} 
        />
    </ApplicationProvider>
);
test('renders', () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('component State is updated', () => {
    const state = answerComponent.root.findByType(Quiz).instance.state;
    expect(state.isLoading).toBe(false);
    expect(state.questions).toBe('Question');
});

