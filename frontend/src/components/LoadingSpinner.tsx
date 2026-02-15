interface Props {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4" />
      <p className="text-slate-400">{message}</p>
    </div>
  )
}
