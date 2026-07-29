import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";


export async function requireAuth(){

  const cookieStore = await cookies();


  const token = cookieStore.get("token")?.value;


  console.log("TOKEN:", token);



  if(!token){

    throw new Error("Unauthorized");

  }



  return verifyToken(token);

}



export function requireRole(
  user:{role:Role},
  allowedRoles:Role[]
){

  if(!allowedRoles.includes(user.role)){

    throw new Error("Forbidden");

  }

}