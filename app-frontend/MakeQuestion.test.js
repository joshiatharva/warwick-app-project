import React from 'react';
import renderer from 'react-test-renderer';
import MakeQuestion from './screens/MakeQuestion';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<MakeQuestion />} />).toJSON();
    expect(tree).toMatchSnapshot();
});