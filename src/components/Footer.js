import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Button from './Button';

class Footer extends Component{

  _completeSelected = (headerType) => {  
    this.props._handleCompleteSelected(headerType);
  }
  
  _purchse = () => {
    this.props._handlePurchase();
  }

  _renderFooterType(type) {      
    switch(type){
      case 'main':          
        const PRICE_FORMATTING = this.props.totalPrice.toLocaleString(this.props.currency, { minimumFractionDigits: 0 });
        return (
          <div className={'footer__wrapper'}>
            <div className={'total cb_clear'}>
              <span className={'total__text'}>Total</span>
              <strong className={'total__price'}>{PRICE_FORMATTING}đ</strong>
            </div>
            <div><Button type="next" text="Pay" click={this._purchse} totalPrice={this.props.totalPrice} /></div>
          </div>
        );
      case 'surgery':
      case 'discount':
        return (
          <div className={'footer__wrapper select'}>
            <p>{type === 'surgery' ? 'Please select one or more products.' : 'Please select a discount.'}</p>
            <div>
              <Button 
                type="next complete" 
                text="Done"
                totalSelected={type === 'surgery' ? this.props.totalSelectedSurgery : undefined} 
                click={this._completeSelected}
                headerType={type}
              />
            </div>
          </div> 
        );
      default:
        return (
          <div className={'footer__wrapper'}>
            <div className={'total cb_clear'}>
              <span className={'total__text'}>Total</span>
              <strong className={'total__price'}>{this.props.totalPrice}đ</strong>
            </div>
            <div><Button type="next" text="Checkout" click={this._purchse} totalPrice={this.props.totalPrice} /></div>
          </div>
        );
    }
  }
  
  render(){
      return(
          <footer>
              {this._renderFooterType(this.props.headerType)}
          </footer>
      )
  }
}

const mapDispatchToProps = dispatch => ({
  _handleCompleteSelected: (headerType) => { dispatch(actions.completeSelected(headerType)) },
  _handlePurchase: () => { 
    dispatch(actions.purchase()); 
    setTimeout(() => {
      dispatch(actions.purchaseFinished());
    }, 1000);
  }
})

const mapStateToProps = (state) => {
    let obj = {};

    for(let i in state.interfaceReducer){
      if(state.interfaceReducer.hasOwnProperty(i)){
        obj[i] = state.interfaceReducer[i]
      }
    }
    return obj;
};

export default connect(mapStateToProps,mapDispatchToProps)(Footer);
  