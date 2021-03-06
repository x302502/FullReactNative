import React, { Component } from "react";
import { FlatList,View ,RefreshControl} from "react-native";
import {
  Container,
  Spinner,
  Fab,
  Icon,
} from "native-base";
import { APIREQUEST } from "../../../../services/ApiRequest";

import ItemUserComponent from "./ItemUserComponent";
import { ColorsChart } from "../../../../common/Color";
import HeaderComponent from "../../header/HeaderComponent";


export default class UserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      isRefreshing: false,
      skip: 0,
      limit: 12,
      total: 0,
    };
  }
  componentDidMount(){
    this.handleRefresh();
  }
   handleRefresh(){
    if(this.state.isLoading || this.state.isRefreshing) {
      return
    }
    this.setState({
      isRefreshing:  true,
      skip: 0
    },  () => {
       let {skip,limit } = this.state
      APIREQUEST.listUser(skip,limit).then(data => {
        if(data.res.length >0 ){
          
          this.setState({
            data: data.res,
            total: data.total,
            isRefreshing:  false
          })
        }else {
            this.setState({
              isRefreshing:false
              })
        }
      }).catch(err => {
        this.setState({
          isRefreshing:  false
        });
       
      })
    });
  }
  handleLoadMore(info){
    if(this.state.isLoading || this.state.isRefreshing) {
      return
    }
    if(this.state.data.length == this.state.total) {
        return
    }
    this.setState({
      isLoading: true,
      skip: this.state.skip + this.state.limit
    }, () => {
        let {skip,limit } = this.state
       APIREQUEST.listUser(skip,limit).then(data => {
        if(data.res.length > 0) {
            this.setState({
                data: this.state.data.concat(data.res),
                isLoading:false
              })
        } else {
            this.setState({
                isLoading:false
            })
        }
        
      }).catch(err => {
        //Notifiy.warning(JSON.stringify(err));
        this.setState({
          isLoading: false
        });
       
      })
    });
    }

  componentDidUpdate(){
    //Notifiy.warning(JSON.stringify('componentDidUpdate'));
  }
  render() {
    return (
      <Container style= {{flex:1}}>
        <HeaderComponent {...this.props}/>
        <FlatList
          data={this.state.data}
          keyExtractor = {(x,i) =>i.toString()}
       
          ListFooterComponent = { () =>
            this.state.isLoading 
            ? <Spinner  color = {ColorsChart[0]}></Spinner> 
            : null
          }
          renderItem={({ item, index }) => {
            return <ItemUserComponent item={item} index={index} />;
          }}
          refreshControl = {
            <RefreshControl   
              refreshing = {this.state.isRefreshing}
              onRefresh = {this.handleRefresh.bind(this)}
              //progressBackgroundColor = {Color.greenAlpha}
              colors = {ColorsChart}
            />
          }
          onEndReached={ (info)=>this.handleLoadMore(info)}
          onEndReachedThreshold={0.2}
        />
        <Fab 
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => alert('ok')}>
            <Icon name="add" />
        </Fab>
      </Container>
        
    );
  }
}

