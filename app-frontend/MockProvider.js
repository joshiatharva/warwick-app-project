import React, { Component } from 'react';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';

export default class MockProvider extends Component {
    render() {
        return (
            <ApplicationProvider mapping={mapping} theme={light}>
                {this.props.component}
            </ApplicationProvider>
        );
    }
}