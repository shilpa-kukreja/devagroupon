// components/Quote.js

export default function Quote() {
  return (
    <div className="flex justify-center items-center py-5 ">
      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-12 w-full max-w-3xl text-center">
        <blockquote className="text-lg font-semibold italic text-gray-600 relative pl-8">
          <span className="absolute top-0 left-0 text-6xl text-gray-400">“</span>
          We are the most innovative importer of authentic Asian food in Europe. With a distinctive product range, focus on quality, and tailored advice, we are your partner for success.
        </blockquote>
        <p className="mt-8 text-xl font-medium text-gray-800">- Dev Team</p>
        <div className="w-20 h-1 bg-red-500 mx-auto mt-6"></div>
      </div>
    </div>
  );
}
