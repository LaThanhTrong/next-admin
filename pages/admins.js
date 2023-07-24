import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { prettyDate } from "@/lib/date";

function AdminsPage({swal}){
    const [email,setEmail] = useState('');
    const [adminEmails,setAdminEmails] = useState([]);

    const [uemail,setUEmail] = useState('');
    const [userName,setUsername] = useState('');
    const [userPassword,setUserPassword] = useState('');
    const [uadminEmails,setUAdminEmails] = useState([]);
    
    const [isLoading,setIsLoading] = useState(false);
    const [isULoading, setULoading] = useState(false)
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
                text: err.response.data.message,
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
                text: err.response.data.message,
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
            setAdminEmails(res.data);
            setIsLoading(false);
        });
    }

    function loadUAdmins(){
        setULoading(true)
        axios.get('api/uadmins').then(res => {
            setUAdminEmails(res.data);
            setULoading(false)
        })
    }

    useEffect(() => {
        loadAdmins();
        loadUAdmins();
      }, []);

    return(
        <Layout>
            <h1 className="text-4xl font-bold mb-5">Admins</h1>
            <h2>Add new google admin</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input type="text" className="mb-0" value={email} onChange={ev => setEmail(ev.target.value)} placeholder="Google Email" />
                    <button type="submit" className="btn-primary py-1 whitespace-nowrap">Add google admin</button>
                </div>
            </form>

            <h2>Add new user admin</h2>
            <form onSubmit={addUadmin}>
                <div className="flex gap-2">
                    <input type="text" className="mb-0" value={uemail} onChange={ev => setUEmail(ev.target.value)} placeholder="User Email" />
                    <input type="text" className="mb-0" value={userName} onChange={ev => setUsername(ev.target.value)} placeholder="User name" />
                    <input type="text" className="mb-0" value={userPassword} onChange={ev => setUserPassword(ev.target.value)} placeholder="User password" />
                    <button type="submit" className="btn-primary py-1 whitespace-nowrap">Add user admin</button>
                </div>
            </form>

            <h2>Existing Google Admins</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Admin google email</th>
                        <th></th>
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
                    {adminEmails.length > 0 && adminEmails.map(adminEmail => (
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
            <br />
            <h2>Existing User Admins</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Admin user email</th>
                        <th></th>
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
                    {uadminEmails.length > 0 && uadminEmails.map(uadminEmail => (
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
        </Layout>
    )
}

export default withSwal(({swal}) => (
    <AdminsPage swal={swal} />
));