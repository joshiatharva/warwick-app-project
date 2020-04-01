import React from 'react';
import renderer from 'react-test-renderer';
import Favourites from '../screens/Favourites';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
const tree = renderer.create(<MockProvider component={<Favourites />} />).toJSON();
    expect(tree).toMatchSnapshot();
});