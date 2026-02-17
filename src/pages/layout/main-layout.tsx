import { Outlet } from "react-router-dom";
import LayoutHeader from "../header";

export default function MainLayout() {
  return (
    // main-container
    <div className="w-full min-w-312.5">
        <LayoutHeader></LayoutHeader>
        <Outlet>
        </Outlet>
    </div>
  );
}