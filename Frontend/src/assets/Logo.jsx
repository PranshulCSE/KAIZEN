export default function Logo({ className = '' }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                    <img src="/LOGO_BLACK.png" alt="Kaizen logo" />
                </span>
            </div>
            <span className="font-bold text-xl text-gradient-primary">Kaizen</span>
        </div>
    );
}
