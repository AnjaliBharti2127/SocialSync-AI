// import React, { useEffect, useState } from 'react'
// import { dummyPostsData, PLATFORMS } from '../assets/assets'
// import {
//   ArrowRightIcon,
//   CalendarDaysIcon,
//   Clock3Icon,
//   ImagePlusIcon,
//   SendIcon,
//   XIcon,
// } from 'lucide-react'
// import api from '../api/axios'
// import toast from 'react-hot-toast'

// interface Post {
//   _id: string
//   content: string
//   platforms: string[]
//   scheduledFor?: string
//   status: 'scheduled' | 'published'
//   createdAt: string
//   updatedAt: string
//   mediaUrl?: string
//   mediaType?: string
// }

// const CHAR_LIMIT = 280

// const Schedule = () => {
//   const [posts, setPosts] = useState<Post[]>(dummyPostsData as Post[])
//   const [content, setContent] = useState('')
//   const [scheduledDate, setScheduledDate] = useState('')
//   const [scheduledTime, setScheduledTime] = useState('')
//   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
//   const [mediaFile, setMediaFile] = useState<File | null>(null)
//   const [loading, setLoading] = useState(false)

//   const fetchPosts = async () =>{
//     try{
//       const {data} = await api.get("/api/posts")
//       setPosts(data)
//     }
//     catch(error: any){
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   }

//   useEffect(()=>{
//     (async ()=> await fetchPosts())();
//     const interval = setInterval(async ()=> await fetchPosts(), 10000);
//     return ()=> clearInterval(interval)
//   },[])


//   const scheduled = posts.filter((p) => p.status === 'scheduled')
//   const published = posts.filter((p) => p.status === 'published')

//   const togglePlatform = (id: string) =>
//     setSelectedPlatforms((prev) =>
//       prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
//     )

//   const canSubmit =
//     content.trim().length > 0 &&
//     selectedPlatforms.length > 0 &&
//     scheduledDate &&
//     scheduledTime &&
//     !loading

//   const handleSchedule = (e: React.FormEvent) => {
//     e.preventDefault()
//     if(selectedPlatforms.length === 0){
//       toast.error("select at least one platform");
//       return;
//     }
//     if(!scheduledDate || !scheduledTime){
//       toast.error("Select date and time");
//       return;
//     }
//     if(!selectedPlatforms.includes('instagram') && !mediaFile){
//       toast.error("Instagram required an image or video");
//       return;
//     }

//     const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
//     const formDate = new FormData();
//     formDate.append("content",content);
//     formDate.append("scheduledFor", scheduledFor);
//     formDate.append("status", "scheduled");
//     formDate.append("platform", JSON.stringify(selectedPlatforms));
//     if(mediaFile) formDate.append("media", mediaFile);

//     setLoading(true)
//     try{
//       await api.post("/api/post", FormData, {headers: {"Content-Type": "multipart/form-data"}})
//       toast.success("POST scheduled");
//       setContent("");
//       setScheduledDate("");
//       setScheduledTime("");
//       setSelectedPlatforms([]);
//       setMediaFile(null);
//       fetchPosts();

//     }catch (error:any){
//       toast.error(error?.response?.data?.message || error.message);

//     }finally{
//       setLoading(false)
//     }


//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 h-full bg-[#05070D] p-1 text-slate-200">
//       {/* Composer */}
//       <div className="w-full lg:max-w-md lg:sticky lg:top-6 lg:self-start">
//         <div className="bg-white/[0.035] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 shadow-[0_0_40px_-15px_rgba(79,127,255,0.2)]">
//           <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
//             Compose Post
//           </h2>
//           <p className="text-sm text-slate-500 mt-1">
//             Say something the algorithm can't ignore.
//           </p>

//           <form className="space-y-6 mt-6" onSubmit={handleSchedule}>
//             {/* Platforms */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
//                 Where's this going live?
//               </label>

//               <div className="flex flex-wrap gap-3">
//                 {PLATFORMS.map((p) => {
//                   const active = selectedPlatforms.includes(p.id)
//                   return (
//                     <button
//                       key={p.id}
//                       type="button"
//                       onClick={() => togglePlatform(p.id)}
//                       aria-pressed={active}
//                       aria-label={p.name}
//                       className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 ${
//                         active
//                           ? 'bg-cyan-400/15 ring-1 ring-cyan-400/50 shadow-[0_0_16px_-2px_rgba(34,211,238,0.5)]'
//                           : 'bg-white/[0.06] hover:bg-white/[0.1]'
//                       }`}
//                     >
//                       <p.icon
//                         className={`w-5 h-5 transition-colors ${
//                           active ? 'text-cyan-300' : 'text-slate-300'
//                         }`}
//                       />
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>

//             {/* Content */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
//                 Content
//               </label>

//               <textarea
//                 required
//                 rows={6}
//                 maxLength={CHAR_LIMIT}
//                 placeholder="What do you want to ship today?"
//                 className="w-full min-h-[140px] px-4 py-4 bg-white/[0.05] rounded-xl text-sm text-slate-200 placeholder-slate-500 resize-none outline-none transition-shadow focus:ring-2 focus:ring-purple-400/40"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//               />

//               <div
//                 className={`text-right text-xs mt-2 font-medium ${
//                   content.length > CHAR_LIMIT - 20 ? 'text-orange-400' : 'text-slate-500'
//                 }`}
//               >
//                 {content.length}/{CHAR_LIMIT}
//               </div>
//             </div>

//             {/* Media upload */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
//                 Media (optional)
//               </label>

//               {mediaFile ? (
//                 <div className="relative rounded-xl overflow-hidden bg-white/[0.05] shadow-sm">
//                   {mediaFile.type.startsWith('image/') ? (
//                     <img
//                       src={URL.createObjectURL(mediaFile)}
//                       alt="Upload preview"
//                       className="w-full h-40 object-cover"
//                     />
//                   ) : (
//                     <video
//                       src={URL.createObjectURL(mediaFile)}
//                       className="w-full h-40 object-cover"
//                       controls
//                     />
//                   )}

//                   <button
//                     type="button"
//                     onClick={() => setMediaFile(null)}
//                     className="absolute top-2 right-2 size-7 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors"
//                     aria-label="Remove media"
//                   >
//                     <XIcon className="size-3.5" />
//                   </button>
//                 </div>
//               ) : (
//                 <label className="flex flex-col items-center justify-center gap-3 p-6 py-10 border border-dashed border-white/[0.12] rounded-xl cursor-pointer bg-white/[0.02] hover:border-emerald-400/40 hover:bg-emerald-400/5 transition-all group">
//                   <div className="size-12 rounded-full bg-emerald-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
//                     <ImagePlusIcon className="size-6 text-emerald-400" />
//                   </div>

//                   <div className="text-center">
//                     <p className="text-sm font-medium text-slate-300 group-hover:text-emerald-300 transition-colors">
//                       Upload image or video
//                     </p>
//                     <p className="text-xs text-slate-600 mt-1">
//                       Drag, drop, ship.
//                     </p>
//                   </div>

//                   <input
//                     type="file"
//                     accept="image/*,video/*"
//                     className="hidden"
//                     onChange={(e) =>
//                       e.target.files?.[0] && setMediaFile(e.target.files[0])
//                     }
//                   />
//                 </label>
//               )}
//             </div>

//             {/* Date & time */}
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
//                   Date
//                 </label>
//                 <div className="relative">
//                   <CalendarDaysIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                   <input
//                     type="date"
//                     required
//                     min={new Date().toISOString().split('T')[0]}
//                     className="w-full pl-10 pr-3 py-3 bg-white/[0.05] rounded-xl text-slate-200 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-400/40 [color-scheme:dark]"
//                     onChange={(e) => setScheduledDate(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
//                   Time
//                 </label>
//                 <div className="relative">
//                   <Clock3Icon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                   <input
//                     type="time"
//                     required
//                     className="w-full pl-10 pr-3 py-3 bg-white/[0.05] rounded-xl text-slate-200 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-400/40 [color-scheme:dark]"
//                     onChange={(e) => setScheduledTime(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={!canSubmit}
//               className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold tracking-wide transition-all ${
//                 canSubmit
//                   ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 hover:brightness-110 text-white shadow-[0_0_25px_-6px_rgba(168,85,247,0.65)]'
//                   : 'bg-white/[0.06] text-slate-500 cursor-not-allowed shadow-none'
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Shipping...
//                 </>
//               ) : (
//                 <>
//                   Schedule Post
//                   <ArrowRightIcon className="size-4" />
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Queue Panel */}
//       <div className="flex-1 flex flex-col gap-6 min-w-0">
//         {/* Upcoming */}
//         <div className="bg-white/[0.035] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_0_40px_-18px_rgba(79,127,255,0.2)]">
//           <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
//             <CalendarDaysIcon className="size-4 text-blue-400" />
//             <h3 className="text-slate-100 text-sm font-semibold">Upcoming</h3>
//             <span className="ml-auto text-xs font-bold bg-blue-400/15 text-blue-300 px-2.5 py-0.5 rounded-full">
//               {scheduled.length}
//             </span>
//           </div>

//           <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
//             {scheduled.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-10 text-center px-5">
//                 <CalendarDaysIcon className="size-10 text-slate-700 mb-3" />
//                 <p className="text-sm text-slate-500">
//                   Nothing queued. Future you is waiting.
//                 </p>
//               </div>
//             ) : (
//               scheduled.map((post) => (
//                 <div
//                   key={post._id}
//                   className="px-5 py-4 hover:bg-white/[0.03] transition-colors"
//                 >
//                   <div className="flex items-center justify-between gap-3 mb-2">
//                     <div className="flex gap-1.5 items-center shrink-0">
//                       {(post.platforms || []).map((platformId) => {
//                         const meta = PLATFORMS.find((p) => p.id === platformId)
//                         return meta ? (
//                           <div
//                             key={platformId}
//                             className="p-1 rounded-full bg-white/[0.08]"
//                             title={meta.name}
//                           >
//                             <meta.icon className="size-3.5 text-slate-400" />
//                           </div>
//                         ) : null
//                       })}
//                     </div>

//                     <div className="flex items-center gap-2 shrink-0">
//                       {post.mediaType && (
//                         <span className="text-xs bg-white/[0.08] text-slate-300 px-2 py-0.5 rounded-full font-semibold capitalize">
//                           {post.mediaType}
//                         </span>
//                       )}
//                       <span className="text-xs text-slate-500 whitespace-nowrap">
//                         {post.scheduledFor
//                           ? new Date(post.scheduledFor).toLocaleString()
//                           : 'No date'}
//                       </span>
//                     </div>
//                   </div>

//                   <p className="text-sm text-slate-400 line-clamp-2 max-w-md">
//                     {post.content}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Published */}
//         <div className="bg-white/[0.035] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_0_40px_-18px_rgba(16,185,129,0.18)]">
//           <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
//             <SendIcon className="size-4 text-emerald-400" />
//             <h3 className="text-slate-100 text-sm font-semibold">Published</h3>
//             <span className="ml-auto text-xs font-bold bg-emerald-400/15 text-emerald-300 px-2.5 py-0.5 rounded-full">
//               {published.length}
//             </span>
//           </div>

//           <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
//             {published.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-10 text-center px-5">
//                 <SendIcon className="size-10 text-slate-700 mb-3" />
//                 <p className="text-sm text-slate-500">
//                   Zero posts live. Time to go feed the algorithm.
//                 </p>
//               </div>
//             ) : (
//               published.map((post) => (
//                 <div
//                   key={post._id}
//                   className="px-5 py-4 hover:bg-white/[0.03] transition-colors"
//                 >
//                   <div className="flex items-center justify-between gap-3 mb-2">
//                     <div className="flex gap-1.5 items-center shrink-0">
//                       {(post.platforms || []).map((platformId) => {
//                         const meta = PLATFORMS.find((p) => p.id === platformId)
//                         return meta ? (
//                           <div
//                             key={platformId}
//                             className="p-1 rounded-full bg-white/[0.08]"
//                             title={meta.name}
//                           >
//                             <meta.icon className="size-3.5 text-slate-400" />
//                           </div>
//                         ) : null
//                       })}
//                     </div>

//                     <div className="flex items-center gap-2 shrink-0">
//                       {post.mediaType && (
//                         <span className="text-xs bg-white/[0.08] text-slate-300 px-2 py-0.5 rounded-full font-semibold capitalize">
//                           {post.mediaType}
//                         </span>
//                       )}
//                       <span className="text-xs text-slate-500 whitespace-nowrap">
//                         {new Date(post.updatedAt).toLocaleString()}
//                       </span>
//                       <span className="text-xs bg-emerald-400/15 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
//                         Published
//                       </span>
//                     </div>
//                   </div>

//                   <p className="text-sm text-slate-400 line-clamp-2 max-w-md">
//                     {post.content}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Schedule
import React, { useEffect, useState } from 'react'
import { dummyPostsData, PLATFORMS } from '../assets/assets'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  Clock3Icon,
  ImagePlusIcon,
  SendIcon,
  XIcon,
} from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

interface Post {
  _id: string
  content: string
  platforms: string[]
  scheduledFor?: string
  status: 'scheduled' | 'published'
  createdAt: string
  updatedAt: string
  mediaUrl?: string
  mediaType?: string
}

const CHAR_LIMIT = 280

const Schedule = () => {
  const [posts, setPosts] = useState<Post[]>(dummyPostsData as Post[])
  const [content, setContent] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () =>{
    try{
      const {data} = await api.get("/api/posts")
      setPosts(data)
    }
    catch(error: any){
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  useEffect(()=>{
    (async ()=> await fetchPosts())();
    const interval = setInterval(async ()=> await fetchPosts(), 10000);
    return ()=> clearInterval(interval)
  },[])


  const scheduled = posts.filter((p) => p.status === 'scheduled')
  const published = posts.filter((p) => p.status === 'published')

  const togglePlatform = (id: string) =>
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )

  const canSubmit =
    content.trim().length > 0 &&
    selectedPlatforms.length > 0 &&
    scheduledDate &&
    scheduledTime &&
    !loading

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if(selectedPlatforms.length === 0){
      toast.error("select at least one platform");
      return;
    }
    if(!scheduledDate || !scheduledTime){
      toast.error("Select date and time");
      return;
    }
    if(!selectedPlatforms.includes('instagram') && !mediaFile){
      toast.error("Instagram required an image or video");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    const formDate = new FormData();
    formDate.append("content",content);
    formDate.append("scheduledFor", scheduledFor);
    formDate.append("status", "scheduled");
    formDate.append("platforms", JSON.stringify(selectedPlatforms));
    if(mediaFile) formDate.append("media", mediaFile);

    setLoading(true)
    try{
      await api.post("/api/posts", formDate, {headers: {"Content-Type": "multipart/form-data"}})
      toast.success("POST scheduled");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      fetchPosts();

    }catch (error:any){
      toast.error(error?.response?.data?.message || error.message);

    }finally{
      setLoading(false)
    }


  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full bg-[#05070D] p-1 text-slate-200">
      {/* Composer */}
      <div className="w-full lg:max-w-md lg:sticky lg:top-6 lg:self-start">
        <div className="bg-white/[0.035] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 shadow-[0_0_40px_-15px_rgba(79,127,255,0.2)]">
          <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            Compose Post
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Say something the algorithm can't ignore.
          </p>

          <form className="space-y-6 mt-6" onSubmit={handleSchedule}>
            {/* Platforms */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Where's this going live?
              </label>

              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      aria-pressed={active}
                      aria-label={p.name}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 ${
                        active
                          ? 'bg-cyan-400/15 ring-1 ring-cyan-400/50 shadow-[0_0_16px_-2px_rgba(34,211,238,0.5)]'
                          : 'bg-white/[0.06] hover:bg-white/[0.1]'
                      }`}
                    >
                      <p.icon
                        className={`w-5 h-5 transition-colors ${
                          active ? 'text-cyan-300' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Content
              </label>

              <textarea
                required
                rows={6}
                maxLength={CHAR_LIMIT}
                placeholder="What do you want to ship today?"
                className="w-full min-h-[140px] px-4 py-4 bg-white/[0.05] rounded-xl text-sm text-slate-200 placeholder-slate-500 resize-none outline-none transition-shadow focus:ring-2 focus:ring-purple-400/40"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div
                className={`text-right text-xs mt-2 font-medium ${
                  content.length > CHAR_LIMIT - 20 ? 'text-orange-400' : 'text-slate-500'
                }`}
              >
                {content.length}/{CHAR_LIMIT}
              </div>
            </div>

            {/* Media upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Media (optional)
              </label>

              {mediaFile ? (
                <div className="relative rounded-xl overflow-hidden bg-white/[0.05] shadow-sm">
                  {mediaFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="Upload preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      className="w-full h-40 object-cover"
                      controls
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="absolute top-2 right-2 size-7 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="Remove media"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 p-6 py-10 border border-dashed border-white/[0.12] rounded-xl cursor-pointer bg-white/[0.02] hover:border-emerald-400/40 hover:bg-emerald-400/5 transition-all group">
                  <div className="size-12 rounded-full bg-emerald-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImagePlusIcon className="size-6 text-emerald-400" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-300 group-hover:text-emerald-300 transition-colors">
                      Upload image or video
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Drag, drop, ship.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && setMediaFile(e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>

            {/* Date & time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Date
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-3 bg-white/[0.05] rounded-xl text-slate-200 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-400/40 [color-scheme:dark]"
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Time
                </label>
                <div className="relative">
                  <Clock3Icon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="time"
                    required
                    className="w-full pl-10 pr-3 py-3 bg-white/[0.05] rounded-xl text-slate-200 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-400/40 [color-scheme:dark]"
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold tracking-wide transition-all ${
                canSubmit
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 hover:brightness-110 text-white shadow-[0_0_25px_-6px_rgba(168,85,247,0.65)]'
                  : 'bg-white/[0.06] text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Shipping...
                </>
              ) : (
                <>
                  Schedule Post
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Queue Panel */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Upcoming */}
        <div className="bg-white/[0.035] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_0_40px_-18px_rgba(79,127,255,0.2)]">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
            <CalendarDaysIcon className="size-4 text-blue-400" />
            <h3 className="text-slate-100 text-sm font-semibold">Upcoming</h3>
            <span className="ml-auto text-xs font-bold bg-blue-400/15 text-blue-300 px-2.5 py-0.5 rounded-full">
              {scheduled.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
            {scheduled.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                <CalendarDaysIcon className="size-10 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">
                  Nothing queued. Future you is waiting.
                </p>
              </div>
            ) : (
              scheduled.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex gap-1.5 items-center shrink-0">
                      {(post.platforms || []).map((platformId) => {
                        const meta = PLATFORMS.find((p) => p.id === platformId)
                        return meta ? (
                          <div
                            key={platformId}
                            className="p-1 rounded-full bg-white/[0.08]"
                            title={meta.name}
                          >
                            <meta.icon className="size-3.5 text-slate-400" />
                          </div>
                        ) : null
                      })}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {post.mediaType && (
                        <span className="text-xs bg-white/[0.08] text-slate-300 px-2 py-0.5 rounded-full font-semibold capitalize">
                          {post.mediaType}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {post.scheduledFor
                          ? new Date(post.scheduledFor).toLocaleString()
                          : 'No date'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 max-w-md">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published */}
        <div className="bg-white/[0.035] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_0_40px_-18px_rgba(16,185,129,0.18)]">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
            <SendIcon className="size-4 text-emerald-400" />
            <h3 className="text-slate-100 text-sm font-semibold">Published</h3>
            <span className="ml-auto text-xs font-bold bg-emerald-400/15 text-emerald-300 px-2.5 py-0.5 rounded-full">
              {published.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
            {published.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                <SendIcon className="size-10 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">
                  Zero posts live. Time to go feed the algorithm.
                </p>
              </div>
            ) : (
              published.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex gap-1.5 items-center shrink-0">
                      {(post.platforms || []).map((platformId) => {
                        const meta = PLATFORMS.find((p) => p.id === platformId)
                        return meta ? (
                          <div
                            key={platformId}
                            className="p-1 rounded-full bg-white/[0.08]"
                            title={meta.name}
                          >
                            <meta.icon className="size-3.5 text-slate-400" />
                          </div>
                        ) : null
                      })}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {post.mediaType && (
                        <span className="text-xs bg-white/[0.08] text-slate-300 px-2 py-0.5 rounded-full font-semibold capitalize">
                          {post.mediaType}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(post.updatedAt).toLocaleString()}
                      </span>
                      <span className="text-xs bg-emerald-400/15 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                        Published
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 max-w-md">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule