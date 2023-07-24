import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
        
export default function EditProductPage(){
    const [productInfo, setProductInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { id } = router.query
    useEffect(() => {
        if(!id){
            return
        }
        setIsLoading(true)
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data)
            setIsLoading(false)
        })
    }, [id])
    return(
        <Layout>
            <h1 className="text-blue-900 mb-4 text-3xl font-bold">Edit product</h1>
            {isLoading && (
                <Spinner fullWidth={true}></Spinner>
            )}
            {productInfo && (
                <ProductForm {...productInfo} />
            )}
        </Layout>
    )
}
