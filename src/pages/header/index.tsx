import bgImage from "@/assets/images/banner_bg.png";
import Zhuzhan from "@/assets/icon/zhuzhan.svg?react";
import Collect from "@/assets/icon/collect.svg?react";
import CreateCenter from "@/assets/icon/create-center.svg?react";
import History from "@/assets/icon/history.svg?react";
import Message from "@/assets/icon/message.svg?react";
import User from "@/assets/icon/user.svg?react";
import { Input } from "antd";
import type { GetProps } from "antd";
import HeaderUploadButton from "../../component/headerUploadButton";
import LoginModal from "./login-modal";
import { useState } from "react";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);
export default function LayoutHeader() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  return (
    <div className="w-full h-45" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="relative flex justify-between items-center py-1 px-4">
        <div className="flex items-center gap-2">
          <Zhuzhan className="w-6 h-6 text-white" />
          <span className="text-white cursor-pointer">首页</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-white">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 400 }}
          />
        </div>
        <div className="flex gap-5 text-white">
          <div onClick={() => {
            setIsLoginModalOpen(true)
          }} className="flex flex-col justify-center items-center cursor-pointer">
            <User className="w-[35px] h-[35px] rounded-full"></User>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <Collect></Collect>
            <span className="text-white text-[13px] ">消息</span>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <CreateCenter></CreateCenter>
            <span className="text-white text-[13px] ">收藏</span>

          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <History></History>
            <span className="text-white text-[13px] ">历史</span>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <Message></Message>
            <span className="text-white text-[13px] ">创作中心</span>
          </div>
          <div className="cursor-pointer">
            <HeaderUploadButton onClick={() => console.log("upload")} />
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onCancel={() => setIsLoginModalOpen(false)}></LoginModal>
    </div>
  );
}
