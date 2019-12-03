import React, { Component } from 'react';
import '../sass/components/_receipt.scss';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
var QRCode = require('qrcode.react');

class Receipt extends Component {

    render() {
        console.log(JSON.stringify(this.props));
        const listSelected = [];
        for (let i = 0; i < this.props.selectedSurgery.length; i++) {
            listSelected.push(
                (<tr className="service">
                    <td className="tableitem">
                        <p className="itemtext">{this.props.selectedSurgery[i].name}</p>
                    </td>
                    <td className="tableitem">
                        <p className="itemtext">x{this.props.selectedSurgery[i].count}</p>
                    </td>
                    <td className="tableitem">
                        <p className="itemtext">{this.props.selectedSurgery[i].price}đ</p>
                    </td>
                </tr>)
            )
        }
        return (
            <div id="showScroll" className="container">
                <div className="receipt">
                    <h1 className="logo">Teneocto Pharmacy</h1>
                    <div className="address">
                        Addr: 107 Nguyen Phong Sac, HaNoi, VN
		            </div>

                    <div className="title">
                        Receipt
		            </div>

                    <div className="leftTitle">
                        Date: {new Date().toLocaleString()}
		            </div>
                    <div className="address">
                        name: {this.props.userName}
		            </div>

                    <div id='table'>
                        <table>
                            <tr class="tabletitle">
                                <td class="item">
                                    <h2>Item</h2>
                                </td>
                                <td class="Hours">
                                    <h2>Qty</h2>
                                </td>
                                <td class="Rate">
                                    <h2>Total</h2>
                                </td>
                            </tr>

                            {listSelected}

                            <tr class="tabletitle">
                                <td></td>
                                <td class="Rate">
                                    <h2>Total</h2>
                                </td>
                                <td class="payment">
                                    <h2>{this.props.totalPrice}đ</h2>
                                </td>
                            </tr>
                        </table>

                    </div>

                    <div className="thank">
                        Thank you and we hope to see you again!
		            </div>

                    <div className="leftTitle">
                        Hotline: 69966969
		            </div>
                    <div className="leftTitle">
                        Website: wwww.teneocto.io
		            </div>

                    <div className='qr_code'>
                        <QRCode value="http://facebook.github.io/react/" />
                    </div>
                </div>
            </div>
        )
    }
}



const mapDispatchToProps = dispatch => ({
    _handleGetHeaderItems: (headerType) => { dispatch(actions.getHeaderItems(headerType)) }
})

const mapStateToProps = (state) => {
    let obj = {};

    for (let i in state.interfaceReducer) {
        if (state.interfaceReducer.hasOwnProperty(i)) {
            obj[i] = state.interfaceReducer[i]
        }
    }
    return obj;
};

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);