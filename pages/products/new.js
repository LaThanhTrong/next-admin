import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct(){
    return (
        <Layout>
        <h1 className="mb-4 text-3xl font-bold">Add a product</h1>
        <ProductForm></ProductForm>
        </Layout>
    )
}