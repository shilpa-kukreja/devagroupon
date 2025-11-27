import React, { useEffect, useState, useRef } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const GoogleTranslate= () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load Google Translate Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,no",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Close dropdown on outside click
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Change language programmatically
  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
    setOpen(false);
  };

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        {/* Button Icon */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-white hover:text-green-400 transition"
        >
          <GlobeAltIcon className="w-6 h-6" />
        </button>

        {/* Menu */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">

            {/* English */}
            <button
              onClick={() => changeLanguage("en")}
              className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-100 rounded-lg"
            >
              <img src="/flags/en.png" className="w-6 h-6 rounded" alt="English" />
              <span className="text-sm text-gray-600 font-medium">English</span>
            </button>

            {/* Norwegian */}
            <button
              onClick={() => changeLanguage("no")}
              className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-100 rounded-lg"
            >
              <img src="/flags/no.png" className="w-6 h-6 rounded" alt="Norwegian" />
              <span className="text-sm text-gray-600 font-medium">Norwegian</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GoogleTranslate;
