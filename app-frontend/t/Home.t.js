import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../screens/Home';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Home />} />).toJSON();
    expect(tree).toMatchSnapshot();
});