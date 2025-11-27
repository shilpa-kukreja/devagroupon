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
                            Everything You Need for Your Retail
                        </h1>
                    </div>
                </section>

                {/* ---------------- ABOUT SECTION ---------------- */}
                <section className="px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-5 leading-snug">
                            The innovation partner for mainstream retail
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700 mb-6">
                            The popularity of Asian products in mainstream retail is skyrocketing. At Beagley Copperman, we understand that supermarkets need to inspire customers every day, to stay ahead of the competition. With our extensive range of authentic and trendy products from Asian A-brands, we help your supermarkets not only meet demand but also set trends in the marketplace.
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
                <section className="bg-[#2f2b30] px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-3 text-white">
                            Authentic Asian products that meet EU quality regulations
                        </h2>
                        <p className="text-white text-lg leading-relaxed mb-6">
                            We work directly with the reliant A-brand producers in Asia. Not only to source the best and most trending products at the best prices, but also to assure that they comply to the strict EU regulations. Thanks to this we have a whole range of high quality products that can boost your profits. Do you want to know how we can support your business?
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
                        <h3 className="text-xl font-bold mb-3">Fast & reliable delivery</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Your customers rely on you, and that's why you can rely on us. With our fast deliveries and constant product availability, we make sure you are always fully stocked.
                        </p>
                    </div>

                    {/* card 2 */}
                    <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-3">Leading the way in trends</h3>
                        <p className="text-gray-700 leading-relaxed">
                            As a Category Manager of a mainstream retail chain, you want to innovate your assortment constantly. At Beagley Copperman, we are always on top of the latest Asian food trends to help you stay ahead of the game.
                        </p>
                    </div>

                    {/* card 3 */}
                    <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-3">Wide and deep range</h3>
                        <p className="text-gray-700 leading-relaxed">
                            From authentic basic ingredients such as rice and noodles to trendy snacks and sauces, we offer a wide range to suit the needs of your customer base. Mix up your assortiment with different flavors or variants to keep them coming back for more.
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
