// import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";
import showToast from "@/utils/toast";
import apiClient from "@/utils/apiClient";
import Image from "next/image";
import { BaseButton, SeoHead } from "@/components/common";

const Login = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await apiClient.POST("/auth/local", { identifier, password });
      if (response && response.jwt) {
        const jwt = response.jwt;
        const email = response.user.email;
        const userName = response.user.username;
        await apiClient
          .POST(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
            { jwt },
            { withCredentials: true }
          )
          .then(async (res) => {
            if (res.message == "Login successful") {
              showToast("Logged In Successfully", "success", true);
              localStorage.setItem("username", userName);
              localStorage.setItem("email", email);
              apiClient.setAuthToken(jwt);
              setIsLoading(false);
              router.push("/admin");
            }
          });
      }
    } catch (error) {
      const message = (error as Error).message;

      showToast(message, "error", true);

      setIsLoading(false);
      console.error("Error in POST request:", message);
    }
  };
  useEffect(() => {
    if (identifier.trim() && password.trim()) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [identifier, password]);
  return (
    <>
      <SeoHead title="Login" />

      <section className="min-h-screen bg-[#f3f3f3]">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div className="mb-4 lg:mb-8">
            <Image height={70} width={150} src="/assets/logo.svg" alt="logo" priority />
          </div>
          <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Sign in to your account
              </h1>
              <form className="space-y-2 md:space-y-3" action="#" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="identifier" className="required mb-2 block text-sm font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    name="text"
                    id="identifier"
                    value={identifier}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-primary focus:ring-primary"
                    placeholder="Your admin identifier"
                    required
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="required mb-2 block text-sm font-medium">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-primary focus:ring-primary"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 flex items-center text-gray-500 transition-transform hover:text-primary"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* <div className="ml-auto w-fit">
                  <Link
                    href="/auth/forget-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div> */}
                <div className="pt-10">
                  <BaseButton
                    loading={isLoading}
                    id="signInButton"
                    disabled={!isFormValid}
                    type="submit"
                  >
                    {isLoading ? "Logging in" : "log in"}
                  </BaseButton>
                </div>
                {/* <p className="text-sm font-light">
                  Don’t have an account yet?{" "}
                  <Link href="/auth/register" className="font-medium text-primary hover:underline">
                    Sign up
                  </Link>
                </p> */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
