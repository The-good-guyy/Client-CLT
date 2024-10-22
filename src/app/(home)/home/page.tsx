import React, { Suspense } from "react";
import { Stats } from "@/components/Stats";
import About from "@/components/About";
import AboutUs from "@/components/AboutUs";
import { HomeSlider } from "@/components/HomeSlider";
import HomePageLayout from "../HomePageLayout";
import { AnotherHomeCarousel } from "@/components/AnotherHomeCarousel";
import Loading from "@/components/Loading";
import UserInfo from "@/components/UserInfo";
const Home = () => {
  return (
    <Suspense fallback={<Loading />}>
      <HomePageLayout>
        <HomeSlider />
        <AnotherHomeCarousel />
        <Stats />
        <About />
        <UserInfo />
        <AboutUs />
      </HomePageLayout>
    </Suspense>
  );
};

export default Home;
