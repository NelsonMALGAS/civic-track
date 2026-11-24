// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

const Home = async () => {

  // const { success } = await auth.api.userHasPermission({
  //   headers: await headers(),
  //   body: {
  //     permissions: { project: ["delete"] },
  //   },
  // });
  // console.log("HAS_PERMISSION", success)

  return (
    <div className="bg-background">Home</div>
  )
}

export default Home