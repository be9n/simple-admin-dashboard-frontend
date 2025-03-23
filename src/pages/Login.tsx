import { Button } from "@/components/ui/button";
import TextInput from "../components/TextInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "@/utils/api";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/Spinner";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();

  const onSubmit = async (credentials: FormFields) => {
    try {
      const { data } = await API.post("/login", credentials);

      login(data.data.user, data.data.access_token);
    } catch (error: any) {
      console.log(error);

      setLoginError(error?.message || "An error occurred");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-white dark:bg-secondary-500 flex items-center justify-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-400 mb-3">
            Login
          </h2>
          <p className="text-sm md:text-lg mb-5 text-secondary-400 max-w-200px">
            Welcome back! Please login to your account.
          </p>

          {loginError && (
            <p className="text-red-500 mb-4 w-fit mx-auto">{loginError}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-2 text-secondary-400 font-semibold">
                Email
              </label>
              <TextInput
                {...register("email")}
                className="w-full"
                placeholder="example@gmail.com"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-secondary-400 font-semibold">
                Password
              </label>
              <TextInput
                {...register("password")}
                type="password"
                className="w-full"
                placeholder="••••••••••••"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember-me" />
                <label htmlFor="remember-me" className="cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                to="/login"
                className="text-secondary-300 hover:text-secondary-400 transition-colors duration-200 font-semibold"
              >
                Forget password
              </Link>
            </div>

            <Button
              size={"lg"}
              className="w-full flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-6" />
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="text-secondary-300 mt-4">
            New User?
            <Link
              to="/login"
              className="ms-2 font-semibold text-primary-400 hover:text-primary-400/80 transition-colors duration-200"
            >
              Signup
            </Link>
          </div>

          <p className="my-6 w-fit mx-auto text-secondary-300">
            Or Sign In With
          </p>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" className="group sm:w-auto flex-1">
              <FcGoogle className="size-6" />
            </Button>
            <Button
              variant="outline"
              className="group sm:w-auto flex-1 hover:bg-[#1877f2]"
            >
              <FaFacebookF className="size-5 text-[#1877f2] group-hover:text-white transition-colors duration-500" />
            </Button>
            <Button
              variant="outline"
              className="group hover:bg-black sm:w-auto flex-1"
            >
              <FaXTwitter className="size-5 group-hover:text-white transition-colors duration-300" />
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:block flex-1 bg-primary-100"></div>
    </div>
  );
}
