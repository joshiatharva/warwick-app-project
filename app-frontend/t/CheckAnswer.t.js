import React from 'react';
import renderer from 'react-test-renderer';
import CheckAnswer from '../screens/admin/CheckAnswer';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<CheckAnswer />} />).toJSON();
    expect(tree).toMatchSnapshot();
});