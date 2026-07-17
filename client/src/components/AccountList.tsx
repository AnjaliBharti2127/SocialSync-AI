

import {
  CheckCircleIcon,
  PlusIcon,
  UnplugIcon,
  AlertCircleIcon,
} from 'lucide-react'

interface AccountListProps {
  accounts: any[]
  onDisconnect: (accountId: string) => Promise<void> | void
  setShowPlatformPicker: (show: boolean) => void
}

const AccountList = ({
  accounts,
  onDisconnect,
  setShowPlatformPicker,
}: AccountListProps) => {
  const handleDisconnect = async (accountId: string) => {
    const confirmDisconnect = window.confirm(
      'Are you sure you want to disconnect this account?'
    )

    if (!confirmDisconnect) return

    await onDisconnect(accountId)
  }

  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10">
        <PlusIcon
          className="w-8 h-8 text-indigo-600 cursor-pointer"
          onClick={() => setShowPlatformPicker(true)}
        />

        <p className="mt-4 font-medium">
          No connected accounts
        </p>

        <p className="text-sm text-gray-500 text-center mt-2">
          Connect your accounts to start scheduling posts
          and automating content.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div
          key={account._id}
          className="bg-white rounded-2xl border border-slate-200 flex items-center justify-between p-4"
        >
          <div>
            <h3 className="font-medium text-gray-900">
              {account.handle}
            </h3>

            <p className="text-sm text-gray-500">
              {account.platform}
            </p>

            <div className="flex items-center gap-1 mt-2">
              {account.status === 'connected' ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <AlertCircleIcon className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    Disconnected
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() =>
              handleDisconnect(account._id)
            }
            className="p-2 rounded-lg hover:bg-slate-100"
            title="Disconnect Account"
          >
            <UnplugIcon className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default AccountList