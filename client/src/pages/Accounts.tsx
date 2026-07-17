import { PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AccountList from '../components/AccountList'
import PlatformPickerModal from '../components/PlatformPickerModal'
import { dummyAccountsData, PLATFORMS } from '../assets/assets'
// import { platform } from 'os'
import toast from 'react-hot-toast'
import api from '../api/axios'

interface Account {
  _id: string
  platform: string
  handle: string
  status: string
}

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(dummyAccountsData)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [showPlatformPicker, setShowPlatformPicker] = useState(false)

  const connectedIds = accounts.map((account) => account.platform)

  // const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {
  //   try {
  //     if (isSync) {
  //       const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media";
  //       toast.loading(`Syncing ${label} account...`, { id: "sync" })
  //     }
  //     const { data } = await api.get("/api/accounts")
  //     setAccounts(data)
  //     if (isSync) {
  //       toast.success(successMsg || "Synced", { id: "sync" })
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message || error?.message || "failed to load accounts", { id: "sync" });
  //   }
  // }
  const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {
    try {
      if (isSync) {
        const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media";
        toast.loading(`Syncing ${label} account...`, { id: "sync" })
        const { data } = await api.get("/api/oauth/sync")
        setAccounts(data)
        toast.success(successMsg || "Synced", { id: "sync" })
      } else {
        const { data } = await api.get("/api/accounts")
        setAccounts(data)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "failed to load accounts", { id: "sync" });
    }
  }

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- intentional: this effect's entire
       purpose is the initial data fetch on mount, which is a documented valid use of useEffect */

    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get("connected");
    const connectedUserName = params.get("username");
    const errorMsg = params.get("error");

    window.history.replaceState({}, document.title, window.location.pathname)

    if (connectedPlatform) {
      const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
      const handle = connectedUserName ? `(@${connectedUserName})` : ""
      fetchAccounts(true, connectedPlatform, `${label}${handle} connected`)
    } else if (errorMsg) {
      toast.error(`Connection failed: ${decodeURIComponent(errorMsg)}`)
      fetchAccounts();

    } else {
      fetchAccounts();
    }

    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])


  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const { data } = await api.get(`/api/oauth/${platformId}/url`);
     
      window.location.href = data.authUrl;

    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || `failed to connect ${platformId}`);
      setConnecting(null)

    }
  }

  const handleDisconnect = async (accountId: string) => {
    try {
      await api.delete(`/api/accounts/${accountId}`)
      toast.success("Account disconnected")
      await fetchAccounts()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || `failed to disconnect accounts `);

    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Page Title */}
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Accounts</h1>
      </header>

      {/* Sub-header: status + primary action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-100 font-medium">Connected Accounts</h2>
          <p className="text-slate-500 text-lg mt-1">
            {accounts.length} of {PLATFORMS.length} platforms connected
          </p>
        </div>

        {/* <button
          onClick={() => setShowPlatformPicker(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-[#8E7CFF] hover:bg-[#7C68F0] text-white font-semibold transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Connect Account
        </button> */}
          <div className="flex items-center">
          <button
            onClick={() => setShowPlatformPicker(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-[#8E7CFF] hover:bg-[#7C68F0] text-white font-semibold transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Connect Account
          </button>

          <button
            onClick={() => fetchAccounts(true, null, "Accounts synced")}
            className="ml-3 px-4 py-2 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Sync Accounts
          </button>
        </div>
        
      </div>

      {/* Platform Picker Modal */}
      {showPlatformPicker && (
        <PlatformPickerModal
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}

      {/* Account List */}
      <AccountList
        accounts={accounts}
        onDisconnect={handleDisconnect}
        setShowPlatformPicker={setShowPlatformPicker}
      />
    </div>
  )
}

export default Accounts