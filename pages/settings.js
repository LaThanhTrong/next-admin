import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { useTheme } from "next-themes";
function SettingsPage({swal}){
    const [products, setProducts] = useState([])
    const [featuredProductId, setFeaturedProductId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [shippingFee, setShippingFee] = useState('')
    const {systemTheme, theme, setTheme} = useTheme()
    const [mounted, setMounted] = useState(false)
    

    const renderThemeChanger = () => {
        if(!mounted){
            return null
        }
        const currentTheme = theme === 'system' ? systemTheme : theme

        if(currentTheme === 'dark'){
            return(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer" onClick={() => setTheme('light')}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
            )
        }
        else{
            return(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer" onClick={() => setTheme('dark')}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
            )
        }
    }

    useEffect(() => {
        setMounted(true)
        setIsLoading(true)
        fetchAll().then(() => {
            setIsLoading(false);
        })
    }, [])

    async function fetchAll(){
        await axios.get('/api/products').then(response => {
            setProducts(response.data)
        })
        await axios.get('/api/settings?name=featuredProductId').then(response => {
            setFeaturedProductId(response.data.value)
        })
        await axios.get('/api/settings?name=shippingFee').then(res => {
            setShippingFee(res.data.value);
        });
    }

    async function saveSettings(){
        setIsLoading(true)
        await axios.put('/api/settings',{
            name: 'featuredProductId',
            value: featuredProductId,
        })
        await axios.put('/api/settings',{
            name: 'shippingFee',
            value: shippingFee,   
        })
        setIsLoading(false)
        await swal.fire({
            icon: 'success',
            title: 'Settings saved',
        })
    }

    return(
        <Layout>
            <h1 className="text-4xl font-bold mb-5">Settings</h1>
            {isLoading && (
                <Spinner fullWidth={true}></Spinner>
            )}
            {!isLoading && (
                <>
                    <label>Featured Product</label>
                    <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
                        {products.length > 0 && products.map(product => (
                            <option key={product._id} value={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <label>Shipping Price (in vnd)</label>
                    <input type="number" value={shippingFee} onChange={ev => setShippingFee(ev.target.value)} />
                    <div>
                        <button onClick={saveSettings}>Save settings</button>
                    </div> 
                    <div className="flex items-center gap-4">
                        <h1 className="text-black dark:text-white">Toggle Light/Dark mode</h1>
                        {renderThemeChanger()}
                    </div>
                </>
            )}
        </Layout>
    )
}

export default withSwal(({swal}) => (
    <SettingsPage swal={swal} />
  ));