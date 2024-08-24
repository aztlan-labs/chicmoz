import { Link } from "@tanstack/react-router";
import { AztecLogoWhite } from "~/assets";
import { routes } from "~/routes/__root";


// TODO: add the footer links
export const Footer = () => {
  return (
    <footer className="">
      <Strips />
      <div className="bg-purple-light py-10">
        <div className="mx-auto px-[70px] max-w-[1440px]">
          <div className="flex flex-col w-full">
            <Link to={routes.home.route} className="hidden lg:block mb-[60px]">
              <AztecLogoWhite className="" />
            </Link>
            <div className="flex flex-col w-full items-center lg:items-end lg:text-center lg:flex-row">
              <Link to={routes.home.route} className="block lg:hidden">
                <AztecLogoWhite className="" />
              </Link>
              <p className="flex flex-col mt-[60px] lg:mb-0 mb-[100px] mr-0 gap-1 lg:mt-0 lg:mr-auto">
                <span className="text-grey-light text-xs text-center lg:text-left">{text.buildAndPoweredBy}</span>
              </p>
              <Link
                to={routes.aboutUs.route}
                className="[&.active]:text-white mr-0 mb-[40px] lg:mb-0 lg:mr-[30px]  text-grey-light hover:text-white"
              >
                {routes.aboutUs.title}
              </Link>
              <a
                // TODO: remove?
                className="[&.active]:text-white mr-0 mb-[40px] lg:mb-0 lg:mr-[30px]  text-grey-light hover:text-white"
              >
                {text.joinOurDiscord}
              </a>
              <Link
                to={routes.privacyPolicy.route}
                className="[&.active]:text-white mr-0 mb-[40px] lg:mb-0 lg:mr-[30px]  text-grey-light hover:text-white"
              >
                {routes.privacyPolicy.title}
              </Link>
              <Link
                to={routes.termsAndConditions.route}
                className="[&.active]:text-white mr-0 mb-[100px] lg:mb-0 lg:mr-[30px]  text-grey-light hover:text-white"
              >
                {routes.termsAndConditions.title}
              </Link>
              <p className="flex text-center flex-col ml-0 gap-1 lg:mt-0 lg:ml-[100px] text-white">{text.copyright}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const text = {
  buildAndPoweredBy: "Build and powered by ",
  aboutUs: "About Us",
  privacyPolicy: "Privacy Policy",
  joinOurDiscord: "Join our Discord",
  termsAndConditions: "Terms and Conditions",
  copyright: "© TODO"
};


const Strips = () => {
  return (
    <>
      <hr className="border-purple-light border-[1.5px]" />
      <hr className="border-grey-light border-[7.8px]" />
      <hr className="border-purple-light border-[2.7px]" />
      <hr className="border-grey border-[6.5px]" />
      <hr className="border-purple-light border-4" />
      <hr className="border-grey border-[5.2px]" />
      <hr className="border-purple-light border-[5.2px]" />
      <hr className="border-grey border-4" />
      <hr className="border-purple-light border-[6.5px]" />
      <hr className="border-grey border-[2.7px]" />
      <hr className="border-purple-light border-[7.8px]" />
      <hr className="border-grey border-[1.5px]" />
    </>
  );
};
