import React, { useEffect, useState } from "react";
import { StakingTopBar } from "components/Staking/common/TopBar";
import OfferTable from "components/Staking/Home/OfferTable";
import FaqStaking from "components/Staking/Home/FaqStaking";
import Footer from "components/common/footer";
import { getOfferListAction } from "state/actions/staking";
import { GetServerSideProps } from "next";
import { LandingDetailsStaking } from "service/staking";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import StakingHeader from "components/Staking/StakingHeader";

const Index = ({ data }: any) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  return (
    <>
      <div className="mb-5">
        <StakingHeader
          title={data?.staking_landing_title}
          description={data?.staking_landing_description}
        />

        <OfferTable isLoggedIn={isLoggedIn} />
        <FaqStaking faq_list={data?.faq_list} />
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const response = await LandingDetailsStaking();

  if (!response?.success) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const { data } = response;

  return {
    props: {
      data: data,
    },
  };
};
export default Index;
