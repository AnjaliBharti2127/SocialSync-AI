// import React from 'react'
// import { PLATFORMS} from '../assets/assets';
// import { CheckCircleIcon, ExternalLink, XIcon } from 'lucide-react';

// interface PlatformPickerModal{
//     connectedIds: string[];
//     connecting: string|null;
//     onClose: ()  => void;
//     onConnect: (PlatformId: string)=>void;
// }

// const PlatformPickerModal = ({connectedIds, connecting, onClose, onConnect}:PlatformPickerModalProps) => {
//   return (
//     <div className='fixed insert-0 z-50 flex items-center justify-center p-4 bg-slate-900/400 backdrop-blur'>
//         <div className='bg-white rounded-2xl shadow-2xl shadow-2xl w-full  max-w-mg border border-slate-100'>
//              <div className='flex items-center justify-between px-6 py-4 shadow'>
//                 <h3 className='text-slate-700'>choose a Platform </h3>
//                   <button onClick={onClose} className='p-2 roundeed-full hover:bg-slate-100'>
//                     <XIcon className='size-4'/>
//                   </button>
//                 <div className='p-6 flex flex-col gap-2'>
//                     {PLATFORMS.map((p)=>{
//                         const isConnected = connectedIds.includes(p.id);
//                         const isConnecting = connecting === p.id;
//                         return (
//                             <button>
//                                 <div>
//                                     <p.icon className={'size-5 ${isConnected ? "text-red-600":"text-slate-500"}'}/>

//                                 </div>
//                                 <div className='flex-1 min-w-0'>
//                                     <div className='{text-sm ${isConnected ? "text-red-700":"text-slate-800"}'>
//                                         {p.name}

//                                     </div>
//                                     <div className='text-xs text-slate-500 truncate '>{isConnected? "Alresdy Connected":p.description}</div>
//                                 </div>
//                                 {isConnected && <CheckCircleIcon className='size-4 text-red-500 shrink-0'></CheckCircleIcon>}
//                                 {isConnecting && <div className='size-4 border-red-600 border-t-transparent rounded-full animate-spin shrink-0'/>}
//                                 {!isConnected && !isConnecting && <ExternalLink className='size-3.5 text-slate-400 shrink-0'/>}
//                             </button>
//                     )
//                     })}
//                 </div>
//              </div>
//         </div>
//     </div>
    
//   )
// }

// export default PlatformPickerModal

import React from 'react'
import { PLATFORMS } from '../assets/assets'
import {
  CheckCircleIcon,
  ExternalLink,
  XIcon,
} from 'lucide-react'

interface PlatformPickerModalProps {
  connectedIds: string[]
  connecting: string | null
  onClose: () => void
  onConnect: (platformId: string) => void
}

const PlatformPickerModal = ({
  connectedIds,
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Choose a Platform
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Platform List */}
        <div className="p-6 flex flex-col gap-3">
          {PLATFORMS.map((p) => {
            const isConnected = connectedIds.includes(p.id)
            const isConnecting = connecting === p.id

            const Icon = p.icon

            return (
              <button
                key={p.id}
                disabled={isConnected || isConnecting}
                onClick={() => onConnect(p.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${
                  isConnected
                    ? 'border-red-200 bg-red-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`size-5 ${
                    isConnected
                      ? 'text-red-600'
                      : 'text-slate-500'
                  }`}
                />

                <div className="flex-1 min-w-0 text-left">
                  <div
                    className={`text-sm font-medium ${
                      isConnected
                        ? 'text-red-700'
                        : 'text-slate-800'
                    }`}
                  >
                    {p.name}
                  </div>

                  <div className="text-xs text-slate-500 truncate">
                    {isConnected
                      ? 'Already Connected'
                      : p.description}
                  </div>
                </div>

                {isConnected && (
                  <CheckCircleIcon className="size-4 text-red-500 shrink-0" />
                )}

                {isConnecting && (
                  <div className="size-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                )}

                {!isConnected &&
                  !isConnecting && (
                    <ExternalLink className="size-4 text-slate-400 shrink-0" />
                  )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlatformPickerModal