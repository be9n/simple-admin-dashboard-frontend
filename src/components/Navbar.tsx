import { useAuth } from "@/contexts/AuthContext";
import DarkModeSwitch from "./DarkModeSwitch";
import { Bell, Search } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="sticky top-0 h-[60px] py-3 px-8 bg-white dark:bg-secondary-600 transition-colors duration-200 flex items-center justify-between z-50">
      <div className="">
        <form className="hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-80 pe-9 bg-neutral-200 dark:bg-secondary-500 dark:placeholder:text-neutral-300 dark:text-neutral-300  rounded-md py-1 px-2 outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 end-2 size-7 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <Search className="size-4 text-neutral-400 dark:text-neutral-300" />
            </Button>
          </div>
        </form>
      </div>
      <div className="flex gap-5 items-center">
        <Button size="sm" className="text-sm p-3" onClick={() => logout()}>
          Logout
        </Button>
        <DarkModeSwitch className="cursor-pointer" />
        <div className="p-1.5 border border-neutral-500 rounded-full dark:border-white">
          <Bell className="size-4 text-neutral-500 dark:text-white" />
        </div>
        <div className="flex gap-3 items-center">
          <img
            className="size-10 rounded-full"
            src="https://images.unsplash.com/photo-1423479185712-25d4a4fe1006?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
