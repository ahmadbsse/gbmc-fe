import type { ButtonProps } from "@/types";
import { BaseLoader } from "@/components/common";

const BaseButton: React.FC<ButtonProps> = ({
  handleClick,
  children,
  type,
  btnStyle,
  id,
  loading,
  rounded,
  disabled,
}) => (
  <button
    onClick={handleClick}
    type={type}
    id={id}
    disabled={disabled}
    className={`relative z-10 h-[42px] w-full overflow-hidden rounded px-5 text-sm font-bold uppercase text-[#363633] transition-all md:min-w-[7rem] lg:min-w-[8rem] ${
      btnStyle
        ? "btn-sec-anim border border-gray-500 hover:text-[#fff]"
        : "btn-anim border-primary-color bg-primary-color hover:border-[#FFC952]"
    } ${rounded ? "rounded-lg" : ""} ${loading || disabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
  >
    <span className="mx-auto flex w-fit items-center gap-3">
      {loading ? (
        <div className="mx-auto w-fit">
          <BaseLoader />
        </div>
      ) : null}
      {children}
    </span>
  </button>
);
export default BaseButton;
