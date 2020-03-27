import React from 'react';
import renderer from 'react-test-renderer';
import Account from './screens/Account';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Account />} />).toJSON();
    expect(tree).toMatchSnapshot();
});