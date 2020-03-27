import React from 'react';
import renderer from 'react-test-renderer';
import TestQuiz from './screens/admin/TestQuiz';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<TestQuiz />} />).toJSON();
    expect(tree).toMatchSnapshot();
});