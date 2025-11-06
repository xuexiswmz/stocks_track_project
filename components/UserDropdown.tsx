"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavItems from "@/components/NavItems";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.actions";

const UserDropdown = ({ user }: { user: User }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex item-center gap-3 text-gray-400 hover:text-yellow-500"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://avatars.githubusercontent.com/u/135586572?v=4&size=64" />
              <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="font-medium text-gray-400 text-base">
                {user.name}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-gray-400 bg-black">
          <DropdownMenuLabel>
            <div className="flex relative items-center gap-3 py-2 ">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://avatars.githubusercontent.com/u/135586572?v=4&size=64" />
                <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col ">
                <span className="font-medium text-gray-400 text-base">
                  {user.name}
                </span>
                <span className="text-gray-500 text-sm">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-600" />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-color cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
            Logout
          </DropdownMenuItem>
          <DropdownMenuSeparator className="sm:block hidden bg-gray-600" />
          <nav className="sm:hidden">
            <NavItems />
          </nav>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserDropdown;
