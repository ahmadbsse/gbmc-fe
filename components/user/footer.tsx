const items = [
  "Global Distribution Network",
  "24/7 Technical Support",
  "Custom Engineering Solutions",
  "Quality Guaranteed",
  "Expert Consultation",
];

const Footer = () => (
  <div className="relative z-10 bg-slate-900 py-4 text-white">
    <div className="flex justify-center whitespace-nowrap">
      <div className="mx-4 flex flex-col gap-4 text-sm lg:flex-row xl:gap-8 xl:text-base">
        {items.map((item, index) => (
          <p key={index} className="flex items-center gap-3">
            <span>•</span>
            <span>{item}</span>
          </p>
        ))}
      </div>
    </div>
  </div>
);
export default Footer;
