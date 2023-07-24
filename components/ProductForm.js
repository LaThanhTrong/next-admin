import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({_id, title:existingTitle , description:existingDescription, price:existingPrice, images:existingImages, category:assignedCategory, properties:assignedProperties}){
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '')
    const [productProperties, setProductProperties] = useState(assignedProperties || {})
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts,setGoToProducts] = useState(false)
    const [isUploading, setIsUpLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const router = useRouter()
    useEffect(() => {
        setCategoriesLoading(true)
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
            setCategoriesLoading(false)
        })
    }, [])
    async function saveProduct(ev){
        ev.preventDefault()
        if(title == ""){
            document.getElementById("titleError").style.display = "block"
            
        }
        if(price == ""){
            document.getElementById("priceError").style.display = "block"
        }
        else{
            const data = {title, description, price, images, category, properties: productProperties}
            if(_id){
                //update
                await axios.put('/api/products', {...data,_id})
            }
            else{
                //create
                await axios.post('/api/products', data)
            }
            setGoToProducts(true)
        }
    }
    if(goToProducts){
        router.push('/products')
    }
    async function uploadImages(ev){
        const files = ev.target?.files
        if(files?.length > 0){
            setIsUpLoading(true)
            const data = new FormData()
            for(const file of files){
                data.append('file', file)
            }
            const res = await axios.post('/api/upload',data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUpLoading(false)
        }
    }
    function updateImagesOrder(images){
        setImages(images)
    }

    function setProductProp(propName, value){
        setProductProperties(prev => {
            const newProductProp = {...prev}
            newProductProp[propName] = value
            return newProductProp
        })
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return(
        <form onSubmit={saveProduct}>
            <label>Product Name: (*)</label>
            <input type="text" className="border-2 border-[#FFA07A] focus:outline-none w-full mb-2 p-2 rounded-md" placeholder="Product Name (*)" value={title} onChange={ev => setTitle(ev.target.value)}/><br/>
            <span id="titleError" className="hidden text-red-500">Product name is required</span>
            <label>Category:</label><br></br>
        
            <select className="mt-1 block p-2 rounded-md border-2 border-[#FFA07A] focus:outline-none mb-2" value={category}
                onChange={ev => setCategory(ev.target.value)}>
                <option key="unknown" value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {categoriesLoading && (
                <Spinner></Spinner>
            )}
            {propertiesToFill.length > 0 && 
                propertiesToFill.map(p => (
                    <div key={p.name} className="mb-2">
                        <label>{p.name[0].toUpperCase()+p.name.substring(1)}:</label>
                        <div>
                            {productProperties[p.name] === undefined && setProductProp(p.name, p.values[0])}
                            <select className="mt-1 block p-1 rounded-md border-2 border-[#FFA07A] focus:outline-none" value={productProperties[p.name]} onChange={ev => setProductProp(p.name, ev.target.value)}>
                                {p.values.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))
            }
            <label>
                Photos:
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
            <ReactSortable list={images} className="flex flex-warp gap-1" setList={updateImagesOrder}>
                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24 bg-white p-2 rounded-sm border border-gray-200 shadow-sm">
                        <img className="max-h-full rounded-full" src={link} />
                    </div>
                ))}
            </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner></Spinner>
                    </div>
                )}
                <label className="w-24 h-24 text-center flex items-center justify-center gap-1 text-sm text-gray-900 rounded-sm bg-white shadow-sm border border-gray-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div>
                    Upload
                </div>
                <input type="file" onChange={uploadImages} className="hidden"></input>
                </label>
            </div>
            <label>Product Description:</label>
            <textarea rows="8" className="w-full border-2 border-[#FFA07A] focus:outline-none p-2 rounded-md mb-4" placeholder="Description" value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
            <label>Product Price: (*)</label>
            <input type="number" className="border-2 border-[#FFA07A] focus:outline-none w-full mb-1 p-2 rounded-md" placeholder="Price (*)" value={price} onChange={ev => setPrice(ev.target.value)} /><br/>
            <span id="priceError" className="hidden text-red-500">Product price is required</span>
            <button type="button" onClick={() => setGoToProducts(true)} className="bg-gray-500 p-2 px-4 rounded-lg text-white">Cancel</button>
            <button type="submit" className="bg-blue-900 p-2 px-4 rounded-lg text-white mt-4 ml-2">Save</button>
        </form>
    )
}

