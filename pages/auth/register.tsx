import Link from "next/link";
import Image from "next/image";
import { BaseButton, SeoHead } from "@/components/common";

const Register = () => (
  <>
    <SeoHead title="Register" />

    <section className="h-screen bg-gray-50">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="mb-4 lg:mb-8">
          <Image height={70} width={150} src="/assets/logo.svg" alt="logo" priority />
        </div>
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
