import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, MailPlus } from "lucide-react";
import Head from "next/head";
import emailjs from "@emailjs/browser";
import { Navbar, BaseButton } from "@/components/common";
import { appData } from "@/constants";

import showToast from "@/utils/toast";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
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
      showToast("EmailJs Credentials not configured!", "error");
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
          showToast("Email successfully sent!", "success");
          setLoading(false);
          form.current.reset();
        },
        (error) => {
          showToast("Something went wrong!", "error");
          console.log(`Failed to send email: ${error.text}`);
        }
      );
  };
  useEffect(() => {
    if (formValues.name && formValues.email && formValues.message) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [formValues]);
  return (
    <>
      <Head>
        <title>Contact | {appData.name}</title>
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
      <div className="min-h-screen bg-slate-50">
        {/* Navigation */}
        <Navbar />

        <div className="container mx-auto p-4 pt-7">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-3xl font-bold text-slate-900">Contact Us</h1>

            <div className="grid gap-12 md:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-2xl font-semibold text-slate-800">Send us an Email</h2>
                <form ref={form} onSubmit={sendEmail} className="space-y-4">
                  <div>
                    <label className="required mb-1 block text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <input
                      name="from_name"
                      type="text"
                      maxLength={100}
                      required
                      onChange={(e) => {
                        setFormValues({ ...formValues, name: e.target.value });
                      }}
                      className="w-full text-ellipsis rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="required mb-1 block text-sm font-medium text-slate-700">
                      Your Email
                    </label>
                    <input
                      name="reply_to"
                      type="email"
                      maxLength={100}
                      required
                      onChange={(e) => {
                        setFormValues({ ...formValues, email: e.target.value });
                      }}
                      className="w-full text-ellipsis rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="required mb-1 block text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      onChange={(e) => {
                        setFormValues({ ...formValues, message: e.target.value });
                      }}
                      maxLength={500}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="mx-auto mt-4 w-fit">
                    <BaseButton loading={false} type="submit" disabled={loading || !formIsValid}>
                      {loading ? (
                        "Loading...."
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
              <div className="space-y-8">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-6 text-2xl font-semibold text-slate-800">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-slate-900">Email</h3>
                        <p className="text-slate-600">{appData.contactEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-slate-900">Office Number</h3>
                        <p className="text-slate-600">{appData.officeNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium text-slate-900">Mobile Number</h3>
                        <p className="text-slate-600">{appData.mobileNumber}</p>
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

                {/* <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-6 text-2xl font-semibold text-slate-800">Business Hours</h2>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-600">Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 7:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-600">Saturday</span>
                      <span className="font-medium">8:00 AM - 2:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-600">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
