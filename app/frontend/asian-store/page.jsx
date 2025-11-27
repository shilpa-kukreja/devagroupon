"use client";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function AsianStorePage() {
  return (
    <div>
        <Navbar />
    <div className="w-full bg-white text-[#1a1a1a]">

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative h-[70vh] w-full">
        <img
          src="/banner/noodles.webp"
          className="w-full h-full object-cover"
          alt="Asian Store Banner"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-6xl font-bold drop-shadow-lg">
            Everything You Need for Your Asian Store
          </h1>
        </div>
      </section>

      {/* ---------------- ABOUT SECTION ---------------- */}
      <section className="px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-extrabold mb-5 leading-snug">
            ALL YOU NEED FOR YOUR ASIAN STORE AND MORE…
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            Discover the convenience of one supplier for a wide range of
            authentic Asian products. We understand space limitations, which
            is why our assortment is carefully selected to offer diversity
            without needing deep inventory. Our collection includes the true
            iconic brands from Asia.
          </p>

          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">
            Register now
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src="/about/candyfoto.webp"
            alt="Asian products"
            className="w-[90%] max-w-[450px]"
          />
        </div>
      </section>

      {/* ---------------- CONTACT SECTION ---------------- */}
      <section className="bg-lime-500 px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-extrabold mb-3 text-white">
            REACH OUT TO US TODAY!
          </h2>
          <p className="text-white text-lg leading-relaxed mb-6">
            With years of experience in advising Asian supermarkets and stores,
            we help you select the best products for your range. We understand
            your customers and deliver exactly what you need.
          </p>

          <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition">
            Contact us
          </button>
        </div>

        <div>
          <img
            src="/about/candyfoto1_2.webp"
            alt="Customer support"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="px-6 md:px-20 py-20 grid md:grid-cols-3 gap-10">

        {/* card 1 */}
        <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-3">AUTHENTIC PRODUCTS</h3>
          <p className="text-gray-700 leading-relaxed">
            Our assortment includes ingredients from Thailand, Indonesia,
            Philippines, China, Korea, Japan, and more.
          </p>
        </div>

        {/* card 2 */}
        <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-3">POS MATERIALS</h3>
          <p className="text-gray-700 leading-relaxed">
            We support your sales with posters, shelf cards, and POS materials
            to help your customers notice your products.
          </p>
        </div>

        {/* card 3 */}
        <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-3">PERSONAL RELATIONSHIPS</h3>
          <p className="text-gray-700 leading-relaxed">
            Our team helps you personally—online, in-store, or by phone—
            ensuring you receive the service you deserve.
          </p>
        </div>
      </section>

      {/* ---------------- JOIN SECTION ---------------- */}
      <section className="relative h-[60vh] w-full mb-5">
        <img
          src="/about/register-candy_3.webp"
          className="w-full h-full object-cover"
          alt="Join us"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-5">
            Join Beagley
          </h2>
          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">
            Register now
          </button>
        </div>
      </section>
  </div>
  <Footer />
    </div>
  );
}
