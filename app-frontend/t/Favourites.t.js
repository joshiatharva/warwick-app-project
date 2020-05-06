import React from 'react';
import renderer from 'react-test-renderer';
import Favourites from '../screens/Favourites';
import { ApplicationProvider } from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import React from 'react';
import MockAsyncStorage from "mock-async-storage";
import renderer from 'react-test-renderer';

const mock = () => {
    const mockImpl = new MockAsyncStorage();
    jest.mock('react-native/Libraries/Storage/AsyncStorage', () => mockImpl);
}
mock();

import { AsyncStorage } from 'react-native';

beforeEach(async () => {
    fetch.resetMocks();
    await AsyncStorage.setItem("id", "token");
    fetch.mockResponse(JSON.stringify({"success": true, "token": "token2"}));
});

const favouritesComponent = renderer.create(
    <ApplicationProvider mapping={mapping} theme={light}>
        <Favourites navigation={{
            getParam: (param) => {
                return param;
            },
            navigate: (param, {object}) => {
                return param;
            }    
        }} 
        />
    </ApplicationProvider>
);
// test('renders', () => {
//     const tree = accountComponent.toJSON();
//     expect(tree).toMatchSnapshot();
// });

test('tests componentDidMount - success', async () => {
    fetch.mockResponse(JSON.stringify({
        "question": "What is 2 + 2?",
        "answer": 4,
        "topic": "Formal Languages",
        "difficulty": 3
    }));
    const component = favouritesComponent.root.findByType(Favourites).instance;
    await component._getFavourites();
    const state = component.state;
    expect(state.questions.answer).toBe(4);
    expect(state.isLoading).toBe(false);
});

test('tests getFavourites', async () => {
    fetch.mockResponse(JSON.stringify({
        "question": "What is 2 + 2?",
        "answer": 4,
        "topic": "Formal Languages",
        "difficulty": 3
    }));
    const component = favouritesComponent.root.findByType(Favourites).instance;
    await component._getFavourites();
    const state = component.state;
    expect(state.questions.answer).toBe(4);
});

test('tests handleRefresh - failure', async () => {
    const component = favouritesComponent.root.findByType(Favourites).instance;
    component.setState({isLoading: true});
    await component._handleRefresh();
    const state = component.state;
    expect(state.isLoading).toBe(false);
});

test('tests _fetchLog', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "msg": "Successfully logged"
    }));
    const component = favouritesComponent.root.findByType(Favourites).instance;
    component.setState({
        questions: [],
        error: null,
        isLoading: true,
    });
    const log = await component._fetchLog({_id: "abcd"});
    expect(log.msg).toBe("Successfully logged");
});

test('tests _sendData', async () => {
    fetch.mockResponse(JSON.stringify({
        "success": true,
        "msg": "Successfully logged"
    }));
    const component = favouritesComponent.root.findByType(Favourites).instance;
    component.setState({
        questions: [],
        error: null,
        isLoading: true,
    });
    const obj = {_id: "abcd"};
    await component._sendData(obj);
    const state = component.state;
    expect(state.page).toBe("Quiz");
});



// test('tests componentDidMount - failure', async () => {
//     fetch.mockResponse(JSON.stringify({
//         "success": false,
//         "msg": "Token expired",
//         "user": null 
//     }));
//     const before = await AsyncStorage.getItem("id");
//     const component = accountComponent.root.findByType(Account).instance;
//     component.setState({
//         status: false, 
//         username: "", 
//         firstname: "", 
//         lastname: "", 
//         password: "", 
//         email: ""
//     });
//     await component.componentDidMount();
//     const state = component.state;
//     const item = await AsyncStorage.getItem("id");
//     expect(state.status).toBe(false);
//     expect(state.username).toBe("");
//     expect(state.firstname).toBe("");
//     expect(state.lastname).toBe("");
//     expect(state.password).toBe("");
//     expect(state.email).toBe("");
//     expect(before).toBe("token");
//     expect(item).toBe(null);
// });

// test('tests sendData - success', async () => {
//     fetch.mockResponse(JSON.stringify({
//         "success": true,
//         "msg": {
//             "username": "atthujoshi",
//             "firstname": "Atharva",
//             "lastname": "Joshi",
//             "email": "abcd@gmail.com",
//         } 
//     }));
//     window.alert = () => {};
//     const component = accountComponent.root.findByType(Account).instance;
//     component.setState({
//         status: false, 
//         tempusername: "",
//         tempfirstname: "",
//         templastname: "",
//         tempemail: "",
//     });
//     var state = component.state;
//     expect(state.tempusername).toBe("");
//     expect(state.tempfirstname).toBe("");
//     expect(state.templastname).toBe("");
//     expect(state.tempemail).toBe("");
//     await component.sendData();
//     state = component.state;
//     expect(state.status).toBe(false);
//     expect(state.username).toBe("atthujoshi");
//     expect(state.firstname).toBe("Atharva");
//     expect(state.lastname).toBe("Joshi");
//     expect(state.email).toBe("abcd@gmail.com");
//     expect(state.edit).toBe(false);
//     expect(state.isSending).toBe(false);
// });

// test('tests sendData - failure', async () => {
//     fetch.mockResponse(JSON.stringify({
//         "success": false,
//         "msg": "Token expired",
//     }));
//     window.alert = () => {};
//     const before = await AsyncStorage.getItem("id");
//     expect(before).toBe("token");
//     const component = accountComponent.root.findByType(Account).instance;
//     component.setState({
//         status: false,
//     });
//     await component.sendData();
//     const after = await AsyncStorage.getItem("id");
//     expect(after).toBe(null);

// });




