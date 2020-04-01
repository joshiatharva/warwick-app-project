import React from 'react';
import renderer from 'react-test-renderer';
import Statistics from '../screens/Statistics';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Statistics />} />).toJSON();
    expect(tree).toMatchSnapshot();
});