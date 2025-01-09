import type { GetServerSideProps, NextPage } from "next";
import * as Yup from "yup";
import {
  GetUserInfoByTokenAction,
  SigninAction,
  SocialSigninAction,
  useCapchaInitialize,
} from "state/actions/user";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";

import AppleSignin from "react-apple-signin-auth";
//@ts-ignore
import FacebookLogin from "react-facebook-login";
import Link from "next/link";
import { authPageRequireCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import { destroyCookie } from "nookies";
import { RootState } from "state/store";
import {
  CAPTCHA_TYPE_GEETESTCAPTCHA,
  CAPTCHA_TYPE_RECAPTCHA,
  LOGIN_WITH_APPLE,
  LOGIN_WITH_FACEBOOK,
} from "helpers/core-constants";
import { socialSigninApi } from "service/user";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { LOGIN_WITH_GOOGLE } from "helpers/core-constants";
import { FaApple, FaFacebook, FaFacebookF } from "react-icons/fa";

const Signin: NextPage = () => {
  const { settings } = useSelector((state: RootState) => state.common);
  const { geeTest, captchaData } = useCapchaInitialize();
  const { t } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState<any>(false);
  const dispatch = useDispatch();

  let captcha: any;
  const setCaptchaRef = (ref: any) => {
    if (ref) {
      return (captcha = ref);
    }
  };
  const resetCaptcha = () => {
    captcha?.reset();
  };

  const responseFacebook = async (response: any) => {
    if (!response || response.status == "unknown") {
      return;
    }
    if (!response?.accessToken) {
      toast.error(`Invalid access token`);
      return;
    }
    const data = {
      login_type: LOGIN_WITH_FACEBOOK,
      access_token: response?.accessToken,
    };
    const res: any = await dispatch(SocialSigninAction(data, setProcessing));

    if (!res?.success) {
      resetCaptcha();
    }
    await dispatch(GetUserInfoByTokenAction());
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      toast.error(`Invalid access token`);
      return;
    }

    const data = {
      login_type: LOGIN_WITH_GOOGLE,
      access_token: credentialResponse?.credential,
    };
    const res: any = await dispatch(SocialSigninAction(data, setProcessing));

    if (!res?.success) {
      resetCaptcha();
    }
    await dispatch(GetUserInfoByTokenAction());
  };

  const authHandler = (err: any, data: any) => {
    try {
      console.log("data", err, data);
    } catch (error) {
      console.log("authHandler", error);
    }
  };

  return (
    <>
      <div className="d-md-flex d-block">
        <div
          className="col-md-5 login_bg_new"
          style={{
            backgroundImage: `url(${settings.login_background})`,
          }}
        >
          <div className="user-content-text text-center text-md-left">
            <Link href="/">
              <a className="auth-logo" href="">
                <img
                  width="65%"
                  src={settings.logo || ""}
                  className="pt-5 pt-md-4"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="d-md-flex d-block align-items-center justify-content-center h-75">
            <div className="text-center text-md-left">
              <h1 className="authentication-page-text-color">
                {t("Welcome To")} {settings.app_title}
              </h1>
              <Link href="/signup">
                <p className="authentication-page-text-color h5 mt-2">
                  {t("Don’t have an account ? ")}
                  <a className="text-theme" href="">
                    {t(" Sign Up ")}
                  </a>
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-7 d-flex align-items-center login_from_res">
          <div className="row w-100 mx-auto">
            <div className="col-lg-8 col-md-12 mx-md-auto">
              <div className="user-content-text text-left d-block d-md-none">
                <Link href="/">
                  <a className="auth-logo" href="">
                    <img
                      width="60%"
                      src={settings.logo || ""}
                      className="pt-5 pt-md-4"
                      alt=""
                    />
                  </a>
                </Link>
              </div>
              <div className="user-form border-0 my-4 my-md-0 backdrop-filter-none">
                <div className="user-form-inner">
                  <div className="form-top text-left">
                    <h2>{t("Sign In")}</h2>
                    <p>{t("Please Sign In To Your Account")}</p>
                  </div>
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                      recapcha:
                        parseInt(captchaData?.select_captcha_type) !==
                        CAPTCHA_TYPE_RECAPTCHA
                          ? "ksmaldkmalksmdlkamsdlk"
                          : "",
                    }}
                    validationSchema={Yup.object({
                      email: Yup.string()
                        .email(t("Invalid email address"))
                        .required(t("Email is required")),
                      password: Yup.string()
                        .min(6)
                        .required(t("Password is required")),
                      recapcha: Yup.string()
                        .min(6)
                        .required(t("Recapcha is required")),
                    })}
                    onSubmit={async (values) => {
                      if (
                        parseInt(captchaData?.select_captcha_type) ===
                        CAPTCHA_TYPE_GEETESTCAPTCHA
                      ) {
                        geeTest.showCaptcha();
                        geeTest.onSuccess(async () => {
                          var result = geeTest.getValidate();
                          let local_value: any = values;
                          local_value.lot_number = result.lot_number;
                          local_value.captcha_output = result.captcha_output;
                          local_value.pass_token = result.pass_token;
                          local_value.gen_time = result.gen_time;
                          await dispatch(
                            SigninAction(local_value, setProcessing)
                          );
                          await dispatch(GetUserInfoByTokenAction());
                        });
                      } else {
                        const response: any = await dispatch(
                          SigninAction(values, setProcessing)
                        );
                        if (!response?.success) {
                          resetCaptcha();
                        }
                        await dispatch(GetUserInfoByTokenAction());
                      }
                    }}
                  >
                    {({ errors, touched, setFieldValue }) => (
                      //@ts-ignore
                      <Form>
                        <div className="form-group">
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className={`form-control ${
                              touched.email && errors.email ? "is-invalid" : ""
                            }`}
                            placeholder={t("Your email here")}
                          />
                        </div>

                        <div className="form-group my-4">
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            className={`form-control form-control-password look-pass ${
                              touched.password && errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder={t("Your password here")}
                          />

                          <span
                            className="eye rev"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <i className="fa fa-eye toggle-password"></i>
                            ) : (
                              <i className="fa fa-eye-slash toggle-password"></i>
                            )}
                          </span>
                        </div>

                        <div className="form-group">
                          <p className="invalid-feedback">{t("Message")}</p>
                        </div>
                        <div className="d-flex justify-content-between rememberme align-items-center mb-4">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input ml-1"
                              id="exampleCheck1"
                            />
                            <label className="form-check-label ml-2">
                              {t("Remember me")}
                            </label>
                          </div>
                          <div className="text-right">
                            <Link href="/forgot-password">
                              <a className="text-theme forgot-password">
                                {t("Forgot Password?")}
                              </a>
                            </Link>
                          </div>
                        </div>
                        {captchaData?.NOCAPTCHA_SITEKEY &&
                          parseInt(captchaData?.select_captcha_type) ===
                            CAPTCHA_TYPE_RECAPTCHA && (
                            <ReCAPTCHA
                              ref={(r: any) => setCaptchaRef(r)}
                              sitekey={captchaData?.NOCAPTCHA_SITEKEY}
                              render="explicit"
                              onChange={(response: any) => {
                                setFieldValue("recapcha", response);
                              }}
                            />
                          )}

                        <button
                          // onClick={() => resetCaptcha()}
                          type="submit"
                          disabled={processing}
                          className="btn nimmu-user-sibmit-button mt-4"
                        >
                          {processing ? (
                            <>
                              <span
                                className="spinner-border spinner-border-md"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              <span>{t("Please wait")}</span>
                            </>
                          ) : (
                            t("Sign In")
                          )}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  {(settings.social_login_google_enable == 1 ||
                    settings.social_login_facebook_enable == 1 ||
                    settings.social_login_apple_enable == 1) &&
                    settings.social_login_enable && (
                      <div className="mt-5">
                        <p className="text-center text-16">Or continue with</p>

                        <div className="mt-3 d-flex justify-content-center align-items-center gap-10">
                          {settings.social_login_google_enable == 1 && (
                            <GoogleLogin
                              onSuccess={(credentialResponse: any) => {
                                handleGoogleLogin(credentialResponse);
                              }}
                              type="icon"
                              shape="circle"
                              size="large"
                              theme="filled_black"
                              onError={() => {
                                console.log("Login Failed");
                              }}
                              useOneTap
                            />
                          )}
                          {settings.social_login_facebook_enable == 1 && (
                            <FacebookLogin
                              appId={`${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
                              autoLoad={false}
                              fields="name,email,picture"
                              // onClick={componentClicked}
                              callback={responseFacebook}
                              icon={<FaFacebookF size={20} color="blue" />}
                              textButton={""}
                              cssClass={"facebook-button-cls"}
                            />
                          )}

                          {settings.social_login_apple_enable == 1 && (
                            <AppleSignin
                              authOptions={{
                                clientId: `${process.env.NEXT_PUBLIC_APPLE_CLIENT_ID}`,

                                scope: "name email",

                                redirectURI: `${
                                  settings.social_login_apple_redirect_url ||
                                  process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI
                                }`,

                                state: "",

                                nonce: "nonce",

                                usePopup: true,
                              }} // REQUIRED
                              uiType="dark"
                              className="apple-auth-btn"
                              noDefaultStyle={false}
                              buttonExtraChildren="Continue with Apple"
                              onSuccess={async (response: any) => {
                                if (!response?.authorization?.id_token) {
                                  toast.error(`Invalid access token`);
                                  return;
                                }
                                const data = {
                                  login_type: LOGIN_WITH_APPLE,
                                  access_token:
                                    response?.authorization?.id_token,
                                };
                                const res: any = await dispatch(
                                  SocialSigninAction(data, setProcessing)
                                );

                                if (!res?.success) {
                                  resetCaptcha();
                                }
                                await dispatch(GetUserInfoByTokenAction());
                              }}
                              onError={(error: any) => setProcessing(false)}
                              skipScript={false}
                              render={(props: any) => (
                                <button {...props} className="apple-auth-btn">
                                  <FaApple size={26} />
                                </button>
                              )}
                            />
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    await authPageRequireCheck(ctx);
  } catch (error) {
    destroyCookie(ctx, "token");
  }
  return {
    props: {},
  };
};

export default Signin;
