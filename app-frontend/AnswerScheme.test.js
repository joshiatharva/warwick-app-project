import React from 'react';
import renderer from 'react-test-renderer';
import AnswerScheme from './screens/AnswerScheme';

test('renders correctly', () => {
    const tree = renderer.create(<AnswerScheme />).toJSON();
    expect(tree).toMatchSnapshot();
});