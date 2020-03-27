import React from 'react';
import renderer from 'react-test-renderer';
import Register from './screens/Register';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Register />} />).toJSON();
    expect(tree).toMatchSnapshot();
});