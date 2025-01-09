import React from "react";
import Image from "next/image";
import { Users, Globe, Shield } from "lucide-react";

import { Navbar } from "../components/common";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-96">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/50 to-slate-900/70" />
        <div className="relative h-full">
          <Image src="/assets/about.jpg" alt="Factory" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Global Leader in Engineering & Agricultural Solutions
            </h1>
            <p className="text-xl text-slate-200">
              Delivering precision engineering and quality tractor parts worldwide since 1980
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">Our Mission</h2>
            <p className="text-slate-600">
              To provide world-class engineering solutions and agricultural machinery parts that
              empower businesses and farmers to achieve optimal performance and productivity.
            </p>
          </div>
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">Our Vision</h2>
            <p className="text-slate-600">
              To be the global leader in innovative engineering solutions and reliable tractor
              parts, driving the future of industrial and agricultural advancement.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <Users className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold text-slate-800">Expert Team</h3>
            <p className="text-slate-600">
              Our team of experienced engineers and technicians ensures the highest quality
              standards in every product we deliver.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <Globe className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold text-slate-800">Global Reach</h3>
            <p className="text-slate-600">
              With a presence in multiple countries, we serve clients worldwide with efficient
              distribution and support.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <Shield className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold text-slate-800">Quality Assured</h3>
            <p className="text-slate-600">
              Every product undergoes rigorous quality control to meet international standards and
              specifications.
            </p>
          </div>
        </div>

        {/* Company Stats */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">Our Impact</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">40+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">50+</div>
              <div className="text-slate-600">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">1000+</div>
              <div className="text-slate-600">Products</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">10k+</div>
              <div className="text-slate-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
