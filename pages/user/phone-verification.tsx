import type { GetServerSideProps, NextPage } from "next";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { RootState } from "state/store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import {
  SendPhoneVerificationSmsAction,
  VerifyPhoneAction,
} from "state/actions/user";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import ImageComponent from "components/common/ImageComponent";
import ProfileHeader from "components/profile/ProfileHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";

const PhoneVerification: NextPage = () => {
  const { t } = useTranslation("common");
  const { user } = useSelector((state: RootState) => state.user);
  const [ShowOtpSection, setShowOtpSection] = useState(false);
  const [isChangeNumber, setIsChangeNumber] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [verifyProcess, setVerifyProcess] = useState(false);
  const [otp, setOtp] = useState<number>(0);
  const sendCode = () => {
    SendPhoneVerificationSmsAction(setShowOtpSection, setProcessing);
  };
  const verifyCode = () => {
    VerifyPhoneAction(otp, setVerifyProcess, setShowOtpSection);
    setIsChangeNumber(false);
  };
  return (
    <>
      <div className="page-wrap">
        {/* <ProfileSidebar /> */}
        <div className="page-main-content bg-primary-custom-color">
          <ProfileHeader title={t("Phone Verification")} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="container-4xl">
            <div className="reset-password-area body-margin-top-custom shadow-sm section-padding-custom wallet-card-info-container">
              <div className="section-wrapper">
                <div className="row">
                  <div className="col-lg-6 col-md-8 d-flex align-items-center">
                    {user?.phone_verified == 1 && !isChangeNumber ? (
                      <div className="w-full">
                        <div className="border px-3 w-full d-flex flex-column justify-content-center align-items-center rounded-10 gap-10 min-h-200">
                          <FaCheckCircle color="green" size={60} />
                          <h3 className="text-center">
                            {t("Your Phone number has been verified.")}
                          </h3>
                          <p className="cursor-pointer">
                            <span
                              className="text-blue text-underline"
                              onClick={() => setIsChangeNumber(true)}
                            >{`Click here `}</span>
                            {t("to change the Phone number.")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="user-profile-form w-full">
                        <div className="form-group">
                          <label htmlFor="number">{t("Phone number")}</label>
                          {user?.phone ? (
                            <div className="code-list">
                              <input
                                type="text"
                                value={user?.phone}
                                className="form-control"
                                disabled
                              />
                              <button
                                className="btn profile-edit-btn phn-verify-btn"
                                onClick={sendCode}
                              >
                                {processing ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm mr-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    <span>{t("Please wait")}</span>
                                  </>
                                ) : ShowOtpSection ? (
                                  t("Resend SMS")
                                ) : (
                                  t("Send SMS")
                                )}
                              </button>
                              {ShowOtpSection && (
                                <p>
                                  {t(
                                    "If you did not receive the code, click the Resend SMS button."
                                  )}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="code-list">
                              <p>
                                {t("Please add your mobile number first from ")}
                                <Link href="/user/edit-profile">
                                  {t("edit profile")}
                                </Link>
                              </p>
                            </div>
                          )}
                        </div>

                        {ShowOtpSection && (
                          <div className="form-group">
                            <label htmlFor="number">{t("Verify Code")}</label>
                            <div className="code-list">
                              <input
                                type="text"
                                className="form-control"
                                id=""
                                onChange={(event) => {
                                  setOtp(parseInt(event.target.value));
                                }}
                              />
                              <button
                                type="submit"
                                className="btn profile-edit-btn phn-verify-btn"
                                onClick={verifyCode}
                              >
                                {verifyProcess ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm mr-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    <span>{t("Please wait")}</span>
                                  </>
                                ) : (
                                  t("Verify")
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-4">
                    <div className="reset-password-right text-center">
                      {/* <img
                        src="/phone-verification.svg"
                        alt="phone-verification"
                      /> */}
                      <ImageComponent
                        src="/phone-verification.svg"
                        alt="phone-verification"
                        height={280}
                        objectFit="inherit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/phone-verification");
  return {
    props: {},
  };
};

export default PhoneVerification;
