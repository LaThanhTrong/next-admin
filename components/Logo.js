import Link from "next/link"
export default function Logo(){
    return(
        <Link href={'/'}>
            <img className="w-[200px] h-auto" src="/images/template/logo.png"></img>
        </Link>
    )
}