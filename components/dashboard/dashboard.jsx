import React from "react";
import { InputBox } from "../inputbox";
// This is a placeholder dashboard component. You can replace the Input Box with your actual dashboard content.
export const Dashboard = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="
      bg-slate-300
      h-80
      w-80
      flex
      justify-center
      items-center
      rounded-lg
      shadow-lg
      "
      >
        <InputBox />
      </div>
    </div>
  );
};
