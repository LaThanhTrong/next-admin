import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { prettyDate } from "@/lib/date";
import Image from "next/image";
import ReactPaginate from "react-paginate";

function AdminsPage({swal}){
    const [email,setEmail] = useState('');
    const [adminEmails,setAdminEmails] = useState([]);
    const [allAdminEmails, setAllAdminEmails] = useState([]);
    const [searchGoogleAdmin, setSearchGoogleAdmin] = useState("");

    const [uemail,setUEmail] = useState('');
    const [userName,setUsername] = useState('');
    const [userPassword,setUserPassword] = useState('');
    const [uadminEmails,setUAdminEmails] = useState([]);
    const [allUAdminEmails, setAllUAdminEmails] = useState([]);
    const [searchUserAdmin, setSearchUserAdmin] = useState("");
    
    const [isLoading,setIsLoading] = useState(false);
    const [isULoading, setULoading] = useState(false);

    const itemsPerPage = 5

    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentGoogleItems = adminEmails.slice(itemOffset, endOffset);
    const pageGoogleCount = Math.ceil(adminEmails.length / itemsPerPage);

    const handlePageGoogleClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % adminEmails.length;
        setItemOffset(newOffset);
    };

    const [itemOffsetU, setItemOffsetU] = useState(0);
    const endOffsetU = itemOffsetU + itemsPerPage;
    const currentUserItems = uadminEmails.slice(itemOffsetU, endOffsetU);
    const pageUserCount = Math.ceil(uadminEmails.length / itemsPerPage);

    const handlePageUserClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % uadminEmails.length;
        setItemOffsetU(newOffset);
    };

    function addAdmin(ev){
        ev.preventDefault()
        axios.post('/api/admins',{email}).then(response => {
            swal.fire({
                title: 'Google Admin created!',
                icon: 'success',
            })
            setEmail('')
            loadAdmins()
        }).catch(err => {
            swal.fire({
                title: 'Error!',
                text: "There something wrong with Google Admin, try again later!",
                icon: 'error',
            });
        })
    }

    function addUadmin(ev){
        ev.preventDefault()
        axios.post('/api/uadmins',{uemail, userName, userPassword}).then(response => {
            swal.fire({
                title: 'User Admin created!',
                icon: 'success',
            })
            setUEmail('')
            setUsername('')
            setUserPassword('')
            loadUAdmins()
        }).catch(err => {
            swal.fire({
                title: 'Error!',
                text: "There something wrong with User Admin, try again later!",
                icon: 'error',
            })
        })
    }

    function deleteAdmin(_id, email) {
        swal.fire({
          title: 'Are you sure?',
          text: `Do you want to delete Google Admin ${email}?`,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Yes, Delete!',
          confirmButtonColor: '#d55',
          reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                axios.delete('/api/admins?_id='+_id).then(() => {
                    swal.fire({
                        title: 'Google Admin deleted!',
                        icon: 'success',
                    });
                    loadAdmins();
                });
            }
        });
    }

    function deleteUadmin(_id, uemail) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete User Admin ${uemail}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                axios.delete('/api/uadmins?_id='+_id).then(() => {
                    swal.fire({
                        title: 'User Admin deleted!',
                        icon: 'success',
                    });
                    loadUAdmins();
                })
            }
        })
    }

    function loadAdmins(){
        setIsLoading(true);
        axios.get('/api/admins').then(res => {
            setAllAdminEmails(res.data);
            setAdminEmails(res.data);
            setIsLoading(false);
        });
    }

    function loadUAdmins(){
        setULoading(true)
        axios.get('api/uadmins').then(res => {
            setAllUAdminEmails(res.data);
            setUAdminEmails(res.data);
            setULoading(false)
        })
    }

    useEffect(() => {
        loadAdmins();
        loadUAdmins();
      }, []);

    useEffect(() => {
        setAdminEmails(allAdminEmails.filter(email => email.email.toLowerCase().includes(searchGoogleAdmin.toLowerCase())))
    }, [searchGoogleAdmin])

    useEffect(() => {
        setUAdminEmails(allUAdminEmails.filter(email => email.email.toLowerCase().includes(searchUserAdmin.toLowerCase())))
    }, [searchUserAdmin])

    return(
        <Layout>
            <h1 className="text-4xl font-bold mb-3">Admins</h1>
            <div className="flex justify-between border-2 border-[#4b5563] px-8 py-5 rounded-md mb-4">
                <div>
                    <h2 className="font-bold text-xl mb-2">Add new google admin</h2>
                    <form onSubmit={addAdmin}>
                        <div className="flex gap-2">
                            <input type="text" className="w-[300px] py-2 px-3 rounded-lg bg-inherit border-2 outline-none border-[#4b5563] focus:border-[#4f46e5]" value={email} onChange={ev => setEmail(ev.target.value)} placeholder="Google Email" />
                            <button type="submit" className="bg-white text-black py-1 px-2 whitespace-nowrap flex items-center gap-1 rounded-md">Add Google Admin <Image src={'/images/template/google.png'} width={22} height={22} alt="Google"></Image></button>
                        </div>
                    </form>
                </div>
                <div>
                    <h2 className="font-bold text-xl mb-2">Add new user admin</h2>
                    <form className="mb-5" onSubmit={addUadmin}>
                        <div className="">
                            <input type="text" className="mb-3 w-[338px] dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" value={uemail} onChange={ev => setUEmail(ev.target.value)} placeholder="User Email" /><br />
                            <input type="text" className="mb-3 w-[338px] dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" value={userName} onChange={ev => setUsername(ev.target.value)} placeholder="User Name" /><br />
                            <input type="password" className="w-[338px] dark:bg-[#1f2938] border-2 border-[#d1d5db] dark:border-[#4b5563] focus:border-[#FFA07A] dark:focus:border-[#536ced] focus:outline-none p-2 rounded-md" value={userPassword} onChange={ev => setUserPassword(ev.target.value)} placeholder="User Password" /><br />
                            <button type="submit" className="bg-[#4f46e5] p-2 px-4 rounded-md text-white mt-3">Add User Admin</button>
                        </div>
                    </form>
                </div>
            </div>
    
            <div className="flex gap-3">
                <div className="border-2 border-[#4b5563] p-6 rounded-md">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="font-bold text-xl mb-2">Existing Google Admins</h2>
                        <input className="w-[300px] py-2 px-3 rounded-lg bg-inherit border-2 outline-none border-[#4b5563] focus:border-[#4f46e5]" type="text" onChange={ev => setSearchGoogleAdmin(ev.target.value)} placeholder="Search for Google Admins..."></input>
                    </div>
                    <table className="basic mb-5">
                        <colgroup>
                            <col style={{ width: '50px' }} />
                            <col style={{ width: '50px' }} />
                            <col style={{ width: '20px' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-left">Admin google email</th>
                                <th className="text-left">Date created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={2}>
                                        <div className="py-4"><Spinner fullWidth={true} /></div>
                                    </td>
                                </tr>
                            )}
                            {currentGoogleItems.length > 0 && currentGoogleItems.map(adminEmail => (
                                <tr key={adminEmail.email}>
                                    <td>{adminEmail.email}</td>
                                    <td>{adminEmail.createdAt && prettyDate(adminEmail.createdAt)}</td>
                                    <td>
                                        <button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} className="bg-rose-500">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <ReactPaginate
                        marginPagesDisplayed={3}
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageGoogleClick}
                        pageRangeDisplayed={3}
                        pageCount={pageGoogleCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        containerClassName={'pagination flex'}
                        activeLinkClassName={'active'}
                        />
                </div>

                <div className="border-2 border-[#4b5563] p-6 rounded-md">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="font-bold text-xl mb-2">Existing User Admins</h2>
                        <input className="w-[300px] py-2 px-3 rounded-lg bg-inherit border-2 outline-none border-[#4b5563] focus:border-[#4f46e5]" type="text" onChange={ev => setSearchUserAdmin(ev.target.value)} placeholder="Search for User Admins..."></input>
                    </div>
                    <table className="basic mb-5">
                        <colgroup>
                            <col style={{ width: '50px' }} />
                            <col style={{ width: '50px' }} />
                            <col style={{ width: '20px' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-left">Admin user email</th>
                                <th className="text-left">Date created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isULoading && (
                                <tr>
                                    <td colSpan={2}>
                                        <div className="py-4"><Spinner fullWidth={true} /></div>
                                    </td>
                                </tr>
                            )}
                            {currentUserItems.length > 0 && currentUserItems.map(uadminEmail => (
                                <tr key={uadminEmail.email}>
                                    <td>{uadminEmail.email}</td>
                                    <td>{uadminEmail.createdAt && prettyDate(uadminEmail.createdAt)}</td>
                                    <td>
                                        <button onClick={() => deleteUadmin(uadminEmail._id, uadminEmail.email)} className="bg-rose-500">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <ReactPaginate
                            marginPagesDisplayed={3}
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageUserClick}
                            pageRangeDisplayed={3}
                            pageCount={pageUserCount}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            containerClassName={'pagination flex'}
                            activeLinkClassName={'active'}
                            />
                </div>
            </div>
        </Layout>
    )
}

export default withSwal(({swal}) => (
    <AdminsPage swal={swal} />
));