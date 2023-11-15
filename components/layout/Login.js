import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { BASE_URL, client_id, client_secret } from "../../consts";
import { useAuth } from "../../context/auth";
import useMutation from "swr/mutation";

import { toast } from "react-hot-toast";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { login: setUser } = useAuth();

  const { trigger, isMutating } = useMutation(`${BASE_URL}/o/token/`, login, {
    onSuccess: (data) => {
      console.log("data", data);
      if (data.error) {
        return toast.error("Нэвтрэх нэр нууц үг буруу байна");
      }
      localStorage.setItem("at", data.access_token);
      localStorage.setItem("rt", data.refresh_token);
      // toastSuccess();
      setUser({ username: watch("username") });
    },
  });

  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      await trigger(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 h-full">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/">
              <Image
                alt="Your Company"
                className="h-10 w-auto"
                src="/gipfel.svg"
                height={15}
                width={15}
              />
            </Link>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                    htmlFor="phone"
                  >
                    Нэвтрэх нэр
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="border-#FFF block w-full py-2 px-3 shadow-sm mt-1 border-[1px] rounded-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      {...register("username", { required: true })}
                    />
                    {errors.username && (
                      <p className="text-red-500">Нэвтрэх нэр хоосон байна.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                    htmlFor="password"
                  >
                    Нууц үг
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      className="border-#FFF block w-full rounded-md py-2 px-3 shadow-sm mt-1 border-[1px] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      {...register("password", { required: true })}
                    />
                    {errors.password && (
                      <p className="text-red-500">Нууц үг хоосон байна.</p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white w-[380px]  bg-primary py-2 grid justify-items-center content-center cursor-pointer mt-6 rounded-md"
                >
                  Нэвтрэх
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          alt="Gipfel"
          className="absolute inset-0 h-full w-full object-cover"
          src="/login.jpeg"
          height={2000}
          width={2000}
        />
      </div>
    </div>
  );
}

const login = async (_, { arg: { password, username } }) => {
  const body = new URLSearchParams();
  body.append("grant_type", "password");
  body.append("client_id", client_id);
  body.append("client_secret", client_secret);
  body.append("username", username);
  body.append("password", password);

  try {
    const res = await fetch(`${BASE_URL}/o/token/`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
};
