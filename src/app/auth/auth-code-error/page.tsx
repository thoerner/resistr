import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Sign In Failed
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          There was an error completing your sign in. The link may have expired or been used already.
        </p>
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              Return to Home
            </Button>
          </Link>
          <p className="text-sm text-slate-500">
            Try signing in again or contact support if the problem persists.
          </p>
        </div>
      </div>
    </div>
  )
}