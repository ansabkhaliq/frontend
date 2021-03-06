import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { withRouter } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

// Todo: This is the temp design for Checkout - Add Billing Address & Delivery Address function
import AddressesList from '../components/AddressesList'

// Ant Design Components
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Layout,
    notification,
    Row,
    Statistic,
  } from 'antd';

/**
 * This page is responsible for user:
 *      1. select delivery & billing address
 *      2. edit&add delivery & billing address
 *      3. check out
 */

const CheckOutPage = ({ history }) =>{
    // General page state
    const [submitLoading, setSubmitLoading] = useState(false);  // Order submission loading state
    const [instruction, setInstruction] = useState("");

    // Global customer & cart state
    const { customerId, products, totalPrice, totalGST, deliveryAddrId, billingAddrId } = useStoreState(state => ({
        customerId: state.customer.customerId,
        products: state.cart.products,
        totalPrice: state.cart.totalPrice,
        totalGST: state.cart.totalGST,
        deliveryAddrId: state.customer.deliveryAddrId,
        billingAddrId: state.customer.billingAddrId,
    }))

    const {emptyCart} = useStoreActions(actions=>({
        emptyCart: actions.cart.emptyCart
    }))


    const returnCart = () =>{
        history.push('/order');
      }

    /**
     * Handles submission of an order to the backend API endpoint
     */
    const handleSubmit = async () => {
        // First, check if the cart is empty
        if (products.length == 0) {
        notification.warning({
            message: 'Your cart is empty',
            description: 'Please add a product to your cart before submitting an order'
        })
        return;
        }

        // Map products in the cart to 'lines' (i.e. order details)
        let lines = products.map(product => ({
            product_id: product.id,
            quantity:product.quantity
        }))

        // Submit the order to the backend API endpoint
        try {
        setSubmitLoading(true);
        const response = await axios.post('/api/orders',
        {headers: { 'Content-Type': 'application/JSON; charset=UTF-8' }},
        {data: {
            customer_id:customerId,
            delivery_addr_id:deliveryAddrId,
            billing_addr_id:billingAddrId,
            lines: lines,
            session_key: sessionStorage.getItem('sessionKey'),
            instructions: instruction
        }});
        
        console.log(response);
        setSubmitLoading(false);

        // Check the response, and redirect to home if successful
        if (response.status == 201) {
            notification.success({
            message: 'Your order has been submitted!'
            })
            setTimeout(() => {
            history.push('/');
            }, 4500);
            emptyCart()
        }
        } catch (err) {
        console.log(err);
        if (err.response && err.response.status == 500) {
            notification.error({
            message: 'Could not submit order',
            description: 'There was an error submitting your order, please try again.'
            })
        }
        }
    }

    // Check if authenticated before rendering the page, otherwise redirect to the home page
    if (!sessionStorage.getItem('user')) {
        history.push('/login');
    }

    
    return(
        <Layout style={{ minHeight: '100vh' }}>
            {/* Top navigation bar */}
            <NavigationBar history={history}/>

            {/* Add product form and cart information */}
            <Row style={{marginTop:'80px'}} justify="center" gutter={[0, 16]}>
            
                <Col span={18}>
                    <Card style={{ borderRadius: '1.25rem', boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)" }}>
                        <Row align="middle">
                            <Col span={12}>
                                <Form>
                                    <Form.Item label="Instruction">
                                        <Input.TextArea 
                                        onChange={(e)=>setInstruction(e.target.value)}
                                        />
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col span={8} offset={4}>
                                <Row>
                                    <Col span={12}>
                                        <Statistic title="Total Price (AUD)" value={totalPrice} prefix="$" precision={2} />
                                        <Button style={{ marginTop: 16 }} type="danger" onClick={() => returnCart()}>
                                            Return to Cart
                                        </Button>
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="GST" value={totalGST} prefix="$" precision={2} />
                                        <Button style={{ marginTop: 16 }} type="primary" onClick={() => handleSubmit()} loading={submitLoading}>
                                            Submit Order
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>        
            </Row>

            <Row style={{marginTop:'10px'}} justify="center" gutter={[32, 32]}>
                <Col span={18}>
                <Card style={{ borderRadius: '1.25rem', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}>
                    <AddressesList></AddressesList>
                </Card>
                </Col>
            </Row>
            
        </Layout>
    )//end return

}//end CheckOutPage

export default withRouter(CheckOutPage);