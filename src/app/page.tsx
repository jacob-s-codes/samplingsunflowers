import Image from "next/image";
import Table from "./Components/Table";
import SRS from "./Components/SRS";

export default function Home() {
  return (
    <div className="w-full">
      <SRS/>
      <Table/>
    </div>
  );
}
