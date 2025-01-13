import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { appData } from "@/constants";
import { BaseButton } from "@/components/common";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      setIsLoading(false);
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error);
      setTimeout(() => {
        setError(null);
      }, 3500);
      setIsLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>{`${appData.name} - Login`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Platform where you get tractor related parts in one place"
        />
        <meta
          name="og:description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta name="keywords" content="tractor,spare parts,machinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="bg-gray-50">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <p className="mb-10 text-3xl font-bold">{appData.name}</p>
          <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Sign in to your account
              </h1>
              <form className="space-y-2 md:space-y-3" action="#" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-primary focus:ring-primary"
                    placeholder="name@company.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-primary focus:ring-primary"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="ml-auto w-fit">
                  <Link
                    href="/auth/forget-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <BaseButton loading={isLoading} id="signInButton" type="submit">
                  sign in
                </BaseButton>
                <p className="text-sm font-light">
                  Don’t have an account yet?{" "}
                  <Link href="/auth/register" className="font-medium text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
            {error && <p className="mx-auto w-fit py-1 text-error">{error}</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
