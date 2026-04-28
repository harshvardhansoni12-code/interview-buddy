import { Logo } from "../logo";
import { UserButton } from "../userbutton";
export const Navbar = () => {
  return (
    <div className="h-20 w-screen flex justify-between items-center bg-rose-200">
      <div>
        <Logo />
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
};
