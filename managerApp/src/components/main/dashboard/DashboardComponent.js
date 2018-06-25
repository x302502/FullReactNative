import React, { Component } from 'react';
import { BackHandler } from 'react-native'
import { Container, Button, Text} from "native-base";
import BarchartComponent from './BarchartComponent';
import HeaderComponent from '../header/HeaderComponent';

export default class DashboardComponent extends Component {
    
    
    render() {
        
        return (
            <Container>
                <HeaderComponent {...this.props}/>
                {/* <Button onPress = {()=>this.props.navigation.navigate('Test')}>
                    <Text>
                        Test
                    </Text>
                </Button> */}
                <BarchartComponent/>
            </Container>
        );
    }
}