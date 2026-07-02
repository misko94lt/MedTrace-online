/* MedTrace v3.0 — entry Vite.
   Espone gli stessi global che prima arrivavano dai CDN,
   poi carica app.js INVARIATO. */
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

window.React = React;
window.ReactDOM = ReactDOMClient;        // app.js usa solo ReactDOM.createRoot
window.supabase = { createClient };      // app.js usa solo window.supabase.createClient

import("./app.js");
