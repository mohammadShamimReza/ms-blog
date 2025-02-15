import { useUser } from "@/lib/UserProvider";
import { useUserLoginMutation } from "@/redux/api/authApi";
import { getUserInfo, storeUserInfo } from "@/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";

interface ErrorType {
  response: {
    statusCode: number;
    message: string;
    errorMessages: string;
  };
}

const LoginForm: React.FC = () => {
  const { user, setUser } = useUser();
  const [userLogin] = useUserLoginMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleLogin = async (data: any) => {
    toast.loading("Logging ...", {
      style: {
        border: "1px solid black",
      },
      duration: 3000,
    });

    try {
      const res = await userLogin({ ...data }).unwrap();

      if (res?.data?.accessToken) {
        toast("Log In successfully", {
          style: {
            border: "1px solid black",
          },
        });

        storeUserInfo({ accessToken: res?.data?.accessToken });
        const { role, id } = getUserInfo() as any;
        reset({ email: "", password: "" });
        router.push(`/profile/${id}`);

        setUser({ role: role, id: id });
      } else {
        toast.error("Log In is not successfully", {
          style: {
            border: "1px solid black",
          },
        });
      }
    } catch (error) {
      const specificError = error as ErrorType;
      const logError = specificError?.response;
      toast.error(logError.errorMessages, {
        style: {
          border: "1px solid black",
        },
      });
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md m-4 p-6 rounded-lg border">
          <h1 className="text-2xl text-center mb-4 font-semibold">Login</h1>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    className="w-full border p-2 rounded-md"
                  />
                )}
              />
            </div>
            <div className="relative">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    className="w-full border p-2 rounded-md pr-10"
                  />
                )}
              />
              {/* Password Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 mt-6 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="bg-gray-300 dark:bg-gray-600 font-bold p-2 rounded-md w-full dark:hover:bg-slate-500 hover:bg-gray-400"
              >
                Login
              </button>
            </div>
          </form>
          <br />
          <br />
          <div className="text-right pt-4">
            <div className="text-left">
              Not SignUp yet! Please{" "}
              <Link
                href={"/signup"}
                className="font-bold p-2 rounded-md w-full hover:text-gray-500 hover:dark:text-gray-300 text-right underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
