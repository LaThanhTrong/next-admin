import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage(){
    const router = useRouter()
    const [productInfo, setProductInfo] = useState()
    const {id} = router.query
    useEffect(() =>{
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response =>{
            setProductInfo(response.data)
        })
    }, [id])
    function goBack(){
        router.push('/products')
    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id)
        await axios.delete('/api/inventory?productId='+id)
        alert('Product deleted successfully!')
        goBack()
    }
    return (
        <Layout>
            <h1 className="text-center mb-4">Do you really want to delete {productInfo?.title}?</h1>
            <div className="flex gap-4 justify-center">
                <button className="bg-red-600 p-2 px-4 rounded-lg text-white" onClick={deleteProduct}>Yes</button>
                <button className="bg-gray-500 p-2 px-4 rounded-lg text-white" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}