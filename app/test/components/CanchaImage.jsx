export default function CanchaImage({ src, alt, className = "" }) {
  return (
    <div className={`col-span-4 h-full ${className}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
        <img 
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}