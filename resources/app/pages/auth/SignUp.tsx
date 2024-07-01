import { useState, useEffect } from "react";
import {
  IFieldObject,
  useReactForm,
} from "@surinderlohat/react-form-validation";
import InputField from "@/components/fields/InputField";
import Card from "@/components/card";
import { useNavigate, Link } from "react-router-dom";
import { SignUpAction } from "@/store/actions/auth";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

const field: IFieldObject = {
  email: {
    label: "Email*",
    placeholder: "Enter your email",
    rules: [
      { rule: "email", message: "Email is not valid" },
      { rule: "required" },
    ],
  },
  password: {
    label: "Password*",
    type: "password",
    placeholder: "Min. 8 characters",
    rules: [
      { rule: "required", message: "This field is required" },
      { rule: "min", ruleValue: 8 },
    ],
  },
  confirmPassword: {
    type: "password",
    label: "Confirm Password*",
    rules: [
      { rule: "required" },
      {
        rule: "same",
        ruleValue: "password",
        message: "Should be same as Password",
      },
    ],
  },
};

const SignUp = () => {
  const form = useReactForm(field);
  const navigate = useNavigate();
  const bSuccess = useAppSelector((state) => state.auth.bSuccess);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bSuccess) {
      navigate("/user");
    }
  }, [bSuccess]);

  const handleSubmit = () => {
    form.showErrors();
    let fields = form.getValues();
    if (!form.hasError) {
      dispatch(
        SignUpAction(
          "DesignUser",
          fields.email,
          fields.password,
          fields.confirmPassword,
          navigate
        )
      );
    }
  };
  return (
    <section className="absolute w-full h-full bg-gray-900">
      <div className="container mx-auto h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full md:w-7/12 lg:w-6/12 px-4 xl:max-w-[480px]">
            <Card extra="!flex-row flex-grow items-center rounded-[20px]">
              <div className="mb-16 flex h-full w-full items-center justify-center px-2 lg:mb-10 lg:items-center">
                {/* Sign in section */}
                <div className="mt-[5vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[480px]">
                  <h4 className="mb-2.5 text-center text-4xl font-bold text-navy-700 dark:text-white">
                    Sign Up
                  </h4>
                  {Object.keys(field).map((key) => (
                    <InputField
                      extra="mb-3"
                      key={key}
                      showLabel={true}
                      field={form.getField(key)}
                    />
                  ))}
                  <button
                    className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </button>
                  <div className="mt-4">
                    <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
                      Already have an account?
                    </span>
                    <Link
                      to="/signin"
                      className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
