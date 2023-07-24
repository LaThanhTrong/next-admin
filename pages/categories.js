import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import ReactPaginate from "react-paginate";
import Spinner from "@/components/Spinner";

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const itemsPerPage = 5
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = categories.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(categories.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % categories.length;
        setItemOffset(newOffset);
    };

    useEffect(() => {
       fetchCategories()
    },[])

    function fetchCategories(){
        setIsLoading(true)
        axios.get('/api/categories').then(result =>{
            setCategories(result.data)
            setIsLoading(false)
        })
    }
    async function saveCategory(ev){
        ev.preventDefault()
        if(name == ""){
            document.getElementById("nameError").style.display = "block"
        }
        else{
            const data = {name, parentCategory, properties:properties.map(p => ({name: p.name, values: p.values.replace(/\s*,\s*/g, ",").trim().split(',')}))}
            if(editedCategory){
                data._id = editedCategory._id
                await axios.put('/api/categories', data)
                setEditedCategory(null)
            }
            else{
                await axios.post('/api/categories', data)
            }
            document.getElementById("nameError").style.display = "none"
            setName('')
            setParentCategory('')
            setProperties([])
            fetchCategories()
        }
    }

    function editCategory(category){
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(category.properties.map(({name, values}) => ({name, values: values.join(',')})))
    }
    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Accept',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                const {_id} = category
                await axios.delete('/api/categories?_id='+_id)
                fetchCategories()
            }
        })
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'',values:''}]
        })
    }
    function handlePropertyNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
        })
    }
    function handlePropertyValuesChange(index, property, newValues){
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
        })
    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p, pIndex) =>{
                return pIndex !== indexToRemove
            })
        })
    }
    return (
        <Layout>
            <h1 className="text-4xl font-bold mb-5">Categories</h1>
            <h2 className="font-bold text-xl mb-2">{editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category: (*)'}</h2>
            <form onSubmit={saveCategory}>
                <div className="flex gap-3 items-center">
                <input className="w-full dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" type="text" placeholder="Category name (*)" value={name} onChange={ev => setName(ev.target.value)}></input>
                <select className="dark:bg-[#1f2938] border-2 border-[#d1d5db] focus:border-[#FFA07A] dark:border-[#4b5563] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                    <option className="dark:bg-[#374151]" value="">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option className="dark:bg-[#374151]" key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select><br></br>
                </div>
                <span id="nameError" className="hidden text-red-500">Category name is required</span>
                <div className="mb-2 mt-3">
                    <h2 className="font-bold text-xl mb-2">Properties:</h2>
                    <button type="button" onClick={addProperty} className="dark:bg-[#374151] bg-white border-2 border-[#d1d5db] dark:border-none text-sm py-2 px-4 rounded-md flex justify-center">Add new property</button>
                    {properties.length > 0 && properties.map((property,index) => (
                        <div key={index} className="flex gap-2 mt-2">
                            <input type="text" className="w-full dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" value={property.name} onChange={ev => handlePropertyNameChange(index, property, ev.target.value)} placeholder="Property name"></input>
                            <input type="text" className="w-[338px] dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" value={property.values} onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)} placeholder="Property values, comma seperated"></input>
                            <button type="button" className="bg-rose-600 p-1 rounded-lg text-white" onClick={() => removeProperty(index)}>Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1 mt-4">
                    {editedCategory && (
                        <button type="button" onClick={() => {setEditedCategory(null), setName(''), setParentCategory(''), setProperties([])}} className="bg-gray-500 p-2 px-4 rounded-lg text-white">Cancel</button>
                    )}
                    <button type="submit" className="bg-[#4f46e5] p-2 px-4 rounded-lg text-white">Save</button>
                </div>
            </form>
            {!editedCategory && (
                <div>
                    <table className="mt-4 basic text-center">
                    <colgroup>
                        <col style={{ width: '40%' }} />
                        <col style={{ width: '40%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ maxWidth: '10%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td colSpan={2}>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={4}>
                                    <div className="py-4">
                                        <Spinner fullWidth={true}></Spinner>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {currentItems.length > 0 && currentItems.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td align="center"> 
                                <button className="bg-green-500" onClick={() => editCategory(category)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                Edit
                                </button>
                                </td>
                                <td align="center">
                                <button className="bg-red-500" onClick={() => deleteCategory(category)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Delete
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-3 text-center ml-[-4px]">
                <ReactPaginate
                    marginPagesDisplayed={3}
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="Previous"
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
            </div>
            )}
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}></Categories>
))