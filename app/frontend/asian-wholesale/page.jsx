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
                            Everything You Need for Your Asion Wholesale
                        </h1>
                    </div>
                </section>

                {/* ---------------- ABOUT SECTION ---------------- */}
                <section className="px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-5 leading-snug">
                            The ideal partner for Asian wholesalers
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700 mb-6">
                            As a wholesaler specializing in Asian food, you want to make sure that your inventory meets the requirements of your clients. We are the partner to make you achieve just that! With our wide range of authentic Asian delicacies, you can supply any type of client who is looking for traditional or trendy products from Asia. Together, we make the authentic Asian kitchen available for everyone.
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
                <section className="bg-[#99c229] px-6 md:px-20 py-20 grid md:grid-cols-2 gap-10 items-center">

                    <div>
                        <img
                            src="/about/candyfoto1_2.webp"
                            alt="Customer support"
                            className="rounded-xl shadow-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold mb-3 text-white">
                            Reach out to us today!
                        </h2>
                        <p className="text-white text-lg leading-relaxed mb-6">
                            Ready to take your wholesale assortiment to the next level? Sign up today and discover how Beagley Copperman can become your trusted partner. Contact us and request a quote today.
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
                        <h3 className="text-xl font-bold mb-3">Authentic products from all over Asia</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Our assortment includes a wide selection of products from countries such as Thailand, Indonesia, the Philippines, China, Korea, Japan, and more. From basic ingredients like rice, noodles and soy sauce to unique condiments and snacks - we offer everything your clients need.
                        </p>
                    </div>

                    {/* card 2 */}
                    <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-3">Longterm partnerships</h3>
                        <p className="text-gray-700 leading-relaxed">
                            At Beagley Copperman we always go for the long term, we want to build a strong and personal relationship with our clients. Our team of Account Managers is knowledgeable, passionate about Asian food and always ready to advise. This is how we grow together.
                        </p>
                    </div>

                    {/* card 3 */}
                    <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-3">Delivery to every corner of Europe </h3>
                        <p className="text-gray-700 leading-relaxed">
                            With our sophisticated ditribution network, we can deliver goods to every corner of Europe. Our network includes 7 wharehouses and 72 transport partners, ensuring seamless logistics.
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
