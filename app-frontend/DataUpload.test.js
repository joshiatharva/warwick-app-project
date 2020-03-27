import React from 'react';
import renderer from 'react-test-renderer';
import DataUpload from './screens/DataUpload';
import MockProvider from './MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<DataUpload />} />).toJSON();
    expect(tree).toMatchSnapshot();
});