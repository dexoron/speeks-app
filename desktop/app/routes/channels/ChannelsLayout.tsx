import { Outlet } from "react-router";

export default function ChannelsLayout() {
  return (
    <>
        <h1>Чаты</h1>
        <Outlet />    
    </>
);
}