"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

// Recursive TypeScript Interface Generator Helper
function generateTypeScriptInterfaces(jsonObj, rootName = "RootObject") {
  const interfaces = [];

  function capitalize(str) {
    if (!str) return "Item";
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/[^a-zA-Z0-9]/g, "");
  }

  function getType(val, keyName = "") {
    if (val === null || val === undefined) return "any";
    if (typeof val === "string") return "string";
    if (typeof val === "number") return "number";
    if (typeof val === "boolean") return "boolean";

    if (Array.isArray(val)) {
      if (val.length === 0) return "any[]";
      const firstElem = val[0];
      const elemType = getType(firstElem, keyName);
      return `${elemType}[]`;
    }

    if (typeof val === "object") {
      const subInterfaceName = capitalize(keyName) || "SubItem";
      buildInterface(val, subInterfaceName);
      return subInterfaceName;
    }

    return "any";
  }

  function buildInterface(obj, name) {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;

    let fields = [];
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const typeStr = getType(val, key);
      const isOptional = val === null || val === undefined;
      const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      fields.push(`  ${validKey}${isOptional ? "?" : ""}: ${typeStr};`);
    }

    const code = `export interface ${name} {\n${fields.join("\n")}\n}`;
    if (!interfaces.some((item) => item.name === name)) {
      interfaces.push({ name, code });
    }
  }

  if (Array.isArray(jsonObj)) {
    if (jsonObj.length > 0 && typeof jsonObj[0] === "object") {
      buildInterface(jsonObj[0], rootName);
    } else {
      return `export type ${rootName} = ${getType(jsonObj)};`;
    }
  } else if (typeof jsonObj === "object" && jsonObj !== null) {
    buildInterface(jsonObj, rootName);
  } else {
    return `export type ${rootName} = ${typeof jsonObj};`;
  }

  // Reverse so sub-interfaces appear before main RootObject
  return interfaces
    .reverse()
    .map((item) => item.code)
    .join("\n\n");
}

export default function JsonToTs() {
  const [jsonInput, setJsonInput] = useState("");
  const [tsOutput, setTsOutput] = useState("");
  const [rootName, setRootName] = useState("RootObject");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const sampleJson = JSON.stringify(
    {
      id: 101,
      name: "Alex Johnson",
      email: "alex@easy2convert.xyz",
      isVerified: true,
      roles: ["admin", "developer"],
      address: {
        street: "123 Web Tech Blvd",
        city: "San Francisco",
        zipCode: 94107,
      },
      projects: [
        {
          projectId: "p1",
          title: "Converter Hub",
          stars: 450,
        },
      ],
    },
    null,
    2
  );

  useEffect(() => {
    if (!jsonInput.trim()) {
      setTsOutput("");
      setErrorMsg("");
      return;
    }

    try {
      setErrorMsg("");
      const parsed = JSON.parse(jsonInput);
      const result = generateTypeScriptInterfaces(parsed, rootName || "RootObject");
      setTsOutput(result);
    } catch (err) {
      setErrorMsg(`JSON Syntax Error: ${err.message}`);
      setTsOutput("");
    }
  }, [jsonInput, rootName]);

  const handleCopy = () => {
    if (!tsOutput) return;
    navigator.clipboard.writeText(tsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setJsonInput("");
    setTsOutput("");
    setErrorMsg("");
  };

  const handleLoadSample = () => {
    setJsonInput(sampleJson);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950">
      {/* Header */}
      <Header currentPage="tools" />

      {/* Main Content Container */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-8">
        {/* Page Title Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            TypeScript Tool
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            JSON to TypeScript Interface Converter
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Paste raw JSON responses from REST or GraphQL APIs to instantly infer and generate valid TypeScript interfaces locally in your browser.
          </p>
        </div>

        {/* Root Interface Name & Control Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
              Root Interface Name:
            </label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9_$]/g, ""))}
              placeholder="RootObject"
              className="text-xs font-mono font-bold bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:outline-none px-3 py-1.5 rounded-lg text-slate-900 w-44"
            />
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto justify-end text-xs font-bold">
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
            >
              Load Sample API JSON
            </button>
            <button
              onClick={handleClear}
              className="px-3.5 py-2 bg-slate-100 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl transition-all"
            >
              Clear Editor
            </button>
          </div>
        </div>

        {/* Split Screen Editor Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Split Pane Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input JSON */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                  Raw JSON Input
                </label>
                <span className="text-[10px] font-semibold text-slate-400">
                  {jsonInput.length.toLocaleString()} characters
                </span>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste raw JSON here (e.g. { "id": 1, "name": "Item" })'
                className="w-full h-80 md:h-96 p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            {/* Output TypeScript */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                  Generated TypeScript Interfaces
                </label>
                {tsOutput && (
                  <button
                    onClick={handleCopy}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                  >
                    {copied ? "✓ Copied!" : "Copy Code"}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={tsOutput}
                placeholder="TypeScript interfaces will automatically generate here..."
                className="w-full h-80 md:h-96 p-4 text-xs font-mono bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Informative SEO Explanation Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
          <h2 className="text-base font-bold text-slate-900">
            Why Use Automatic JSON to TypeScript Interface Generation?
          </h2>
          <p>
            **TypeScript** brings static typing to JavaScript, catching runtime bugs during compilation. When integrating third-party REST APIs or GraphQL endpoints, manually writing TypeScript interfaces for complex JSON payloads is time-consuming and prone to typos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">Recursive Sub-Interface Extraction</h3>
              <p className="text-[11px] text-slate-500">
                Nested JSON objects are automatically parsed into separate `export interface` definitions, maintaining clean modular code architecture.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">100% Client-Side Privacy</h3>
              <p className="text-[11px] text-slate-500">
                Your API payload keys and sensitive backend structures are processed entirely in browser local memory without sending data over the network.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 font-bold">
              © {new Date().getFullYear()} easy2convert.xyz. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed max-w-md font-semibold">
              Secure client-side utilities. Local calculation models eliminate network latency and ensure complete data privacy.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-slate-500">
            <a href="/" className="hover:text-emerald-600 transition-colors">
              Converter
            </a>
            <a href="/calculators" className="hover:text-emerald-600 transition-colors">
              Calculators
            </a>
            <a href="/blog" className="hover:text-emerald-600 transition-colors">
              Blog
            </a>
            <a href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
