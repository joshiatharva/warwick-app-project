import React from 'react';
import renderer from 'react-test-renderer';
import Login from './screens/Login';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Login />} />).toJSON();
    expect(tree).toMatchSnapshot();
});