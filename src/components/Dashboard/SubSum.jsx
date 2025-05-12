import { useState, useEffect } from "react";

export default function ({ label, emoji, data }) {
  return (
    <li className="basis-1/4 p-4 flex justify-between items-center border border-gray-400 rounded m-0.5 hover:bg-gray-300">
      <span className="font-bold">{emoji}</span>
      <span className="font-bold">{label}</span>
      <span className="ml-2 font-bold">{data.toLocaleString()}</span>
    </li>
  );
}
