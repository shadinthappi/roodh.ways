import React from "react";
import PassportKitClient from "./PassportKitClient";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Roodh Explorers Kit™ | Roodh.ways",
  description: "More than just a travel essentials kit. A complete travel experience designed to accompany you throughout your journey.",
};

export default function PassportKitPage() {
  return <PassportKitClient footer={<Footer />} />;
}
