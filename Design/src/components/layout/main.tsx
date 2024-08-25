import Welcome from "../Welcome";
import Header from "./header";
import Sidebar from "./sidebar";
import "../styles/main.css";
import Directory from "../Directory";
import { useState } from "react";

export default function Main() {

  const [selectedPage,setSelectedPage] = useState("overview")

  return (
    <>
      <div className="header-top">
        <Header />
      </div>
      <div className="main-content">
        <Sidebar onselect={setSelectedPage}/>
        {selectedPage === "overview" && <Welcome />}
        {selectedPage === "peopleOverview" && <Directory />}
      </div>
    </>
  );
}
