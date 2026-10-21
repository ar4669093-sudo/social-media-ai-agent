'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Post = { id: string; title: string; body: string; platforms: string[]; status: string; scheduled_at: string | null; created_at: string };

export default function Home() {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState("user");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["youtube"]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("पहले लॉगिन या साइन अप करें।");

  async function refresh() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setUser(null); setPosts([]); return; }
    setUser(auth.user.email ?? auth.user.id);
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", auth.user.id).maybeSingle();
    setRole(profile?.role ?? "user");
    const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(30);
    if (error) setMessage(error.message); else setPosts((data ?? []) as Post[]);
  }

  useEffect(() => { refresh(); const { data } = supabase.auth.onAuthStateChange(() => { setTimeout(() => refresh(), 0); }); return () => data.subscription.unsubscribe(); }, [supabase]);

  async function auth(mode: "signin" | "signup") {
    setMessage("");
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setMessage(result.error.message);
    else setMessage(mode === "signup" ? "साइन अप अनुरोध भेजा गया। Email confirmation चालू हो तो inbox देखें।" : "लॉगिन अनुरोध पूरा हुआ।");
    await refresh();
  }

  async function signout() { await supabase.auth.signOut(); setMessage("लॉगआउट हो गया।"); await refresh(); }

  function togglePlatform(p: string) {
    setPlatforms(old => old.includes(p) ? old.filter(x => x !== p) : [...old, p]);
  }

  async function savePost() {
    if (!title.trim() || !body.trim() || platforms.length === 0) { setMessage("शीर्षक, कंटेंट और कम-से-कम एक प्लेटफॉर्म चुनें।"); return; }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setMessage("पहले लॉगिन करें।"); return; }
    const { error } = await supabase.from("posts").insert({
      user_id: auth.user.id, title, body, platforms,
      status: scheduledAt ? "scheduled" : "draft",
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null
    });
    if (error) setMessage(error.message);
    else { setMessage("पोस्ट डेटाबेस में सेव हुई। ध्यान दें: अभी यह केवल draft/schedule record है, वास्तविक publish नहीं।"); setTitle(""); setBody(""); setScheduledAt(""); await refresh(); }
  }

  function makeCaption() {
    const t = title.trim() || "आपका नया कंटेंट";
    setBody(`${t}\\n\\nइस पोस्ट में आपको क्या लगता है? अपनी राय कमेंट करें।\\n\\n#${t.replace(/[^\\p{L}\\p{N} ]/gu, "").split(/\\s+/).filter(Boolean).slice(0,3).join("")} #ContentCreator`);
    setMessage("डेमो कैप्शन बनाया गया। यह वास्तविक AI model से generate नहीं हुआ है।");
  }

  return <main>
    <header>
      <h1>Social Media AI Agent</h1>
      <div className="sub">YouTube · Instagram · Facebook — कंटेंट, ड्राफ्ट और पोस्ट कैलेंडर</div>
    </header>
    <section className="panel">
      <h2>1. Login / Signup</h2>
      {user ? <><p>लॉगिन: <b>{user}</b> · Role: <b>{role}</b></p><button onClick={signout}>Logout</button></> :
      <>
        <label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/>
        <label>Password (कम-से-कम 8 characters रखें)</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"/>
        <div className="row"><button onClick={() => auth("signin")}>Login</button><button className="secondary" onClick={() => auth("signup")}>Sign up</button></div>
      </>}
    </section>
    <section className="panel">
      <h2>2. नया पोस्ट ड्राफ्ट</h2>
      {!user && <p className="notice">पोस्ट सेव करने के लिए पहले लॉगिन करें।</p>}
      <label>पोस्ट का शीर्षक</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="जैसे: आज के 3 AI Tools"/>
      <label>कंटेंट / कैप्शन</label><textarea value={body} onChange={e => setBody(e.target.value)} placeholder="अपना कैप्शन लिखें..."/>
      <button className="secondary" onClick={makeCaption}>डेमो कैप्शन बनाएं</button>
      <label>प्लेटफॉर्म</label>
      <div className="row">{[["youtube","YouTube"],["instagram","Instagram"],["facebook","Facebook"]].map(([id,name]) => <label key={id}><input type="checkbox" checked={platforms.includes(id)} onChange={() => togglePlatform(id)} style={{width:"auto",marginRight:8}}/>{name}</label>)}</div>
      <label>Schedule time (optional)</label><input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}/>
      <button onClick={savePost} disabled={!user}>Draft / Schedule सेव करें</button>
    </section>
    <section className="panel">
      <h2>3. आपकी पोस्ट</h2>
      {!user ? <p>लॉगिन के बाद आपकी पोस्ट यहाँ दिखेंगी।</p> : posts.length === 0 ? <p>अभी कोई पोस्ट नहीं है।</p> : posts.map(p => <div className="post" key={p.id}>
        <b>{p.title}</b><p>{p.body}</p><small>{p.platforms.join(", ")} · {p.status} · {p.scheduled_at ? new Date(p.scheduled_at).toLocaleString() : "No schedule"}</small>
      </div>)}
    </section>
    <section className="panel">
      <h2>4. Admin / API स्थिति</h2>
      {role === "admin" ? <p>आपका database role admin है। Admin API/कनेक्शन सेटअप इस starter में अभी लागू नहीं है।</p> : <p>Admin tools केवल database में admin role मिलने पर दिखेंगे।</p>}
      <p className="notice">महत्वपूर्ण: यह starter अपने-आप सोशल मीडिया पर पोस्ट नहीं करता। असली auto-publishing के लिए आधिकारिक OAuth/API setup और background scheduler जोड़ना जरूरी है।</p>
      <p className="muted">{message}</p>
    </section>
  </main>;
}
