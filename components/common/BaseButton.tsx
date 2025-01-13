import type { ButtonProps } from "@/types";

const BaseButton: React.FC<ButtonProps> = ({
  handleClick,
  children,
  type,
  btnStyle,
  id,
  loading,
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
    } ${rounded ? "rounded-lg" : ""} ${loading ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
  >
    {loading ? (
      <div className="mx-auto w-fit">
        <svg
          className="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C17.421 22 22 17.421 22 12H20C20 16.337 16.337 20 12 20C7.663 20 4 16.337 4 12C4 7.664 7.663 4 12 4V2C6.579 2 2 6.58 2 12C2 17.421 6.579 22 12 22Z"
            fill="#333333"
          />
        </svg>
      </div>
    ) : (
      children
    )}
  </button>
);
export default BaseButton;
