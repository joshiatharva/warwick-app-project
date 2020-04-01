import React from 'react';
import renderer from 'react-test-renderer';
import Questions from '../screens/Questions';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
    const tree = renderer.create(<MockProvider component={<Questions />} />).toJSON();
    expect(tree).toMatchSnapshot();
});