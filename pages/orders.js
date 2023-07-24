import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage(){
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/orders').then(response => {
            setOrders(response.data)
            setIsLoading(false)
        })
    }, [])

    return(
        <Layout>
            <h1 className="text-4xl font-bold mb-5">Orders</h1>
            <table className="mt-4 basic text-center">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date created</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={5}>
                                <div className="py-4">
                                    <Spinner fullWidth={true}></Spinner>
                                </div>
                            </td>
                        </tr>
                    )}
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td className={order.paid ? 'text-green-500' : 'text-red-500'}>
                                {order.paid ? 'Yes' : 'No'}
                            </td>
                            <td>
                                Customer: {order.name} <br />
                                Email: {order.email} <br />
                                Address: {order.address} <br />
                                Contact: {order.phoneNumber} 
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <div key={l}>
                                        {l.price_data?.product_data.name} x {l.quantity}<br />
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}