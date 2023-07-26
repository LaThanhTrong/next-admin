import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {Fragment} from 'react';

export default function Products() {
    const [products, setProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [searchProduct, setSearchProduct] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)

    const itemsPerPage = 5
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = products.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(products.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.length;
        setItemOffset(newOffset);
    };

    useEffect(() => {
        setIsLoading(true)
        setCategoriesLoading(true)
        axios.get('/api/products').then(response =>{
            setProducts(response.data)
            setAllProducts(response.data)
            setIsLoading(false)
        })
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
            setCategoriesLoading(false)
        })
    }, [])
    
    useEffect(() => {
        setProducts(allProducts.filter(product => product.title.toLowerCase().includes(searchProduct.toLowerCase())))
    },[searchProduct])

    return ( 
        <Layout>
        <div className="flex justify-between items-center" href="products/new">
            <h1 className="text-4xl font-bold">Products</h1>
            <div className="flex items-center gap-3">
                <input className="w-[300px] py-2 px-3 rounded-lg bg-inherit border-2 outline-none border-[#4b5563] focus:border-[#4f46e5]" type="text" onChange={ev => setSearchProduct(ev.target.value)} placeholder="Search for Products..."></input>
                <Link href="products/new" className="dark:bg-[#4f46e5] hover:dark:bg-[#6962f9] bg-[#FFA07A] hover:bg-[#ffb193] py-2 px-3 rounded-lg text-white font-bold flex justify-center items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                    <span>Add product</span>
                </Link>
            </div>
        </div>
        
        <div className="overflow-auto">
            <table className="basic mt-8">
            <colgroup>
                <col style={{ width: '300px' }} />
                <col style={{ width: '200px' }} />
                <col style={{ width: '300px' }} />
                <col style={{ width: '200px' }} />
                <col style={{ width: '140px' }} />
                <col style={{ width: '140px' }} />
            </colgroup>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Category</td>
                        <td>Description</td>
                        <td>Price</td>
                        <td colSpan={2} className="text-center">Action</td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={6}>
                                <div className="py-4">
                                    <Spinner fullWidth={true}></Spinner>
                                </div>
                            </td>
                        </tr>
                    )}
                    {currentItems.map(product => (
                        <tr key={product._id}>
                            <td className="">
                                <div className="rounded-md flex gap-3 items-center">
                                    <img className="bg-white w-[80px] rounded-md" src={product.images[0]}/>
                                    <p className="text-xl">{product.title}</p>
                                </div>
                            </td>
                            {product.category === null ? (
                                <td className="text-xl">Uncategorized</td>
                            ) : (
                                <>
                                    {categoriesLoading ? (
                                        <td><Spinner fullWidth={true}></Spinner></td>
                                    ) : (
                                        <>
                                            {categories.length > 0 && categories.map(c => (
                                                <Fragment key={c._id}>
                                                    {product.category === c._id && (
                                                        <td key={c._id} className="text-xl">{c.name}</td>
                                                    )}
                                                </Fragment>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                            <td>{product.description}</td>
                            <td>đ{product.price.toLocaleString()}</td>
                            <td align="center">
                                <Link className="items-center bg-green-500 hover:bg-green-400 max-w-fit" href={'/products/edit/'+product._id}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                    Edit
                                </Link>
                            </td>
                            <td align="center">
                                <Link className="items-center bg-red-500 hover:bg-red-400 max-w-fit" href={'/products/delete/'+product._id}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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
                // pageClassName={'page-item'}
                // pageLinkClassName={'page-link'}
                // previousClassName={'page-item'}
                // previousLinkClassName={'page-link'}
                // nextClassName={'page-item'}
                // nextLinkClassName={'page-link'}
                // breakClassName={'page-item'}
                // breakLinkClassName={'page-link'}
                activeLinkClassName={'active'}
            />
        </div>
        </Layout>
    );
}