import { Button } from "@/components/ui/button"
import Link from "next/link"

const LandingPage = () =>{
    return(
        <div>
            <h1>Landing page Unprotected</h1>
            <Link href='/sign-in'>
                <Button>Sign in</Button>
            </Link>
            <Link href='/sign-up'>
                <Button>Sign up</Button>
            </Link>
        </div>
    )
}

export default LandingPage