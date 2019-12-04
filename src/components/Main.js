import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from './Button';

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = [];
  }

  componentDidMount() {
    this._fetchProducts();
  }

  _fetchProducts() {
    this.props._handleFetchProducts();
  }

  _selectAction(key, type) {
    this.props._handleSelectAction(key, type);
  }

  _modifyCount(key, event) {
    const VALUE = event.target.value;
    this.props._handleModifyCount(key, VALUE);
  }

  _modifyTake(key, event) {
    const VALUE = event.target.value;
    this.props._handleModifyTake(key, VALUE);
  }

  _modifyDescription(key, event) {
    const VALUE = event.target.value;
    this.props._handleModifyDescription(key, VALUE);
  }

  _removeSelectedSurgery(key) {
    confirmAlert({
      title: 'Are you sure you want to delete?',
      message: '',
      closeOnEscape: true,
      closeOnClickOutside: true,
      buttons: [
        {
          label: 'YES',
          onClick: () => this.props._handleRemoveSelectedSurgery(key)
        },
        {
          label: 'NO'
        }
      ]
    });
  }

  _updateReminder(key, val) {
    // const NEW_STATE = JSON.parse(JSON.stringify(this.state));
    // if (val) {
    //   NEW_STATE.day = !NEW_STATE.day;
    // } else {
    //   NEW_STATE.night = !NEW_STATE.night;
    // }
    if (val) {
      this.state[key].day = !this.state[key].day;
    } else {
      this.state[key].night = !this.state[key].night;
    }
    this.props._handleModifyReminder(key, this.state[key]);
  }

  _applyDiscount = (obj) => {
    const TARGET_NAME = document.getElementById('discountTarget').value;

    const isExist = this.props.selectedDiscount.filter(v => v.target === TARGET_NAME);
    if (isExist.length) return alert('This item has already been discounted.');

    this.props._handleApplyDiscount(obj.i, TARGET_NAME);
    obj.onClose();
  }

  _deleteSelectedDiscount = (obj) => {
    this.props._handleDeleteSelectedDiscount(obj.i);
    obj.onClose();
  }

  _modifySelectedDiscount(v, i) {
    const makeDatalist = () => {
      return this.props.selectedSurgery.map((v, i) => {
        if (v.isDiscount === false) return <option key={i} value={v.name}>{v.price}</option>;
      });
    }

    confirmAlert({
      closeOnEscape: true,
      closeOnClickOutside: true,
      customUI: ({ onClose }) => {
        return (
          <section className={'discount__targetList'}>
            <h2>{v.name}</h2>
            <input id={'discountTarget'} defaultValue={v.target} placeholder={'Search'} list="discountTargetSurgeries" />
            <datalist id="discountTargetSurgeries">
              {makeDatalist()}
            </datalist>
            <div>
              {<Button type="surgery p-h-3" text="delete" headerType={{ onClose, i }} click={this._deleteSelectedDiscount} />}
              {<Button type="discount p-h-3" text="apply" headerType={{ onClose, i }} click={this._applyDiscount} />}
            </div>
          </section>
        )
      }
    });
  }

  _makeList() {
    let results = [];
    if (this.props.selectedSurgery.length) {
      const counts = (total) => {
        let arr = [];
        for (let i = 1; i <= total; i++) {
          arr.push(<option key={i} value={i}>{i}</option>);
        }
        return arr;
      }
      const SURGERY = this.props.selectedSurgery.map((v, i) => {
        const PRICE_FORMATTING = v.price.toLocaleString(this.props.currency, { minimumFractionDigits: 0 });
        const DISCOUNT_PRICE_FORMATTING = v.discountPrice && v.discountPrice.toLocaleString(this.props.currency, { minimumFractionDigits: 0 });
        this.state.push({ day: false, night: false });
        return (
          <section className={'cursor-none'} key={i}>
            <div className={'items__wrapper cb_clear'}>
              <div className={'name'}><h2>{v.name}</h2></div>
              <span className={DISCOUNT_PRICE_FORMATTING && 'strike'}>{PRICE_FORMATTING}đ</span>
              {DISCOUNT_PRICE_FORMATTING && <span className={'discountPrice'}>{DISCOUNT_PRICE_FORMATTING}đ({v.discountName} apply discount)</span>}
            </div>

            <div className={'items__wrapper__surgery--buttons cb_clear'}>
              <small>Take: </small><select onChange={((e) => { this._modifyTake(i, e) })} value={v.dosage}>{counts(v.maxTake)}</select>
              <button className={this.state[i].day ? 'schedule-surgery' : 'schedule-surgery-deactive'} onClick={((e) => {
                this._updateReminder(i, true);
              })}>Day</button>

              <button className={this.state[i].night ? 'schedule-surgery' : 'schedule-surgery-deactive'} onClick={(() => {
                this._updateReminder(i, false)
              })}>Night</button>
            </div>
            <div>
              <input className={'description'} placeholder="Description..." onChange={(e) => { this._modifyDescription(i, e) }}></input>
            </div>

            <div className={'items__wrapper cb_clear'}>
              <div className={'items__wrapper__surgery--buttons cb_clear'}>
                <small>Qty: </small><select onChange={((e) => { this._modifyCount(i, e) })} value={v.count}>{counts(v.totalCount)}</select>
                <button className={'delete-surgery'} onClick={(() => { this._removeSelectedSurgery(i) })}>remove</button>
              </div>
            </div>
          </section>

        )
      })
      results.push(SURGERY);
    }

    if (this.props.selectedDiscount.length) {
      const DISCOUNT = this.props.selectedDiscount.map((v, i) => {
        const RATE = Number(v.rate * 100).toFixed();
        return (
          <section className={'cursor-none'} key={i}>
            <div className={'items__wrapper cb_clear'}>
              <div className={'name'}><h2>{v.name}</h2></div>
              <span className={'discountPercent'}>{RATE}% discount</span>
              <div className={'items__wrapper__surgery--buttons cb_clear'}>
                <button className={'modify-discount'} onClick={(() => { this._modifySelectedDiscount(v, i) })}>Apply discount</button>
              </div>
            </div>
          </section>
        )
      })
      results.push(DISCOUNT);
    }
    if (!results.length) results = <section className={'noItems cursor-none'}>Please select a product.</section>;
    return results;
  }

  _renderProducts(type) {
    const PRODUCTS = this.props.products;
    switch (type) {
      case 'main':
        return this._makeList();
      case 'surgery':
        if (Object.keys(PRODUCTS).length) {
          const ITEMS = PRODUCTS.items;
          const MAKE_ARRAY = Object.keys(ITEMS).map(k => {
            const PRICE_FORMATTING = ITEMS[k].price.toLocaleString(this.props.currency, { minimumFractionDigits: 0 });
            return (
              <section className={'cb_clear'} key={k} onClick={(() => { this._selectAction(k, type) })}>
                <div className={'items__wrapper'}>
                  <small>{ITEMS[k].category}</small>
                  <div className={'name'}><h2>{ITEMS[k].name}</h2></div>
                  <span>{PRICE_FORMATTING}đ</span>
                  <i>{ITEMS[k].isSelected && <FontAwesomeIcon icon={faCheck} />}</i>
                </div>
              </section>
            )
          })
          return MAKE_ARRAY;
        } else {
          return;
        }
      case 'discount':
        if (Object.keys(PRODUCTS).length) {
          const DISCOUNTS = PRODUCTS.discounts;
          const MAKE_ARRAY = Object.keys(DISCOUNTS).map(k => {
            const RATE = Number(DISCOUNTS[k].rate * 100).toFixed();
            return (
              <section className={'cb_clear'} key={k} onClick={(() => { this._selectAction(k, type) })}>
                <div className={'items__wrapper'}>
                  <div className={'name'}><h2>{DISCOUNTS[k].name}</h2></div>
                  <span className={'discountPercent'}>{RATE}% discount</span>
                  <i>{DISCOUNTS[k].isSelected && <FontAwesomeIcon icon={faCheck} />}</i>
                </div>
              </section>
            )
          })
          return MAKE_ARRAY;
        } else {
          return;
        }
      default:
        return (
          <section className={'noItems cursor-none'}>Please select a product.</section>
        );
    }
  }

  render() {
    if (this.props.error) {
      return <main><section className={'noItems'}>Network error.<br /><br />Please try again later. {this.props.error.message}</section></main>;
    }

    if (this.props.loading) {
      return <main><section className={'noItems'}>Loading <FontAwesomeIcon icon={faSpinner} spin={true} /></section></main>;
    }

    return (
      <main>
        {this._renderProducts(this.props.headerType)}
      </main>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  _handleFetchProducts: () => { dispatch(actions.fetchProducts()) },
  _handleSelectAction: (key, type) => { dispatch(actions.selectAction(key, type)) },
  _handleModifyCount: (key, val) => { dispatch(actions.modifyCount(key, val)) },
  _handleModifyTake: (key, val) => { dispatch(actions.modifyTake(key, val)) },
  _handleModifyDescription: (key, val) => { dispatch(actions.modifyDescription(key, val)) },
  _handleModifyReminder: (key, val) => { dispatch(actions.modifyReminder(key, val)) },
  _handleRemoveSelectedSurgery: (key) => { dispatch(actions.removeSelectedSurgery(key)) },
  _handleApplyDiscount: (index, targetName) => { dispatch(actions.applyDiscount(index, targetName)) },
  _handleDeleteSelectedDiscount: (index) => { dispatch(actions.deleteSelectedDiscount(index)) }
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


export default connect(mapStateToProps, mapDispatchToProps)(Main);
