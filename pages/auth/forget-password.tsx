import Link from "next/link";

import { appData } from "@/constants";
import { BaseButton } from "@/components/common";

const ForgetPassword = () => (
  <section className="bg-gray-50">
    <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <p className="mb-10 text-3xl font-bold">{appData.name}</p>
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Forget Password
          </h1>
          <span className="text-xs italic text-black/30">
            A reset link will be sent to your email.
          </span>
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

            <BaseButton
              loading={false}
              id="passwordResetButton"
              type="submit"
              handleClick={() => {}}
            >
              reset
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
);

export default ForgetPassword;
