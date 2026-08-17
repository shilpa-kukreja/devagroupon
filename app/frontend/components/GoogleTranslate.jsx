"use client";
import React, { useEffect, useState, useRef } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const GoogleTranslate = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Prevent multiple script injections
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Define callback FIRST
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,no",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Load script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Outside click handler
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      {/* Hidden Google Translate */}
      <div id="google_translate_element" style={{ display: "none" }} />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center text-white hover:text-green-400 transition"
        >
          <GlobeAltIcon className="w-6 h-6" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border p-2 z-50">
            <button
              onClick={() => changeLanguage("en")}
              className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-100 rounded"
            >
              <img src="/flags/en.png" className="w-6 h-6 rounded" />
              <span className="text-sm text-gray-600">English</span>
            </button>

            <button
              onClick={() => changeLanguage("no")}
              className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-100 rounded"
            >
              <img src="/flags/no.png" className="w-6 h-6 rounded" />
              <span className="text-sm text-gray-600">Norwegian</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GoogleTranslate;
