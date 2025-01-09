import Link from "next/link";

import { appData } from "@/constants";
import { BaseButton } from "@/components/common";

const Login = () => (
  <section className="bg-gray-50">
    <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <p className="mb-10 text-3xl font-bold">{appData.name}</p>
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Sign in to your account
          </h1>
          <form className="space-y-2 md:space-y-3" action="#">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-primary focus:ring-primary"
                placeholder="name@company.com"
                required
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
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-primary focus:ring-primary"
                required
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

            <BaseButton id="signInButton" type="submit" handleClick={() => {}}>
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
      </div>
    </div>
  </section>
);

export default Login;
