import React from 'react';
import renderer from 'react-test-renderer';
import ForgotPassword from '../screens/ForgotPassword';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<ForgotPassword />} />).toJSON();
    expect(tree).toMatchSnapshot();
});