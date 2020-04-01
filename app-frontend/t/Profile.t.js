import React from 'react';
import renderer from 'react-test-renderer';
import Profile from '../screens/Profile';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Profile />} />).toJSON();
    expect(tree).toMatchSnapshot();
});