import { NextRequest, NextResponse } from "next/server";


export function middleware(request: NextRequest) {


  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;



  // Public pages (no login required)

  const publicRoutes = [

    "/login",

    "/register",

    "/api/auth/login",

    "/api/auth/register",

    "/api/auth/logout",

  ];



  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );




  // Allow public routes

  if (isPublicRoute) {

    return NextResponse.next();

  }




  // Protect everything else

  if (!token) {


    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )

    );

  }



  return NextResponse.next();


}





export const config = {

  matcher: [

    "/((?!_next/static|_next/image|favicon.ico).*)",

  ],

};