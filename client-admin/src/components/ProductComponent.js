import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component{

    static contextType = MyContext ; // using this . context to access global state

    constructor(props){
        super(props);
        this.state = {
            products: [],
            noPages: 0,
            curPage: 1,
            itemSelected: null
        };
    }

    render(){
        const prods = this.state.products.map((item) => {
            return (
                <tr key ={ item._id } className="datatable" onClick={() => this.trItemClick(item)}>
                    <td>{ item._id }</td>
                    <td>{ item.name }</td>
                    <td>{ item.price } </td>
                    <td>{ new Date(item.cdate).toLocaleString() } </td>
                    <td>{ item.category.name } </td>
                    <td><img src={"data:image/jpg;base64," + item.image } width="100px" height="100px" alt="" /></td>
                </tr>
            );
        });
        const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
            if((index + 1) === this.state.curPage){
                return(<span key={ index }>| <b>{ index + 1 }</b> |</span>);
            } else {
                return(<span key={ index } className="link" onClick={() => this.lnkPageClick(index + 1)} >| { index + 1 } |</span>);
            }
        });
        return (
            <div class="row table-container">
                <h2 className="text-center">PRODUCT LIST</h2>
                <div class="col-8 col-sm-8 col-md-8 tabledata">
                    <table class="table table-hover col-7">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Creation date</th>
                                <th scope="col">Category</th>
                                <th scope="col">Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            { prods }
                            <tr>
                                <td colSpan="6">{ pagination }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-6 col-md-4 tabledata-detail">
                    <ProductDetail item={ this.state.itemSelected } curPage={ this.state.curPage } updateProducts={ this.updateProducts }/>
                </div>
            </div>
        );
    }
    
    updateProducts = (products, noPages) => { // arrow - function
        this.setState({ products: products, noPages: noPages });
    }

    componentDidMount(){
        this.apiGetProducts(this.state.curPage);
    }

    // event - handlers
    lnkPageClick(index){
        this.apiGetProducts(index);
    }
    
    trItemClick(item){
        this.setState({ itemSelected: item });
    }

    // apis
    apiGetProducts(page){
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/products?page=' + page, config).then((res) => {
            const result = res.data;
            this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
        });
    }
}

export default Product ;