"use client";
import { useEffect, useState } from "react";

import Chat from './chat';
export const runtime = 'edge';
export default function Home() {



  return (
    <div className="w-screen h-screen">
  

      <Chat />

    
    </div>
  );
}
