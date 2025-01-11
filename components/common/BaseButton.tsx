import type { ButtonProps } from "@/types";

const BaseButton: React.FC<ButtonProps> = ({
  handleClick,
  children,
  type,
  btnStyle,
  id,
  rounded,
}) => (
  <button
    onClick={handleClick}
    type={type}
    id={id}
    className={`relative z-10 h-[42px] w-full overflow-hidden text-sm font-bold uppercase text-[#363633] transition-all md:min-w-[7rem] lg:min-w-[8rem] ${
      btnStyle
        ? "btn-sec-anim border border-gray-500 hover:text-[#fff]"
        : "btn-anim border-primary-color bg-primary-color hover:border-[#FFC952]"
    } ${rounded ? "rounded-lg" : ""}`}
  >
    {children}
  </button>
);
export default BaseButton;
