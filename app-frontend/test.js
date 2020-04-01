import Quiz from './screens/Quiz';
import MockProvider from './MockProvider';
import React from 'react';
import renderer from 'react-test-renderer';


test('renders', () => {
    const tree = renderer.create(<MockProvider component={<Quiz navigation={{ getParam: (param) =>{
        return param;
    } }} />} />).toJSON();
    expect(tree).toMatchSnapshot();
    const tree = renderer.create(<MockProvider component={<Quiz navigation={{ getParam: (param) =>{
        return param;
    } }} />} />).toJSON();
});

