// import { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useNavigate } from "react-router-dom";

// export default function SignInModal({ onClose }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const { data, error: authError } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (authError) {
//       setError(authError.message);
//       return;
//     }

//     if (data.user) {
//       onClose();
//       navigate("/dashboard");
//     }
//   };

//   // Close modal if clicking the backdrop
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div onClick={handleBackdropClick} style={{
//       position: "fixed", inset: 0, zIndex: 999,
//       background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: "24px"
//     }}>
//       <div style={{
//         background: "#181818", border: "1px solid rgba(184,115,51,0.35)",
//         borderRadius: "18px", padding: "40px", width: "100%", maxWidth: "420px",
//         position: "relative",
//         boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.7)"
//       }}>
//         {/* Close button */}
//         <button onClick={onClose} style={{
//           position: "absolute", top: 16, right: 16,
//           background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
//           borderRadius: "6px", color: "#6B6560", cursor: "pointer",
//           width: 30, height: 30, fontSize: 16, display: "flex",
//           alignItems: "center", justifyContent: "center"
//         }}>×</button>

//         {/* Logo */}
//         <div style={{ marginBottom: 28, textAlign: "center" }}>
//           <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.3px", marginBottom: 6 }}>
//             <span style={{ color: "#B87333" }}>ACQ</span>
//             <span style={{ color: "#F2F0EB" }}>AR</span>
//             {" "}
//             <span style={{ color: "#6B6560", fontWeight: 500, fontSize: 14 }}>Signal</span>
//           </div>
//           <p style={{ fontSize: 13, color: "#B8B3A8", margin: 0 }}>
//             Sign in to access the terminal
//           </p>
//         </div>

//         <form onSubmit={handleSignIn}>
//           {/* Email */}
//           <div style={{ marginBottom: 16 }}>
//             <label style={{
//               display: "block", fontSize: 11, fontWeight: 700,
//               letterSpacing: "1px", textTransform: "uppercase",
//               color: "#6B6560", marginBottom: 8
//             }}>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//               style={{
//                 width: "100%", background: "#131313",
//                 border: "1px solid rgba(255,255,255,0.10)",
//                 borderRadius: "6px", padding: "11px 14px",
//                 fontSize: 14, color: "#F2F0EB", outline: "none",
//                 boxSizing: "border-box",
//                 transition: "border-color 0.2s"
//               }}
//               onFocus={e => e.target.style.borderColor = "rgba(184,115,51,0.6)"}
//               onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
//             />
//           </div>

//           {/* Password */}
//           <div style={{ marginBottom: 24 }}>
//             <label style={{
//               display: "block", fontSize: 11, fontWeight: 700,
//               letterSpacing: "1px", textTransform: "uppercase",
//               color: "#6B6560", marginBottom: 8
//             }}>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               style={{
//                 width: "100%", background: "#131313",
//                 border: "1px solid rgba(255,255,255,0.10)",
//                 borderRadius: "6px", padding: "11px 14px",
//                 fontSize: 14, color: "#F2F0EB", outline: "none",
//                 boxSizing: "border-box",
//                 transition: "border-color 0.2s"
//               }}
//               onFocus={e => e.target.style.borderColor = "rgba(184,115,51,0.6)"}
//               onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
//             />
//           </div>

//           {/* Error message */}
//           {error && (
//             <div style={{
//               background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
//               borderRadius: "6px", padding: "10px 14px",
//               fontSize: 13, color: "#EF4444", marginBottom: 16
//             }}>
//               {error}
//             </div>
//           )}

//           {/* Submit */}
//           <button type="submit" disabled={loading} style={{
//             width: "100%", background: loading ? "#8C5A25" : "#B87333",
//             border: "none", borderRadius: "8px",
//             padding: "13px", fontSize: 15, fontWeight: 700,
//             color: "#fff", cursor: loading ? "not-allowed" : "pointer",
//             transition: "background 0.2s",
//             boxShadow: "0 8px 32px rgba(184,115,51,0.25)"
//           }}>
//             {loading ? "Signing in..." : "Sign In → Access Terminal"}
//           </button>
//         </form>

//         <p style={{
//           fontSize: 11, color: "#6B6560", textAlign: "center",
//           marginTop: 20, lineHeight: 1.6
//         }}>
//           Access is by invitation only. Contact{" "}
//           <a href="https://www.acqar.com" target="_blank" rel="noreferrer"
//             style={{ color: "#B87333" }}>ACQAR</a>{" "}
//           to request an account.
//         </p>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// // import { supabase } from "../lib/supabase";
// import { useNavigate } from "react-router-dom";

// export default function SignInModal({ onClose }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // const handleSignIn = async (e) => {
//   //   e.preventDefault();
//   //   setError("");
//   //   setLoading(true);

//   //   const { data, error: authError } = await supabase.auth.signInWithPassword({
//   //     email,
//   //     password,
//   //   });

//   //   setLoading(false);

//   //   if (authError) {
//   //     setError(authError.message);
//   //     return;
//   //   }

//   //   if (data.user) {
//   //     onClose();
//   //     navigate("/dashboard");
//   //   }
//   // };

//   const handleSignIn = async (e) => {
//   e.preventDefault();
//   setError("");
//   setLoading(true);

//   // Hardcoded credentials check
//   if (email === "signal@acqar.com" && password === "acqar@123") {
//     setLoading(false);
//     onClose();
//     navigate("/dashboard");
//   } else {
//     setLoading(false);
//     setError("Invalid email or password.");
//   }
// };

//   // Close modal if clicking the backdrop
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div onClick={handleBackdropClick} style={{
//       position: "fixed", inset: 0, zIndex: 999,
//       background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: "24px"
//     }}>
//       <div style={{
//         background: "#181818", border: "1px solid rgba(184,115,51,0.35)",
//         borderRadius: "18px", padding: "40px", width: "100%", maxWidth: "420px",
//         position: "relative",
//         boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.7)"
//       }}>
//         {/* Close button */}
//         <button onClick={onClose} style={{
//           position: "absolute", top: 16, right: 16,
//           background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
//           borderRadius: "6px", color: "#6B6560", cursor: "pointer",
//           width: 30, height: 30, fontSize: 16, display: "flex",
//           alignItems: "center", justifyContent: "center"
//         }}>×</button>

//         {/* Logo */}
//         <div style={{ marginBottom: 28, textAlign: "center" }}>
//           <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.3px", marginBottom: 6 }}>
//             <span style={{ color: "#B87333" }}>ACQ</span>
//             <span style={{ color: "#F2F0EB" }}>AR</span>
//             {" "}
//             <span style={{ color: "#6B6560", fontWeight: 500, fontSize: 14 }}>Signal</span>
//           </div>
//           <p style={{ fontSize: 13, color: "#B8B3A8", margin: 0 }}>
//             Sign in to access the terminal
//           </p>
//         </div>

//         <form onSubmit={handleSignIn}>
//           {/* Email */}
//           <div style={{ marginBottom: 16 }}>
//             <label style={{
//               display: "block", fontSize: 11, fontWeight: 700,
//               letterSpacing: "1px", textTransform: "uppercase",
//               color: "#6B6560", marginBottom: 8
//             }}>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//               style={{
//                 width: "100%", background: "#131313",
//                 border: "1px solid rgba(255,255,255,0.10)",
//                 borderRadius: "6px", padding: "11px 14px",
//                 fontSize: 14, color: "#F2F0EB", outline: "none",
//                 boxSizing: "border-box",
//                 transition: "border-color 0.2s"
//               }}
//               onFocus={e => e.target.style.borderColor = "rgba(184,115,51,0.6)"}
//               onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
//             />
//           </div>

//           {/* Password */}
//           <div style={{ marginBottom: 24 }}>
//             <label style={{
//               display: "block", fontSize: 11, fontWeight: 700,
//               letterSpacing: "1px", textTransform: "uppercase",
//               color: "#6B6560", marginBottom: 8
//             }}>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               style={{
//                 width: "100%", background: "#131313",
//                 border: "1px solid rgba(255,255,255,0.10)",
//                 borderRadius: "6px", padding: "11px 14px",
//                 fontSize: 14, color: "#F2F0EB", outline: "none",
//                 boxSizing: "border-box",
//                 transition: "border-color 0.2s"
//               }}
//               onFocus={e => e.target.style.borderColor = "rgba(184,115,51,0.6)"}
//               onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
//             />
//           </div>

//           {/* Error message */}
//           {error && (
//             <div style={{
//               background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
//               borderRadius: "6px", padding: "10px 14px",
//               fontSize: 13, color: "#EF4444", marginBottom: 16
//             }}>
//               {error}
//             </div>
//           )}

//           {/* Submit */}
//           <button type="submit" disabled={loading} style={{
//             width: "100%", background: loading ? "#8C5A25" : "#B87333",
//             border: "none", borderRadius: "8px",
//             padding: "13px", fontSize: 15, fontWeight: 700,
//             color: "#fff", cursor: loading ? "not-allowed" : "pointer",
//             transition: "background 0.2s",
//             boxShadow: "0 8px 32px rgba(184,115,51,0.25)"
//           }}>
//             {loading ? "Signing in..." : "Sign In → Access Terminal"}
//           </button>
//         </form>

//         <p style={{
//           fontSize: 11, color: "#6B6560", textAlign: "center",
//           marginTop: 20, lineHeight: 1.6
//         }}>
//           Access is by invitation only. Contact{" "}
//           <a href="https://www.acqar.com" target="_blank" rel="noreferrer"
//             style={{ color: "#B87333" }}>ACQAR</a>{" "}
//           to request an account.
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    // ✅ FIX 1: trim() removes spaces mobile keyboard adds
    // ✅ FIX 2: toLowerCase() handles capital letters from autocorrect
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === "signal@acqar.com" && cleanPassword === "acqar@123") {
      setLoading(true);
      onClose();
      // ✅ FIX 3: window.location.href as fallback if navigate() fails on mobile
      try {
        navigate("/dashboard");
      } catch {
        window.location.href = "/dashboard";
      }
    } else {
      if (cleanEmail !== "signal@acqar.com") {
        setError("Incorrect email address.");
      } else {
        setError("Incorrect password.");
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", touchAction: "manipulation",
      }}
    >
      <div style={{
        background: "#181818", border: "1px solid rgba(184,115,51,0.35)",
        borderRadius: "18px", padding: "40px", width: "100%", maxWidth: "420px",
        position: "relative",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.7)",
      }}>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px", color: "#6B6560", cursor: "pointer",
          width: 30, height: 30, fontSize: 16, display: "flex",
          alignItems: "center", justifyContent: "center",
          touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
        }}>×</button>

        {/* Logo */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.3px", marginBottom: 6 }}>
            <span style={{ color: "#B87333" }}>ACQ</span>
            <span style={{ color: "#F2F0EB" }}>AR</span>
            {" "}
            <span style={{ color: "#6B6560", fontWeight: 500, fontSize: 14 }}>Signal</span>
          </div>
          <p style={{ fontSize: 13, color: "#B8B3A8", margin: 0 }}>
            Sign in to access the terminal
          </p>
        </div>

        <form onSubmit={handleSignIn}>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              letterSpacing: "1px", textTransform: "uppercase",
              color: "#6B6560", marginBottom: 8,
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="signal@acqar.com"
              required
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              style={{
                width: "100%", background: "#131313",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "6px", padding: "11px 14px",
                fontSize: 14, color: "#F2F0EB", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(184,115,51,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              letterSpacing: "1px", textTransform: "uppercase",
              color: "#6B6560", marginBottom: 8,
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              style={{
                width: "100%", background: "#131313",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "6px", padding: "11px 14px",
                fontSize: 14, color: "#F2F0EB", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(184,115,51,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "6px", padding: "10px 14px",
              fontSize: 13, color: "#EF4444", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", background: loading ? "#8C5A25" : "#B87333",
              border: "none", borderRadius: "8px",
              padding: "13px", fontSize: 15, fontWeight: 700,
              color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              boxShadow: "0 8px 32px rgba(184,115,51,0.25)",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {loading ? "Signing in..." : "Sign In → Access Terminal"}
          </button>
        </form>

        <p style={{
          fontSize: 11, color: "#6B6560", textAlign: "center",
          marginTop: 20, lineHeight: 1.6,
        }}>
          Access is by invitation only. Contact{" "}
          <a href="https://www.acqar.com" target="_blank" rel="noreferrer"
            style={{ color: "#B87333", touchAction: "manipulation" }}>ACQAR</a>{" "}
          to request an account.
        </p>
      </div>
    </div>
  );
}
