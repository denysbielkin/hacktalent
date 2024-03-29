import React, {PureComponent} from 'react';
import {Card, Modal, Button, Pagination, Spin, message} from 'antd';
import * as _ from 'lodash';
import axios from 'axios';
import memoize from 'memoize-one';
import {storageKey, getCart, urls} from '../../../common/helper';
import {ShopDiv, StyledPrice, StyledProductList, StyledCard, StyledProductTitle} from './styled';

import {CartPlus} from 'styled-icons/fa-solid/CartPlus';

export default class Shop extends PureComponent {
    pageSize = 12;
    defaultAmount = 0;

    state = {
        isLoading: false,
        tmpData: [
            {
                name: 'T-Shirt Blue',
                description: 'blahblahblahblahblahblahblah-blah',
                amount: this.defaultAmount,
                price: 4110
            },
            {
                name: 'T-Shirt Bold',
                description: '88blahblahblahblahblahblahblah-blah',
                amount: this.defaultAmount,

                price: 1510
            },
            {
                name: 'T-Shirt Gold',
                description: '7blahblahblahblahblahblahblah-blah',
                amount: this.defaultAmount,

                price: 6110
            }, {
                name: 'T-Shirt Dark-Blue',
                description: 'blahblahblahblahblahblahblah-blah',
                amount: this.defaultAmount,

                price: 910
            }, {
                name: 'T-Shirt Light-Blue',
                description: 'blahblahblahblahblahblahblah-blah',
                amount: this.defaultAmount,

                price: 9910
            },
            {
                name: 'T-Shirt Light',
                description: 'blahblahblahblahblahblahblah-b3333lah',
                amount: this.defaultAmount,

                price: 1160
            },
            {
                name: 'T-Shirt Dark',
                description: 'blablahblahblahblahh-b444lah',
                amount: this.defaultAmount,

                price: 1510
            },
            {
                name: 'T-Shirt Green',
                description: 'blah3-bblahblahblahblahlah',
                amount: this.defaultAmount,

                price: 1510
            },
            {
                name: 'T-Shirt Red',
                description: 'bl1ah-blah',
                amount: this.defaultAmount,

                price: 11
            },
            {
                name: 'T-Shirt Brown',
                description: 'bla5hblah-blah',
                amount: this.defaultAmount,

                price: 1310
            },
        ],
        offset: 0,
    };

    onChangePagination = (page) => {
        console.error(page)

        this.loadData(page)
    };


    onClickAddToCart = memoize((index) => {
        let cart = getCart(storageKey);
        const itemToCart = this.state.tmpData[index];

        console.error('itemToCart', itemToCart)
        cart.push(itemToCart);


        /// CHECK AMOUNT
        _.map(cart, item => {


            if ((item.name === this.state.tmpData[index].name) && item.amount > 1) {
                item.amount++
            } else if (this.state.tmpData[index] === 0) {
                this.state.tmpData[index].amount = 1;
            }
        });
        cart = _.uniqBy(cart, (item) => item.name);


        ///

        cart = JSON.stringify(cart);
        console.error('cart', cart);

        localStorage.setItem(storageKey, cart);
        console.error('e,index', index)

        message.success(<span><b>"{this.state.tmpData[index].name}"</b> has been added to your cart!!!</span>)
    });

    loadData = (page) => {
        /**request to the DB*/
        // this.setState({isLoading: true});
        const {offset} = this.state;
        //axios?
        axios.get('https://jsonplaceholder.typicode.com/todos')//`${urls.host}${urls.viewList}`)
            .then(res => {
                console.error(res)
                console.error('loading', this.state.isLoading)
                // const data = {}
                this.setState({isLoading: false})
                this.getData()
            })
            .then(() => {

                console.error('state', this.state)
            })

    };

    componentDidMount() {
        this.loadData();
    }

    getData() {
        this.setState({
            currentData: _.map(this.state.tmpData, (item, key) => {
                if (key !== this.state.offset + this.pageSize || key >= this.state.offset) {
                    return item;
                } else return;
            })
        })
    }


    showProductDetails(name, key) {
        Modal.info({
            title: name,
            content: (
                <div>
                    *SOME PARAMS*
                </div>
            ),
            okText:this.printBuyButton(key),
            onOk: {}
        })

    }

    printBuyButton = (key) => (
        <Button block type={'primary'} onClick={(event) => this.onClickAddToCart(key)}>
            Add to Cart <CartPlus size={'15px'}/>
        </Button>
    );

    printProductList() {
        /**
         * while we haven't data, we will you tmp data arr
         * */

        const {Meta} = Card;
        const {currentData} = this.state;
        return (
            <StyledProductList>
                {this.state.isLoading ?
                    <div style={{
                        alignSelf: 'center'
                    }}>
                        <Spin size={'large'}/>
                    </div>
                    :
                    _.map(currentData, (item, key) => (
                        <StyledCard
                            onClick={() => this.showProductDetails(item.name, key)}
                            key={key}
                            hoverable
                            cover={<img alt="example"
                                        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                        >
                            <Meta title={<StyledProductTitle>{item.name}</StyledProductTitle>} description={
                                <div>
                                    <div style={{
                                        marginBottom: '5px'
                                    }}> {_.truncate(item.description, {
                                        length: 22,
                                    })} </div>

                                    <StyledPrice><h5>{item.price}₴</h5></StyledPrice>

                                    {this.printBuyButton(key)}
                                </div>
                            }/>
                        </StyledCard>
                    ))}

            </StyledProductList>

        )
    }

    // onChangePagination(){
    //    /**
    //     * this.loadData();
    //     *
    //     * PART OF CONTENT OF THAT FUNC FOR FUTURE: */
    //
    //
    // }


    render() {


        return (


            <ShopDiv>

                {this.printProductList()}
                <Pagination
                    style={{
                        margin: '20px 0 40px 20px'
                    }}
                    // hideOnSinglePage
                    onChange={this.onChangePagination}
                    total={this.state.tmpData.length}
                    pageSize={this.pageSize}/>
            </ShopDiv>

        )
    }

}