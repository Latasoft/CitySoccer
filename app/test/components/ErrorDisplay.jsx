export default function ErrorDisplay({ error }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Error: {error.message}
      </div>
    </div>
  );
}