import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { checkUser } from '@/lib/checkUser';

const Header = async() => {
  await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-transparent backdrop-blur-md z-50">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo with Sign-In Below */}
        <div className="flex flex-col items-center">
          <Link href="/">
            <Image 
              src="/PathVise Logo.png" 
              alt="Logo" 
              width={250} 
              height={75} 
              className="h-16 w-auto object-contain"
              unoptimized
            />
          </Link>

          
        </div>

        {/* Right Side: Industry Insights & Growth Tools */}
        <div className="flex items-center gap-4">
          {/* Industry Insights beside Growth Tools */}
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5"/>
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button> 
                <StarsIcon className="h-5 w-5"/>
                <span className="hidden md:block">Growth Tools</span>
                <ChevronDown className="h-5 w-5"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={"/resume"} className="flex items-center gap-2">
                  <FileText className="h-5 w-5"/>
                  <span>Build Resume</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                  <PenBox className="h-5 w-5"/>
                  Cover Letter
                </Link>
                
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/interview"} className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5"/>
                  Interview Prep
                </Link>

              </DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </SignedIn>
          <SignedOut>
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="outline">Sign Up</Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton 
                appearance={{
                  elements:{
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard:"shadow-xl",
                    userPreviewMainIdentifier:"font-semibold",
                  },
                }}
                afterSignOutUrl="/"
               />
            </SignedIn>

         
        </div>

      </nav>
    </header>
  )
}

export default Header;
