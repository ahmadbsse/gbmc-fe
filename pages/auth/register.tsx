import Link from "next/link";
import Head from "next/head";

import { BaseButton } from "@/components/common";
import { appData } from "@/constants";

const Register = () => (
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
              Sign up an account
            </h1>
            <form className="space-y-2 md:space-y-3" action="#">
              <div>
                <label htmlFor="fullname" className="mb-2 block text-sm font-medium">
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-primary focus:ring-primary"
                  placeholder="John Doe"
                  required
                />
              </div>
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

              <BaseButton loading={false} id="signUpButton" type="submit" handleClick={() => {}}>
                sign up
              </BaseButton>
              <p className="text-sm font-light">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Register;
