import { Component } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Spatial Engine Runtime Exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6 bg-white/[0.02] border border-white/10 p-10 rounded-3xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert size={28} />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent font-bold">
                System Exception // Error 500
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Spatial Engine Interrupted
              </h2>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                An unexpected rendering anomaly occurred within the component matrix. The core application safety wrapper prevented a full crash.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-black font-mono font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 mx-auto shadow-[0_0_20px_rgba(0,245,212,0.25)] cursor-pointer"
            >
              <RefreshCw size={12} />
              Re-initialize Studio Core
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
