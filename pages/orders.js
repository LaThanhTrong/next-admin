import PDFFile from "@/components/Invoices";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { set } from "date-fns";

export default function OrdersPage(){
    const [orders, setOrders] = useState([])
    const [orderDetail, setOrderDetail] = useState([])
    const [allOrders, setAllOrders] = useState([])
    const [searchOrder, setSearchOrder] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const itemsPerPage = 5
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = orders.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(orders.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % orders.length;
        setItemOffset(newOffset);
    };

    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/orders').then(response => {
            setAllOrders(response.data)
            setOrders(response.data)
            axios.get('/api/orderdetails').then(res => {
                setOrderDetail(res.data)
            })
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        setOrders(allOrders.filter(order => order._id.toLowerCase().includes(searchOrder.toLowerCase())))
        setItemOffset(0)
    },[searchOrder])

    return(
        <Layout>
            <div className="flex justify-between">
                <h1 className="text-4xl font-bold mb-5">Orders</h1>
                <input className="w-[300px] py-2 px-3 rounded-lg bg-inherit border-2 outline-none border-[#4b5563] focus:border-[#4f46e5]" type="text" onChange={ev => setSearchOrder(ev.target.value)} placeholder="Search for Orders IDs..."></input>
            </div>
            <table className="mt-4 basic text-left">
                <colgroup>
                    <col style={{ width: '180px' }} />
                    <col style={{ width: '160px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '300px' }} />
                    <col style={{ width: '180px' }} />
                    <col style={{ width: '100px' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date created</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                        <th></th>
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
                    {currentItems.length > 0 && orderDetail.length > 0 && currentItems.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td className={order.paid ? 'text-emerald-500' : 'text-red-500'}>
                                {order.paid ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                        <span>Paid</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span>Failed</span>
                                    </div>
                                )}
                            </td>
                            <td>
                                Customer: {order.name} <br />
                                Email: {order.email} <br />
                                Address: {order.address} <br />
                                Contact: {order.phoneNumber} 
                            </td>
                            <td>
                                {orderDetail.filter(od => od.order._id === order._id)[0].line_items.map((l,i) => (
                                    <div key={i}>
                                        {l.price_data?.product_data.name} x {l.quantity}<br />
                                    </div>
                                ))}
                            </td>
                            <td>
                                <PDFDownloadLink document={<PDFFile order={order} line_items={orderDetail.filter(od => od.order._id === order._id)[0].line_items} />} fileName="invoice">
                                    {({loading}) => (loading ? <button className="bg-black">Loading Document...</button> : <button className="bg-black">Download</button> )}
                                </PDFDownloadLink>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3 text-center ml-[-4px]">
            <ReactPaginate
                marginPagesDisplayed={3}
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                containerClassName={'pagination flex'}
                activeLinkClassName={'active'}
            />
        </div>
        </Layout>
    )
}