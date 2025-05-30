import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, MailPlus } from "lucide-react";

import emailjs from "@emailjs/browser";
import { Navbar, BaseButton, SeoHead } from "@/components/common";
import { appData } from "@/constants";
import { GoogleMap } from "@/components/user";
import showToast from "@/utils/toast";
import useMarqueeStateStore from "@/stores/marquee";
import SocialLinks from "@/components/user/SocialIcons";

const ContactPage = () => {
  const { hasMarquee } = useMarqueeStateStore();
  const [loading, setLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const form = useRef<HTMLFormElement>(null);
  const sendEmail = (e) => {
    e.preventDefault();
    if (
      process.env.NEXT_PUBLIC_EmailJsServiceId === undefined ||
      process.env.NEXT_PUBLIC_EmailJsTemplateId === undefined ||
      process.env.NEXT_PUBLIC_EmailJsPublicKey === undefined
    ) {
      showToast("EmailJs Credentials not configured!", "error", true);
      return;
    }
    setLoading(true);
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EmailJsServiceId,
        process.env.NEXT_PUBLIC_EmailJsTemplateId,
        form.current,
        process.env.NEXT_PUBLIC_EmailJsPublicKey
      )
      .then(
        () => {
          showToast(
            "Thank you for reaching out! We’ve received your message and will get back to you as soon as possible.",
            "success",
            true
          );
          setLoading(false);
          form.current.reset();
        },
        () => {
          showToast("Something went wrong!", "error", true);
        }
      );
  };
  function isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  useEffect(() => {
    if (
      formValues.name &&
      formValues.name.trim() &&
      formValues.email &&
      formValues.email.trim() &&
      formValues.message &&
      formValues.message.trim() &&
      isValidEmail(formValues.email)
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [formValues]);

  return (
    <>
      <SeoHead title="Contact" />

      <div className="min-h-screen">
        {/* Navigation */}
        <Navbar setTab={() => {}} />

        <div className={`mx-auto p-4 md:container ${hasMarquee ? "mt-32" : "mt-20"}`}>
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-4 text-3xl font-bold text-slate-900">Contact Us</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:gap-8 xl:gap-12">
              {/* Contact Form */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-slate-800">Send us an Email</h2>
                <p className="my-2 text-sm">
                  Please contact us for unmatched quality services for your industrial needs. Our
                  representative will get in touch with you very soon.
                </p>
                <form ref={form} onSubmit={sendEmail} className="space-y-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="required mb-1 block text-sm font-medium text-slate-700"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      maxLength={255}
                      name="from_name"
                      type="text"
                      required
                      onChange={(e) => {
                        setFormValues({ ...formValues, name: e.target.value });
                      }}
                      className="w-full text-ellipsis rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="required mb-1 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="reply_to"
                      type="email"
                      maxLength={100}
                      required
                      onChange={(e) => {
                        setFormValues({ ...formValues, email: e.target.value });
                        if (isEmailValid) setIsEmailValid(false);
                      }}
                      onBlur={(e) => {
                        setIsEmailValid(!isValidEmail(e.target.value));
                      }}
                      className="w-full text-ellipsis rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    />
                    {isEmailValid && (
                      <p>
                        <small className="text-red-500">Please enter a valid email address</small>
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="required mb-1 block text-sm font-medium text-slate-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      onChange={(e) => {
                        setFormValues({ ...formValues, message: e.target.value });
                      }}
                      maxLength={500}
                      required
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="mx-auto w-fit pt-6">
                    <BaseButton loading={loading} type="submit" disabled={loading || !formIsValid}>
                      {loading ? (
                        "Sending...."
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <span>Send Email</span>
                          <MailPlus height={20} />
                        </div>
                      )}
                    </BaseButton>
                  </div>
                </form>
              </div>
              {/* Contact Information */}
              <div className="space-y-3 xl:space-y-6">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-3 text-2xl font-semibold text-slate-800">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-slate-900">Email</h3>
                        <a
                          href={`mailto:${appData.contactEmail}`}
                          className="text-slate-600 hover:underline"
                        >
                          {appData.contactEmail}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-slate-900">Landline</h3>
                        <a
                          href={`tel:${appData.officeNumber}`}
                          className="text-slate-600 hover:underline"
                        >
                          {appData.officeNumber}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-slate-900">Cell</h3>
                        <a
                          href={`tel:${appData.mobileNumber}`}
                          className="text-slate-600 hover:underline"
                        >
                          {appData.mobileNumber}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-slate-900">Address</h3>
                        <p className="text-slate-600">
                          {appData.address.street_address}
                          <br />
                          {appData.address.district}, {appData.address.postal_code}
                          <br />
                          {appData.address.city}, {appData.address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg bg-white px-6 py-8 shadow-md">
                  <h2 className="text-2xl font-semibold text-slate-800">Social Links</h2>
                  <SocialLinks />
                </div>
              </div>
            </div>
            <div className="mt-5 bg-white shadow-lg">
              <GoogleMap />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
