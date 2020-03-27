import React from 'react';
import renderer from 'react-test-renderer';
import Quiz from './screens/Quiz';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Quiz />} />).toJSON();
    expect(tree).toMatchSnapshot();
});