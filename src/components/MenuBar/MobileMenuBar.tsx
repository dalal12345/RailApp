import ThemeToggleButton from "@/ui/ThemeToggleButton";
import { Menu } from "lucide-react";

export default function MobileMenuBar(){
    return(<div className="grid grid-cols-2 p-2 bg-[#191f1f] dark:bg-zinc-900 dark:bg-transparent dark:text-white content-center items-center h-15 mt-0">
        <Menu className="text-white cursor-pointer"/>
        <ThemeToggleButton/>
    </div>)
}