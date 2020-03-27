import React from 'react';
import renderer from 'react-test-renderer';
import Personal from './screens/Personal';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Personal />} />).toJSON();
    expect(tree).toMatchSnapshot();
});