import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dropdown from "@/components/dropdown";
import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { SignOutAction } from "@/store/actions/auth";
import { CancelSpoofingAction } from "@/store/actions/auth";

export default function Header() {
  const [navbar, setNavbar] = useState<boolean>(false);
  const navigate = useNavigate();
  const { email } = useAppSelector((state) =>
    state.auth.bSuccess ? state.auth.authUser : {}
  );
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(SignOutAction());
    navigate("/signin");
  };

  const subscribed = useAppSelector(
    (state) =>
      state.auth.authUser &&
      state.auth.authUser.active &&
      !state.auth.authUser.ended
  );

  const isAdmin = useAppSelector(
    (state) => state.auth.authUser && state.auth.authUser.role === "admin"
  );

  const spoofing = useAppSelector(
    (state) => state.auth.authUser && state.auth.authUser.spoofing
  );

  const goToAdminAccount = () => {
    dispatch(CancelSpoofingAction(navigate));
  };

  return (
    <header>
      <nav className="sticky top-4 w-full bg-white shadow z-[9999]">
        <div className="justify-around  md:items-center md:flex">
          <div>
            <div className="px-4 flex items-center justify-between py-2 md:py-2 md:block">
              <a href="">
                <img src={"/assets/logo.png"} css={{ maxHeight: "100%" }} />
                {/* <h2 className="text-2xl font-bold">Design Editor</h2> */}
              </a>
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div
              className={` flex-1 justify-self-center pb-3 mt-8 mr-8 md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className="items-center justify-around  md:flex md:space-x-6 ">
                <div className="sm:mt-2 sm:ml-2 md:flex justify-around w-full">
                  <li>
                    <Link
                      to="/user/create-graphic"
                      className="sm:text-xl sm:py-4 md:text-lg text-gray-600 hover:text-blue-600 whitespace-nowrap"
                    >
                      Create a Graphic
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/user/saved-graphics"
                      className="sm:text-xl sm:py-4 md:text-lg  text-gray-600 hover:text-blue-600 whitespace-nowrap"
                    >
                      Saved Graphics
                    </Link>
                  </li>
                </div>

                <div className="sm:mt-2 sm:ml-2 md:flex md:justify-end w-full md:items-center">
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="sm:text-xl sm:py-2 md:text-lg px-8 py-2 mr-8 text-white bg-green-700 rounded-lg hover:bg-green-800 whitespace-nowrap"
                      >
                        Go Admin
                      </Link>
                    </li>
                  )}
                  {spoofing && (
                    <li>
                      <button
                        onClick={goToAdminAccount}
                        className="sm:text-xl sm:py-2 md:text-lg px-8 py-2 mr-8 text-white bg-green-700 rounded-lg hover:bg-green-800 whitespace-nowrap"
                      >
                        Logout
                      </button>
                    </li>
                  )}
                  {!subscribed && (
                    <li>
                      <Link
                        to="/user/go-pro"
                        className="sm:text-xl sm:py-2 md:text-lg md:w-[100px] px-8 py-2 mr-8 text-white bg-green-700 rounded-lg hover:bg-green-800 whitespace-nowrap"
                      >
                        Go Pro
                      </Link>
                    </li>
                  )}
                  <li>
                    <Dropdown
                      button={
                        <p className="sm:text-xl sm:py-2 md:text-lg  text-gray-600 hover:text-blue-600 cursor-pointer whitespace-nowrap">
                          My Account
                        </p>
                      }
                      children={
                        <div className="flex h-[120px] w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500">
                          <div className="mt-3 ml-4">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-navy-700 dark:text-white">
                                {email}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

                          <div className="mt-3 ml-4 flex flex-col">
                            <Link
                              to="/user/go-pro"
                              className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                            >
                              Profile Settings
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="mt-3 text-left text-sm font-medium text-red-500 hover:text-red-500"
                            >
                              Log Out
                            </button>
                          </div>
                        </div>
                      }
                      classNames={"py-2 top-8 -left-[180px] w-max"}
                    />
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
