import React from "react";
import Hero from "@/components/home/Hero";
import ServiceGrid from "@/components/home/ServiceGrid";
import Specialists from "@/components/home/Specialists";
import Astrologers from "@/components/home/Astrologers";
import QuickTools from "@/components/home/QuickTools";
import CtaBanner from "@/components/home/CtaBanner";

export default function Home() {
    return (
        <>
            <Hero />
            <ServiceGrid />
            <Specialists />
            <Astrologers />
            <QuickTools />
            <CtaBanner />
        </>
    );
}
