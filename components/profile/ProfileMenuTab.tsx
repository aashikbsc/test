import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const ProfileMenuTab = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className="container-4xl">
      <ul className="wallet-overview-tab-menu">
        <Link href="/user/profile">
          <li className={router.pathname == "/user/profile" ? "active" : ""}>
            <a href="/user/profile">{t("My Profile")}</a>
          </li>
        </Link>
        <Link href="/user/edit-profile">
          <li
            className={router.pathname == "/user/edit-profile" ? "active" : ""}
          >
            <a href="/user/edit-profile">{t("Edit Profile")}</a>
          </li>
        </Link>
        <Link href="/user/phone-verification">
          <li
            className={
              router.pathname == "/user/phone-verification" ? "active" : ""
            }
          >
            <a href="/user/phone-verification">{t("Phone Verification")}</a>
          </li>
        </Link>
        <Link href="/user/security">
          <li className={router.pathname == "/user/security" ? "active" : ""}>
            <a href="/user/security-setting">{t("Security")}</a>
          </li>
        </Link>
        <Link href="/user/personal-verification">
          <li
            className={
              router.pathname == "/user/personal-verification" ? "active" : ""
            }
          >
            <a href="/user/profile-verification-list">
              {t("KYC Verification")}
            </a>
          </li>
        </Link>

        <Link href="/user/bank/list">
          <li className={router.pathname == "/user/bank/list" ? "active" : ""}>
            <a href="/user/bank/list">{t("Bank List")}</a>
          </li>
        </Link>

        <Link href="/user/change-password">
          <li
            className={
              router.pathname == "/user/change-password" ? "active" : ""
            }
          >
            <a href="/user/change-password">{t("Change Password")}</a>
          </li>
        </Link>
        {parseInt(settings.knowledgebase_support_module) === 1 && (
          <Link href="/support">
            <li className={router.pathname == "/support" ? "active" : ""}>
              <a href="/support">{t("Support")}</a>
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default ProfileMenuTab;
