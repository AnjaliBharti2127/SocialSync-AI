// import React, { useEffect, useState } from 'react'
// import {  PLATFORMS, type Platform } from '../assets/assets'
// import {
//   ArrowRightIcon,
//   CalendarSearchIcon,
//   CheckIcon,
//   ClockIcon,
//   HistoryIcon,
//   ImageIcon,
//   Loader2Icon,
//   SparklesIcon,
//   TimerIcon,
//   XIcon,
// } from 'lucide-react'
// import api from '../api/axios'
// import toast from 'react-hot-toast'
// import { platform } from 'os'

// type Generation = {
//   _id: string
//   createdAt: string | Date
//   tone: string
//   content: string
//   mediaUrl?: string
//   prompt?: string
// }

// const TONES = ['Professional', 'Creative', 'Funny', 'Minimalist', 'Excited']

// // Single flat accent used for every primary/active state on this page —
// // keeps Generate, Schedule, active tone, and active platform all reading
// // as "the same kind of action" instead of competing colors.
// const ACCENT = '#8E7CFF'
// const ACCENT_HOVER = '#7C68F0'

// const AIComposer = () => {
//   const [prompt, setPrompt] = useState('')
//   const [tone, setTone] = useState('Professional')
//   const [generateImage, setGenerateImage] = useState(true)
//   const [loading, setLoading] = useState(false)
//   const [generations, setGenerations] = useState<Generation[]>(dummyGenerationData)

//   const [activeScheduler, setActiveScheduler] = useState<Generation | null>(null)
//   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
//   const [scheduledDate, setScheduledDate] = useState('')
//   const [scheduledTime, setScheduledTime] = useState('')
//   const [scheduling, setScheduling] = useState(false)

//   const closeScheduler = () => {
//     setActiveScheduler(null)
//     setSelectedPlatforms([])
//     setScheduledDate('')
//     setScheduledTime('')
//   }

//   const fetchGenerations = async ()=>{
//     try{
//       const {data} = await api.get("api/posts/generations")
//       setGenerations(data);
//     }catch(error: any){
//       toast.error(error?.response?.data?.message || error?.message);

//     }
//   }

//   useEffect(()=>{
//     fetchGenerations()
//   },[])

//   const handleGenerate = async () => {
//     if (!prompt){
//       toast.error("Please enter a prompt");
//       return;
//     }
//     setLoading(true)
//     try{
//       const {data } = await api.post("/api/posts/generate", {prompt,tone, generateImage});
//       setGenerations([data, ...generations])
//       toast.success("Content generated!")
//     }catch(error: any){
//       toast.error(error?.response?.data?.messgae);
//     }finally{
//       setLoading(false)
//     }
//   }

//   const handleSchedule = async ()=>{
//     if(!activeScheduler)return;
//     if(selectedPlatforms.length === 0){
//       toast.error("select at least one platform");
//       return;
//     }
//     if(!scheduledDate || !scheduledTime){
//       toast.error("Select date and time");
//       return;
//     }
//   }

//   const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
//   setScheduling(true);
//    try{
//         await api.post("/api/posts", 
//            {Content: activeScheduler.content,
//             mediaUrl: activeScheduler.mediaUrl,
//             mediaType: activeScheduler.mediaType,
//             platform: selectedPlatforms,
//             scheduledFor,
//             status: "scheduled",

//            })
//         toast.success("AI POST scheduled");
//         setActiveScheduler(null);
//         setScheduledDate("");
//         setScheduledTime("");
//         setSelectedPlatforms([]);
    
  
//       }catch (error:any){
//         toast.error(error?.response?.data?.message || "Failed to Scheduled");
  
//       }finally{
//         setLoading(false)
//       }
//     }

//   const togglePlatform = (id: string) => {
//     setSelectedPlatforms((prev) =>
//       prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
//     )
//   }

//   return (
//     <>
//       <div className="max-w-4xl mx-auto space-y-14 pb-24 px-4 animate-in fade-in duration-700 text-slate-200">
//         {/* Input Section */}
//         <div className="space-y-6 text-center mt-16">
//           <div
//             className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-white/[0.06]"
//             style={{ color: ACCENT }}
//           >
//             <SparklesIcon className="size-3.5" />
//             AI Composer
//           </div>

//           <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
//             What should we create today?
//           </h1>
//           <p className="text-slate-500 text-sm">
//             Describe the post — we'll write the copy and, if you want, the image to go with it.
//           </p>

//           <div className="relative group mt-10 text-left">
//             <textarea
//               placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               className="w-full min-h-[180px] rounded-2xl bg-white/[0.05] p-5 pb-16 text-sm text-slate-200 placeholder:text-slate-500 outline-none resize-none transition-shadow focus:ring-2 focus:ring-[#8E7CFF]/40"
//             />

//             <div className="absolute bottom-4 left-5 right-4 flex items-center justify-between gap-3 text-sm">
//               <button
//                 type="button"
//                 onClick={() => setGenerateImage(!generateImage)}
//                 className="flex items-center gap-2 text-slate-400"
//               >
//                 <ImageIcon className="size-4" />
//                 <span>AI Images</span>

//                 <div
//                   className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
//                   style={{ backgroundColor: generateImage ? ACCENT : 'rgba(255,255,255,0.15)' }}
//                 >
//                   <span
//                     className={`pointer-events-none absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
//                       generateImage ? 'translate-x-4' : 'translate-x-0.5'
//                     }`}
//                   />
//                 </div>
//               </button>

//               <button
//                 onClick={handleGenerate}
//                 disabled={loading || !prompt.trim()}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:bg-white/[0.08] disabled:text-slate-500 disabled:cursor-not-allowed"
//                 style={!loading && prompt.trim() ? { backgroundColor: ACCENT } : undefined}
//                 onMouseEnter={(e) => {
//                   if (!loading && prompt.trim()) e.currentTarget.style.backgroundColor = ACCENT_HOVER
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!loading && prompt.trim()) e.currentTarget.style.backgroundColor = ACCENT
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2Icon className="size-4 animate-spin" />
//                     <span>Generating...</span>
//                   </>
//                 ) : (
//                   <>
//                     Generate
//                     <ArrowRightIcon className="size-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center justify-center gap-2">
//             {TONES.map((t) => {
//               const active = tone === t
//               return (
//                 <button
//                   key={t}
//                   onClick={() => setTone(t)}
//                   className="px-4 py-1.5 rounded-full text-sm transition-colors"
//                   style={
//                     active
//                       ? { backgroundColor: ACCENT, color: 'white' }
//                       : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8' }
//                   }
//                 >
//                   {t}
//                 </button>
//               )
//             })}
//           </div>
//         </div>

//         {/* AI Generated Posts */}
//         <div className="space-y-6 pt-12 border-t border-white/[0.06]">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-slate-100">
//               <HistoryIcon className="size-5" />
//               <h2 className="text-xl font-semibold">Recent Generations</h2>
//             </div>
//             <span className="text-sm text-slate-500">{generations.length} total</span>
//           </div>

//           {generations.length === 0 ? (
//             <div className="text-center py-16 border border-dashed border-white/[0.12] rounded-2xl text-slate-500 text-sm">
//               Nothing generated yet — write a prompt above to get started.
//             </div>
//           ) : (
//             <div className="grid gap-4 md:grid-cols-2">
//               {generations.map((gen) => (
//                 <div
//                   key={gen._id}
//                   className="group bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-all"
//                 >
//                   <div className="flex flex-col h-full space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs text-slate-500 uppercase tracking-widest">
//                         {new Date(gen.createdAt).toLocaleString()}
//                       </span>
//                       <span
//                         className="text-xs px-2 py-0.5 rounded-md bg-white/[0.06]"
//                         style={{ color: ACCENT }}
//                       >
//                         {gen.tone}
//                       </span>
//                     </div>

//                     <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed flex-1">
//                       {gen.content}
//                     </p>

//                     {gen.mediaUrl && (
//                       <img
//                         src={gen.mediaUrl}
//                         alt="Generated visual"
//                         className="w-full aspect-video object-cover rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"
//                       />
//                     )}

//                     <div className="flex items-center justify-end gap-2 pt-2">
//                       <button
//                         type="button"
//                         onClick={() => setActiveScheduler(gen)}
//                         className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
//                         style={{ backgroundColor: ACCENT }}
//                         onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT_HOVER)}
//                         onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
//                       >
//                         <TimerIcon className="size-3.5" />
//                         Schedule
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Schedule Modal */}
//       {activeScheduler && (
//         <div
//           className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
//           onClick={closeScheduler}
//         >
//           <div
//             className="bg-[#0A0D16] rounded-xl shadow-2xl w-full max-w-2xl border border-white/[0.06] overflow-hidden flex flex-col max-h-[90vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
//               <h3 className="text-slate-100 font-semibold text-lg">Schedule Post</h3>
//               <button
//                 onClick={closeScheduler}
//                 className="p-2 rounded-full hover:bg-white/[0.08] text-slate-400 transition-colors"
//               >
//                 <XIcon className="size-5" />
//               </button>
//             </div>

//             <div className="p-5 space-y-4 overflow-y-auto">
//               <div className="bg-white/[0.04] rounded-xl p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-slate-500 uppercase tracking-widest">
//                     {new Date(activeScheduler.createdAt).toLocaleString()}
//                   </span>
//                   <span
//                     className="text-xs px-2 py-0.5 rounded-md bg-white/[0.06]"
//                     style={{ color: ACCENT }}
//                   >
//                     {activeScheduler.tone}
//                   </span>
//                 </div>
//                 <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
//                   {activeScheduler.content}
//                 </p>
//               </div>

//               {activeScheduler.mediaUrl && (
//                 <img
//                   src={activeScheduler.mediaUrl}
//                   alt="Scheduled content"
//                   className="w-full aspect-video object-cover rounded-lg"
//                 />
//               )}
//             </div>

//             {/* Footer: channels, date/time, submit — each a distinct block, none nested inside another */}
//             <div className="p-5 bg-white/[0.02] border-t border-white/[0.06] space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest">
//                   Post to
//                 </label>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   {PLATFORMS.map((p: Platform) => {
//                     const active = selectedPlatforms.includes(p.id)
//                     return (
//                       <button
//                         key={p.id}
//                         type="button"
//                         onClick={() => togglePlatform(p.id)}
//                         className="p-2 rounded-lg transition-colors"
//                         style={
//                           active
//                             ? { backgroundColor: ACCENT, color: 'white' }
//                             : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }
//                         }
//                         aria-pressed={active}
//                         aria-label={p.name ?? p.id}
//                       >
//                         <p.icon className="size-5" />
//                       </button>
//                     )
//                   })}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1.5">
//                   <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest">
//                     Date
//                   </label>
//                   <div className="relative">
//                     <CalendarSearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//                     <input
//                       type="date"
//                       value={scheduledDate}
//                       onChange={(e) => setScheduledDate(e.target.value)}
//                       min={new Date().toISOString().split('T')[0]}
//                       className="w-full bg-white/[0.05] text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none transition-shadow focus:ring-2 focus:ring-[#8E7CFF]/40 [color-scheme:dark]"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest">
//                     Time
//                   </label>
//                   <div className="relative">
//                     <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//                     <input
//                       type="time"
//                       value={scheduledTime}
//                       onChange={(e) => setScheduledTime(e.target.value)}
//                       className="w-full bg-white/[0.05] text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none transition-shadow focus:ring-2 focus:ring-[#8E7CFF]/40 [color-scheme:dark]"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSchedule}
//                 disabled={!canSchedule || scheduling}
//                 className="w-full flex items-center justify-center gap-2 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:bg-white/[0.08] disabled:text-slate-500 disabled:cursor-not-allowed"
//                 style={canSchedule && !scheduling ? { backgroundColor: ACCENT } : undefined}
//                 onMouseEnter={(e) => {
//                   if (canSchedule && !scheduling) e.currentTarget.style.backgroundColor = ACCENT_HOVER
//                 }}
//                 onMouseLeave={(e) => {
//                   if (canSchedule && !scheduling) e.currentTarget.style.backgroundColor = ACCENT
//                 }}
//               >
//                 {scheduling ? (
//                   <>
//                     <Loader2Icon className="size-4 animate-spin" />
//                     Scheduling...
//                   </>
//                 ) : (
//                   <>
//                     <CheckIcon className="size-4" />
//                     Schedule Post
//                   </>
//                 )}
//               </button>
//               {!canSchedule && (
//                 <p className="text-xs text-slate-500 text-center">
//                   Pick at least one channel and a date & time to continue.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default AIComposer
import React, { useEffect, useState } from 'react'
import { dummyGenerationData, PLATFORMS, type Platform } from '../assets/assets'
import {
  ArrowRightIcon,
  CalendarSearchIcon,
  CheckIcon,
  ClockIcon,
  HistoryIcon,
  ImageIcon,
  Loader2Icon,
  SparklesIcon,
  TimerIcon,
  XIcon,
} from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

type Generation = {
  _id: string
  createdAt: string | Date
  tone: string
  content: string
  mediaUrl?: string
  mediaType?: string
  prompt?: string
}

const TONES = ['Professional', 'Creative', 'Funny', 'Minimalist', 'Excited']

// Single flat accent used for every primary/active state on this page —
// keeps Generate, Schedule, active tone, and active platform all reading
// as "the same kind of action" instead of competing colors.
const ACCENT = '#8E7CFF'
const ACCENT_HOVER = '#7C68F0'

const AIComposer = () => {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('Professional')
  const [generateImage, setGenerateImage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generations, setGenerations] = useState<Generation[]>(dummyGenerationData)

  const [activeScheduler, setActiveScheduler] = useState<Generation | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [scheduling, setScheduling] = useState(false)

  const closeScheduler = () => {
    setActiveScheduler(null)
    setSelectedPlatforms([])
    setScheduledDate('')
    setScheduledTime('')
  }

  const fetchGenerations = async ()=>{
    try{
      const {data} = await api.get("/api/posts/generations")
      setGenerations(data);
    }catch(error: any){
      toast.error(error?.response?.data?.message || error?.message);

    }
  }

  useEffect(()=>{
    fetchGenerations()
  },[])

  const handleGenerate = async () => {
    if (!prompt){
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true)
    try{
      const {data } = await api.post("/api/posts/generate", {prompt,tone, generateImage});
      setGenerations([data, ...generations])
      toast.success("Content generated!")
    }catch(error: any){
      toast.error(error?.response?.data?.message || error?.message);
    }finally{
      setLoading(false)
    }
  }

  const canSchedule =
    selectedPlatforms.length > 0 &&
    Boolean(scheduledDate) &&
    Boolean(scheduledTime)

  const handleSchedule = async ()=>{
    if(!activeScheduler)return;
    if(selectedPlatforms.length === 0){
      toast.error("select at least one platform");
      return;
    }
    if(!scheduledDate || !scheduledTime){
      toast.error("Select date and time");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
    setScheduling(true);
    try{
      await api.post("/api/posts",
        {
          content: activeScheduler.content,
          mediaUrl: activeScheduler.mediaUrl,
          mediaType: activeScheduler.mediaType,
          platforms: selectedPlatforms,
          scheduledFor,
          status: "scheduled",
        })
      toast.success("AI POST scheduled");
      setActiveScheduler(null);
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);

    }catch (error:any){
      toast.error(error?.response?.data?.message || "Failed to Schedule");

    }finally{
      setScheduling(false)
    }
  }

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-14 pb-24 px-4 animate-in fade-in duration-700 text-slate-200">
        {/* Input Section */}
        <div className="space-y-6 text-center mt-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-white/[0.06]"
            style={{ color: ACCENT }}
          >
            <SparklesIcon className="size-3.5" />
            AI Composer
          </div>

          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
            What should we create today?
          </h1>
          <p className="text-slate-500 text-sm">
            Describe the post — we'll write the copy and, if you want, the image to go with it.
          </p>

          <div className="relative group mt-10 text-left">
            <textarea
              placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-[180px] rounded-2xl bg-white/[0.05] p-5 pb-16 text-sm text-slate-200 placeholder:text-slate-500 outline-none resize-none transition-shadow focus:ring-2 focus:ring-[#8E7CFF]/40"
            />

            <div className="absolute bottom-4 left-5 right-4 flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => setGenerateImage(!generateImage)}
                className="flex items-center gap-2 text-slate-400"
              >
                <ImageIcon className="size-4" />
                <span>AI Images</span>

                <div
                  className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
                  style={{ backgroundColor: generateImage ? ACCENT : 'rgba(255,255,255,0.15)' }}
                >
                  <span
                    className={`pointer-events-none absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
                      generateImage ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:bg-white/[0.08] disabled:text-slate-500 disabled:cursor-not-allowed"
                style={!loading && prompt.trim() ? { backgroundColor: ACCENT } : undefined}
                onMouseEnter={(e) => {
                  if (!loading && prompt.trim()) e.currentTarget.style.backgroundColor = ACCENT_HOVER
                }}
                onMouseLeave={(e) => {
                  if (!loading && prompt.trim()) e.currentTarget.style.backgroundColor = ACCENT
                }}
              >
                {loading ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowRightIcon className="size-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {TONES.map((t) => {
              const active = tone === t
              return (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className="px-4 py-1.5 rounded-full text-sm transition-colors"
                  style={
                    active
                      ? { backgroundColor: ACCENT, color: 'white' }
                      : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8' }
                  }
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* AI Generated Posts */}
        <div className="space-y-6 pt-12 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-100">
              <HistoryIcon className="size-5" />
              <h2 className="text-xl font-semibold">Recent Generations</h2>
            </div>
            <span className="text-sm text-slate-500">{generations.length} total</span>
          </div>

          {generations.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/[0.12] rounded-2xl text-slate-500 text-sm">
              Nothing generated yet — write a prompt above to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {generations.map((gen) => (
                <div
                  key={gen._id}
                  className="group bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex flex-col h-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 uppercase tracking-widest">
                        {new Date(gen.createdAt).toLocaleString()}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-md bg-white/[0.06]"
                        style={{ color: ACCENT }}
                      >
                        {gen.tone}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed flex-1">
                      {gen.content}
                    </p>

                    {gen.mediaUrl && (
                      <img
                        src={gen.mediaUrl}
                        alt="Generated visual"
                        className="w-full aspect-video object-cover rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveScheduler(gen)}
                        className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                        style={{ backgroundColor: ACCENT }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT_HOVER)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                      >
                        <TimerIcon className="size-3.5" />
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {activeScheduler && (
        <div
          className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={closeScheduler}
        >
          <div
            className="bg-[#0A0D16] rounded-xl shadow-2xl w-full max-w-2xl border border-white/[0.06] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-slate-100 font-semibold text-lg">Schedule Post</h3>
              <button
                onClick={closeScheduler}
                className="p-2 rounded-full hover:bg-white/[0.08] text-slate-400 transition-colors"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="bg-white/[0.04] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 uppercase tracking-widest">
                    {new Date(activeScheduler.createdAt).toLocaleString()}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md bg-white/[0.06]"
                    style={{ color: ACCENT }}
                  >
                    {activeScheduler.tone}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {activeScheduler.content}
                </p>
              </div>

              {activeScheduler.mediaUrl && (
                <img
                  src={activeScheduler.mediaUrl}
                  alt="Scheduled content"
                  className="w-full aspect-video object-cover rounded-lg"
                />
              )}
            </div>

            {/* Footer: channels, date/time, submit — each a distinct block, none nested inside another */}
            <div className="p-5 bg-white/[0.02] border-t border-white/[0.06] space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest">
                  Post to
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PLATFORMS.map((p: Platform) => {
                    const active = selectedPlatforms.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(p.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={
                          active
                            ? { backgroundColor: ACCENT, color: 'white' }
                            : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }
                        }
                        aria-pressed={active}
                        aria-label={p.name ?? p.id}
                      >
                        <p.icon className="size-5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest">
                    Date
                  </label>
                  <div className="relative">
                    <CalendarSearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/[0.05] text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none transition-shadow focus:ring-2 focus:ring-[#8E7CFF]/40 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest">
                    Time
                  </label>
                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-white/[0.05] text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none transition-shadow focus:ring-2 focus:ring-[#8E7CFF]/40 [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSchedule}
                disabled={!canSchedule || scheduling}
                className="w-full flex items-center justify-center gap-2 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:bg-white/[0.08] disabled:text-slate-500 disabled:cursor-not-allowed"
                style={canSchedule && !scheduling ? { backgroundColor: ACCENT } : undefined}
                onMouseEnter={(e) => {
                  if (canSchedule && !scheduling) e.currentTarget.style.backgroundColor = ACCENT_HOVER
                }}
                onMouseLeave={(e) => {
                  if (canSchedule && !scheduling) e.currentTarget.style.backgroundColor = ACCENT
                }}
              >
                {scheduling ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CheckIcon className="size-4" />
                    Schedule Post
                  </>
                )}
              </button>
              {!canSchedule && (
                <p className="text-xs text-slate-500 text-center">
                  Pick at least one channel and a date & time to continue.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AIComposer