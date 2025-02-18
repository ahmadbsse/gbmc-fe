import Link from "next/link";

import { BaseButton, Navbar } from "@/components/common";

export default function FourOhFour() {
  return (
    <>
      <Navbar setTab={() => {}} />
      <div className="3xl:my-36 relative mx-auto my-24">
        <div className="mx-auto max-w-[90%]">
          <div className="z-10 flex flex-col items-center justify-between gap-10">
            <h2 className="z-10 font-secondary-font text-[100px] font-bold text-primary-color md:text-[150px]">
              404
            </h2>
            <p className="z-10 text-lg md:text-2xl">Oops! It looks like you got lost.</p>
            <div>
              <BaseButton loading={false} btnStyle type="submit">
                <Link href="/">Go Back</Link>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
