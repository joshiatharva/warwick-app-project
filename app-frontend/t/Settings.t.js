import React from 'react';
import renderer from 'react-test-renderer';
import Settings from '../screens/Settings';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Settings />} />).toJSON();
    expect(tree).toMatchSnapshot();
});