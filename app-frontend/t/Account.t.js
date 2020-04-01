import React from 'react';
import renderer from 'react-test-renderer';
import Account from '../screens/Account';
import MockProvider from '../MockProvider';
// const getUserProfile = async() => {
//     let token = "123";
//       let response = await fetch("http://192.168.0.12:3000/user/profile", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Authorization": "Bearer " + token
//         }
//       });
//       let res = await response.json();
//       if (res.success == true) {
//         this.setState({
//           username: res.user.username,
//           firstname: res.user.firstname,
//           lastname: res.user.lastname,
//           password: res.user.password,
//           email: res.user.email
//         });
//       }
// };

// beforeEach(() => {
//     fetch.resetMocks();
// });

test('renders correctly', () => {
    const tree = renderer.create(<MockProvider component={<Account />} />).toJSON();
    expect(tree).toMatchSnapshot();
});

// test('/user/profile GET executes properly', () => {
//     fetch.mockResponseOnce(JSON.stringify({"user": {"username": "atthu", "firstname": "atharva", "lastname": "joshi", "password": "abcdefgh", "email": "bcd@io"}, "success": true}));
//     getUserProfile().then(res => {
//         expect(res.success).toBe(true);
//     });
// });