import React, { useState, useEffect } from 'react';
import {withRouter, Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import imageComing from '../assets/imageComing.png';
import { 
    HomeOutlined,
    ShopOutlined
} from '@ant-design/icons';
import CategoryTree from '../components/CategoryTree';
// Ant Design Sub-Components
// Ant Design Components
import {
    List,
    Card,
    Image,
    Layout,
    Spin,
    Menu,
    Breadcrumb,
    Pagination,
    Statistic
  } from 'antd';
const { Meta } = Card;

const { Content, Sider, Footer } = Layout;
  
  // Ant Design Icons
import NavigationBar from "../components/NavigationBar";


class ProductListPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalPage: '',
            totalItem: '',
            pageCurrent: parseInt(window.location.hash.slice(1), 0) || 1,
            pageItems: '',
            pred_page: 1,
            loading: true
        }
        this.onPageNumChange = this.onPageNumChange.bind(this);
    }

    // Instead of loading all products at the beginning
    // The request is sent with page number
    // only products on the specific page will be get
    // This way can improve web speed and release traffic
    componentDidMount() {
        this.handleAnchor()
        axios({
            method: 'get',           
            url: '/api/products',
            headers: { 'Content-Type': 'application/JSON; charset=UTF-8' },
            params: {
                page: this.state.pageCurrent,
            }
        }              
        )
            .then(
                (response)=>{
                    console.log("Get products info!");
                    console.log(response.data);
                    
                    this.setState({
                        products: response.data.items,
                        totalPage: response.data.total_pages,
                        totalItem: response.data.total_items,
                        pageItems: response.data.page_items,
                        loading: false
                    });
                }
            )
            .catch(function (error) {
                console.log(error);
            })       
    }

    // when refreshing the url, staying at the current page, not the first one
    handleAnchor() {
        this.onPageNumChange(this.state.pageCurrent);
    }

    // get the page num to transfer
    onPageNumChange(pageCurrent){
        //console.log(pageCurrent)
        this.setState({
            pageCurrent: pageCurrent,
        }, ()=>{
            //set the current page number as hash value
            window.location.hash = `#${pageCurrent}`;
        })
    }

    // when the page num changed, the api request will change to get requested data
    componentDidUpdate() {
        if(this.state.pageCurrent !== this.state.pred_page){
            axios({
                    method: 'get',           
                    url: '/api/products',
                    headers: { 'Content-Type': 'application/JSON; charset=UTF-8' },
                    params: {
                        page: this.state.pageCurrent,
                    }
                }              
            )
                .then(
                    (response)=>{
                        console.log("Update products info!");
                        console.log(response.data);
                        console.log(response.data.items)
                        this.setState({
                            products: response.data.items,
                            totalPage: response.data.total_pages,
                            totalItem: response.data.total_items,
                            pageCurrent: response.data.page_num,
                            pageItems: response.data.page_items,
                            pred_page: response.data.page_num,
                            loading: false
                        });
                    }
                )
                .catch(function (error) {
                    console.log(error);
                })
        }
    }

    //if item.image cannot be gotten in a normal way, show the default image
    getImage(image){
        if(image != null && image != undefined && image != ''){
            return image.smallImageLocation;
        }
            return imageComing;
    }

    render() {
        return (
            <Layout>
                <NavigationBar  history={history} defaultSelected='/productList'/>
                <Layout>
                    <Sider width={256} className="site-layout-background">
                        <CategoryTree />

                    </Sider>
          
                    <Layout style={{ padding: '0 24px 24px'}}>
                    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item href="/">
                                <HomeOutlined />
                                <span>Home</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="/productList">
                                <ShopOutlined />
                                <span>Products</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        {this.state.loading ? <Spin size="large"/> : 
                            <List
                                grid={{
                                    gutter: 16, column: 4
                                }}
                                dataSource={this.state.products}
                                renderItem={item => (
                                    <List.Item>
                                        <Link to={"/products/" + item.productCode}>
                                            <Card
                                                title=
                                                {
                                                    <div style={{whiteSpace:"pre-line"}}>
                                                        {item.name} 
                                                    </div>
                                                }
                                                key={item.name}
                                                hoverable
                                                cover={<Image alt="example" 
                                                    src= {this.getImage(item.image[0])} 
                                                    //if image is 404 not found, show the default image
                                                    onError={(e) => {e.target.onerror = null; e.target.src=imageComing}}/>}>  
                                                    <Meta key={item.productCode} 
                                                        //title={item.price ? ('$ '+item.price) : ('Price not set')}
                                                        title={<Statistic value={item.price} prefix="$" precision={2} />} 
                                                        description={item.barcode ? ('Barcode: ' + item.barcode) : ('ProductCode: ' + item.productCode)}
                                                    />
                                            </Card>
                                        </Link>
                                    </List.Item>
                                )}
                            />
                        }
                        <Pagination //add active url for each productlist page
                            total={this.state.totalItem}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                            pageSize = {20}
                            current={this.state.pageCurrent}
                            onChange = {this.onPageNumChange}
                            showQuickJumper
                            
                        />

                        <Footer style={{ textAlign: 'center' }}>SQUIZZ ©2020 Created by SQ-Wombat and SQ-Koala</Footer>

                    </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
  

export default withRouter(ProductListPage);
