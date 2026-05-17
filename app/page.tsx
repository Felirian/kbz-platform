'use client'

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push("/wiki/company");
  }, []);

  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <h1>Подождите чуть чуть и вас перекинет на платформу</h1>
    </div>
  );
}
