"use client";

import { Logos } from "@/components/logos";
import Image from "next/image";
import { IoLogoInstagram } from "react-icons/io";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { useHome } from "@/hooks/Home/useHome";

export default function Dashboards() {
  const { errors, handleLogin, handleSubmit, isLoading, register } = useHome();

  return (
    <div className="flex flex-col justify-between w-full h-screen bg-[#600000]">
      <header className="bg-[#202124] py-[16px] px-[96px]">
        <Image
          src={Logos.logo_atos_branca}
          width={160}
          height={44}
          alt="Logo da ATOS"
        />
      </header>

      <main className="flex w-full justify-center items-center px-4">
        <p className="text-white text-[40px]">DASHBOARDS</p>
      </main>

      <footer className="w-full flex justify-between bg-[#4D0303] py-[24px] px-[96px]">
        <div className="flex gap-5">
          <a href="">
            <IoLogoInstagram className="text-white h-[30px] w-[30px]" />
          </a>
          <a href="">
            <FaFacebookSquare className="text-white h-[30px] w-[30px]" />
          </a>
          <a href="">
            <FaLinkedin className="text-white h-[30px] w-[30px]" />
          </a>
        </div>
      </footer>
    </div>
  );
}
