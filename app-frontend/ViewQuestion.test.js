import React from 'react';
import renderer from 'react-test-renderer';
import ViewQuestion from './screens/ViewQuestion';
import MockProvider from './MockProvider';

test('renders correctly', () => {
    const tree = renderer.create(<MockProvider component={<ViewQuestion />}/> ).toJSON();
    expect(tree).toMatchSnapshot();
});