"use client";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function CandyStorePage() {
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
                            Everything You Need for Your Candy Store
                        </h1>
                    </div>
                </section>

                {/* ---------------- ABOUT SECTION ---------------- */}
                <section className="px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-5 leading-snug">
                            The latest trends from Asia in your candy store?
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700 mb-6">
                            At Beagley Copperman, we bring the most fun and delicious Asian candies and snacks to candy stores across Europe. If your customer is asking for products that they have seen on their socials, there is a good chance that we have it within our range. Discover why partnering with Beagley Copperman can be the key to your success! Get in touch and find out how we can take your assortment to new heights with popular new products.
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
                <section className="bg-[#ffcce7] px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">

                    <div>
                        <img
                            src="/about/candyfoto1_2.webp"
                            alt="Customer support"
                            className="rounded-xl shadow-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold mb-3 text-white">
                            The added value of Beagley Copperman for candy stores
                        </h2>
                        <p className="text-white text-lg leading-relaxed mb-6">
                            With our extensive network and years of expertise, we ensure that you have first access to new products and trends. Our focus on quality, authenticity and innovation makes us the ideal partner for candy stores that want to surprise and inspire their customers.
                        </p>

                        <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition">
                            Contact us
                        </button>
                    </div>
                </section>

                {/* ---------------- FEATURES SECTION ---------------- */}
                <section className="px-6 md:px-20 py-20 grid md:grid-cols-3 gap-10">

                    {/* card 1 */}
                    <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-3">Stay on top of trends</h3>
                        <p className="text-gray-700 leading-relaxed">
                            The candy industry is trend-sensitive. At Beagley Copperman, we work proactively to quickly catch on to the latest trends so you can always offer the latest and most popular products.
                        </p>
                    </div>

                    {/* card 2 */}
                    <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-3">The best brands</h3>
                        <p className="text-gray-700 leading-relaxed">
                            As a candy store, we understand that you are looking for powerful brands that fly of the shelves. We offer a wide selection of delicious candies from Asia, including well-known brands that will delight your customers.
                        </p>
                    </div>

                    {/* card 3 */}
                    <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-3">Eye-Candy</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We know that eye-catching packaging is important to have succes in sales. Our products come in banging packaging that will grab your customers attention immediatly.
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
