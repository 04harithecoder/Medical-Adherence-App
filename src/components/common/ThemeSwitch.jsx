import { useTheme } from '../../context/ThemeContext'

export default function ThemeSwitch({ className = '' }) {
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme}. Click to switch to ${isDark ? 'light' : 'dark'} mode.`}
      title={`Theme: ${isDark ? 'Dark (1)' : 'Light (0)'} - Click to switch`}
      className={`group relative inline-flex items-center gap-2 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl p-1 transition-transform active:scale-95 ${className}`}
    >
      {/* Numbers Column (0 and 1) */}
      <div className="flex flex-col justify-between h-11 text-[11px] font-bold font-mono select-none pointer-events-none">
        <span
          className={`transition-colors duration-200 ${
            !isDark ? 'text-primary font-extrabold opacity-100 scale-110' : 'text-primary/40 opacity-50'
          }`}
          style={{ textShadow: !isDark ? '0 1px 1px rgba(255, 255, 255, 0.8)' : 'none' }}
        >
          0
        </span>
        <span
          className={`transition-colors duration-200 ${
            isDark ? 'text-accent font-extrabold opacity-100 scale-110' : 'text-primary/40 opacity-50'
          }`}
          style={{ textShadow: isDark ? '0 0 4px rgba(249, 115, 0, 0.5)' : 'none' }}
        >
          1
        </span>
      </div>

      {/* Skeuomorphic Vertical Switch Track & Knob Housing */}
      <div
        className="skeuo-switch-housing relative h-12 w-6 rounded-full p-[2px]"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #3d372e 0%, #4a4439 100%)'
            : 'linear-gradient(180deg, #dfd8c5 0%, #f4ede0 100%)',
          border: '1.5px solid rgba(52, 79, 31, 0.25)',
          boxShadow: isDark
            ? '0 1px 0 rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 2px 5px rgba(0, 0, 0, 0.4)'
            : '0 1px 0 rgba(255, 255, 255, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(52, 79, 31, 0.15)',
        }}
      >
        {/* Recessed Center Slit / Slot */}
        <div
          className="absolute inset-x-[4px] top-[3px] bottom-[3px] rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #111111 0%, #2b2b2b 25%, #606060 50%, #2b2b2b 75%, #111111 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.8), inset 0 -2px 3px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Subtle metallic reflection beam */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-white/20 blur-[0.5px]" />
        </div>

        {/* 3D Cylindrical Slider Knob */}
        <div
          className="relative z-10 w-[17px] h-[23px] rounded-[7px] transition-transform duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            transform: isDark ? 'translateY(19px)' : 'translateY(0px)',
            background: 'linear-gradient(90deg, #151515 0%, #303030 25%, #4f4f4f 50%, #2d2d2d 75%, #121212 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.45)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
            boxShadow: `
              0 3px 6px rgba(0, 0, 0, 0.55),
              0 1px 2px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.35),
              inset 0 -2px 3px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          {/* Circular bottom tactile finger grip cap */}
          <div
            className="absolute bottom-[2px] left-[2px] right-[2px] h-[7px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, #3a3a3a 0%, #1c1c1c 80%, #0d0d0d 100%)',
              border: '1px solid rgba(0, 0, 0, 0.6)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            }}
          />
        </div>
      </div>
    </button>
  )
}
