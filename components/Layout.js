import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import Logo from "./Logo"
import Head from "next/head"
import styles from "../styles/Form.module.css"
import Image from "next/image"
import { useFormik } from "formik"
import Validate from "@/lib/validate"

export default function Layout({children}) {
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()
  const [show, setShow] = useState(false)
  const formik = useFormik({
    initialValues:{
      email: '',
      password: '',
    },
    validate: Validate,
    onSubmit
  })

  async function onSubmit(values){
    const status = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    }).then((response) => {
        
    }).catch((error) => {
        console.log(error);
    });
  }
  
  if(session){
    return (
      <div className="bg-[#FFA07A] dark:bg-[#1f2938] min-h-screen">
        <div className="flex items-center z-10 sticky top-0 px-8 py-3 bg-[#f79f7a] dark:bg-[#111827] md:hidden">
          <button onClick={() => setShowNav(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="flex min-h-screen">
          <Nav show={showNav}></Nav>
          <div className={(showNav?'disabled':'') +" bg-[#fff9f6] flex-grow p-8 dark:bg-[#1f2938]"}>{children}</div>
        </div>
      </div>
    )
  }
  return (
    // <div className={'bg-[#fff9f6] w-screen h-screen flex items-center'}>
    //     <div className="text-center w-full">
    //       <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
    //     </div>
    // </div>
    <div className="flex h-screen bg-[#ffb090]">
      <div className="m-auto bg-slate-50 rounded-md w-[900px] h-auto grid lg:grid-cols-2">
        <div>
          <img className="h-full w-full" src="images/template/login.jpg"></img>
        </div>
        <div className="right flex flex-col justify-evenly">
          <div className="text-center py-10">
            <Head><title>Login</title></Head>
            <div className="w-3/4 mx-auto flex flex-col gap-10">
              <div>
                <h1 className="text-gray-800 text-4xl font-bold py-4">Login</h1>
              </div>

              <div>
                <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
                  <div className={`${styles.input_group}${formik.errors.email && formik.touched.email ? ' border-rose-600' : ''}`}>
                    <input className={styles.input_text} type="email" name="email" placeholder="Email" {...formik.getFieldProps('email')}></input>
                  </div>
                  {formik.errors.email && formik.touched.email ? <span className="text-rose-500">{formik.errors.email}</span> : <></>}
                  <div className={`${styles.input_group}${formik.errors.password && formik.touched.password ? ' border-rose-600' : ''}`}>
                    <input className={styles.input_text} type={`${show ? "text" : "password"}`} name="password" placeholder="Password" {...formik.getFieldProps('password')}></input>
                    <span className="px-3 cursor-pointer" onClick={() => setShow(!show)}>Show</span>
                  </div>
                  {formik.errors.password && formik.touched.password ? <span className="text-rose-500">{formik.errors.password}</span> : <></>}
                  <div className="input-button">
                    <button className={styles.button} type="submit">Login</button>
                  </div>
                  <div className="input-button">
                    <button onClick={() => signIn('google')} className={styles.button_custom} type="button">Login with Google <Image src={'/images/template/google.png'} width={20} height={20} alt="Google"></Image></button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
