import type { GetServerSideProps, NextPage } from "next";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import {
  SignupAction,
  SocialSigninAction,
  useCapchaInitialize,
  GetUserInfoByTokenAction,
} from "state/actions/user";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useRouter } from "next/router";
import { authPageRequireCheck } from "middlewares/ssr-authentication-check";
//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import useTranslation from "next-translate/useTranslation";
import { RootState } from "state/store";

//@ts-ignore
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import {
  LOGIN_WITH_APPLE,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE,
} from "helpers/core-constants";
import { FaApple, FaFacebook, FaFacebookF } from "react-icons/fa";

//@ts-ignore
import AppleSignin from "react-apple-signin-auth";

//@ts-ignore
import FacebookLogin from "react-facebook-login";

import {
  CAPTCHA_TYPE_GEETESTCAPTCHA,
  CAPTCHA_TYPE_RECAPTCHA,
} from "helpers/core-constants";

const Signup: NextPage = () => {
  const { logo } = useSelector((state: RootState) => state.user);
  const { settings } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch();
  const { geeTest, captchaData } = useCapchaInitialize();

  const { t } = useTranslation("common");
  const router = useRouter();

  const { ref_code } = router.query;
  const [processing, setProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm_password: false,
  });

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

  return (
    <div className="login_reg_box">
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
            <Link href="/signin">
              <p className="authentication-page-text-color h5">
                {t("Already have an account")} ?{" "}
                <a className="text-theme" href="">
                  {" "}
                  {t("Sign In")}
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
            <div className="user-form border-0 my-5 my-md-0 backdrop-filter-none">
              <div className="user-form-inner">
                <div className="form-top text-left">
                  <h2>{t("Sign Up")}</h2>
                  <p>{t("Create a new account")}.</p>
                </div>
                <Formik
                  initialValues={{
                    email: "",
                    first_name: "",
                    last_name: "",
                    password: "",
                    password_confirmation: "",
                    phone: "",
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
                    first_name: Yup.string()
                      .min(2)
                      .required(t("First name is required")),
                    last_name: Yup.string()
                      .min(2)
                      .required(t("Last name is required")),
                    password: Yup.string()
                      .min(8)
                      .required(t("Password is required")),
                    password_confirmation: Yup.string()
                      .oneOf(
                        [Yup.ref("password"), null],
                        t("Passwords must match")
                      )
                      .required("Confirm password is required"),
                    recapcha: Yup.string()
                      .min(6)
                      .required(t("Recapcha is required")),
                  })}
                  onSubmit={async (values) => {
                    let newValues: any = {
                      email: values.email,
                      first_name: values.first_name,
                      last_name: values.last_name,
                      password: values.password,
                      password_confirmation: values.password_confirmation,
                      recapcha: values.recapcha,
                    };

                    if (values.phone) {
                      newValues = {
                        ...newValues,
                        phone: values.phone,
                      };
                    }

                    if (
                      parseInt(captchaData?.select_captcha_type) ===
                      CAPTCHA_TYPE_GEETESTCAPTCHA
                    ) {
                      geeTest.showCaptcha();
                      geeTest.onSuccess(async () => {
                        var result = geeTest.getValidate();
                        let local_value: any = newValues;
                        local_value.lot_number = result.lot_number;
                        local_value.captcha_output = result.captcha_output;
                        local_value.pass_token = result.pass_token;
                        local_value.gen_time = result.gen_time;
                        dispatch(
                          SignupAction(local_value, setProcessing, ref_code)
                        );
                      });
                    } else {
                      dispatch(
                        SignupAction(newValues, setProcessing, ref_code)
                      );
                    }
                  }}
                >
                  {({ errors, touched, setFieldValue }) => (
                    <Form>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="first_name"
                          id="first_name"
                          className={`form-control ${
                            touched.first_name && errors.first_name
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder={t("Your first name here")}
                        />
                        {touched.first_name && errors.first_name && (
                          <div className="invalid-feedback">
                            {errors.first_name}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <Field
                          type="text"
                          name="last_name"
                          id="last_name"
                          className={`form-control ${
                            touched.last_name && errors.last_name
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder={t("Your last name here")}
                        />
                        {touched.last_name && errors.last_name && (
                          <div className="invalid-feedback">
                            {errors.last_name}
                          </div>
                        )}
                      </div>

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
                        {touched.email && errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <PhoneInput
                          country={"us"}
                          inputStyle={{ paddingLeft: 50 }}
                          inputClass="phone-input-cls"
                          // value={user?.phone}
                          onChange={(phone: any) => {
                            setFieldValue("phone", phone);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <div>
                          <Field
                            type={showPassword.password ? "text" : "password"}
                            name="password"
                            id="password"
                            className={`form-control form-control-password look-pass ${
                              touched.password && errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder={t("Your password here")}
                          />

                          {touched.password && errors.password && (
                            <div className="invalid-feedback">
                              {errors.password}
                            </div>
                          )}
                        </div>
                        <span
                          className={`eye rev ${
                            touched.password && errors.password
                              ? "top-35-p"
                              : "top-50-p"
                          }`}
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              password: !showPassword.password,
                            })
                          }
                        >
                          <i className="fa fa-eye-slash toggle-password"></i>
                        </span>
                      </div>

                      <div className="form-group">
                        <Field
                          type={
                            showPassword.confirm_password ? "text" : "password"
                          }
                          name="password_confirmation"
                          id="password_confirmation"
                          className={`form-control form-control-password look-pass ${
                            touched.password_confirmation &&
                            errors.password_confirmation
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder={t("Your password here")}
                        />

                        {touched.password_confirmation &&
                          errors.password_confirmation && (
                            <div className="invalid-feedback">
                              {errors.password_confirmation}
                            </div>
                          )}

                        <span
                          className={`eye rev ${
                            touched.password_confirmation &&
                            errors.password_confirmation
                              ? "top-35-p"
                              : "top-50-p"
                          }`}
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              confirm_password: !showPassword.confirm_password,
                            })
                          }
                        >
                          <i className="fa fa-eye-slash toggle-password"></i>
                        </span>
                      </div>

                      <div className="form-group">
                        <label></label>
                        <p className="invalid-feedback">{t("Message")} </p>
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
                        onClick={() => resetCaptcha()}
                        type="submit"
                        disabled={processing}
                        className="btn nimmu-user-sibmit-button mt-3"
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
                          t("Sign Up")
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
                                access_token: response?.authorization?.id_token,
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
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await authPageRequireCheck(ctx);
  return {
    props: {},
  };
};

export default Signup;
