import React from 'react';
import renderer from 'react-test-renderer';
import ForgotPasswordForm from './screens/ForgotPasswordForm';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<ForgotPasswordForm />} />).toJSON();
    expect(tree).toMatchSnapshot();
});