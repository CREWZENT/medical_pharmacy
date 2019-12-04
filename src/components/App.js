import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import '../sass/main.scss';
import Header from './Header';
import Main from './Main';
import Receipt from './Receipt';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class App extends Component {
  render() {
    if (this.props.isPurchasing) {
      return (
        <Fragment>
          <div className={'purchase__process'}><FontAwesomeIcon icon={faSpinner} color={'#333'} spin={true} size={'3x'} /><p>Processing...</p></div>
        </Fragment>
      );
    } else if (this.props.isFinished) {
      console.log(this.props.selectedSurgery);
      return (
        <Receipt/>
      )
    } else {
      return (
        <Fragment>
          <Header />
          <Main />
          <Footer />
        </Fragment>
      );
    }
  }
}

const mapStateToProps = (state) => {
  let obj = {};

  for (let i in state.interfaceReducer) {
    if (state.interfaceReducer.hasOwnProperty(i)) {
      obj[i] = state.interfaceReducer[i]
    }
  }
  return obj;
};

export default connect(mapStateToProps, null)(App);
