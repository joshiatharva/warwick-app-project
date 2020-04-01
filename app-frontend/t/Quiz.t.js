import React from 'react';
import renderer from 'react-test-renderer';
import Quiz from '../screens/Quiz';
import MockProvider from '../MockProvider';

test('renders correctly', () => {
    const tree = renderer.create(<MockProvider component={<Quiz navigation={{ getParam: (param) => {
        return param;
    }
    }}/>} />).toJSON();
    expect(tree).toMatchSnapshot();
});