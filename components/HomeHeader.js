import { useSession } from "next-auth/react"
export default function HomeHeader(){
    const { data: session } = useSession()
    return(
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">
          Dashboard
        </h2>
        <div>
          <div className="flex p-2 rounded-lg items-center gap-2 overflow-hidden">
            <p className="text-[#6b7280] text-[14px]">Welcome,<br /> <b className=" text-[#6b7280] dark:text-[#9ca3af] text-[16px]">{session?.user?.name}</b></p>
            {session?.user?.image &&(
              <img src={session?.user?.image} alt="" className="w-12 h-12 rounded-full" />
            )}
          </div>
        </div>
      </div>
    )
}