// import { redirect } from "next/navigation"
// import { getServerSession } from "./server-actions"

const Home = async () => {

  // const session = await getServerSession()
  // const user = session?.user

  // if (!user) redirect("/auth")

  // console.log("USER", user)
  return (
    <div className="bg-background">Home</div>
  )
}

export default Home