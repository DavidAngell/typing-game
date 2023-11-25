import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config'
const twFullConfig = resolveConfig(tailwindConfig)

export default function KeyboardIcon({ width = 144, height = 144, fill = twFullConfig.theme.colors.main[400], className = "" }) {
    // Credit: https://materialui.co/icon/keyboard
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" className={className}>
            <path fill={fill} d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
            <path d="M0 0h24v24H0zm0 0h24v24H0z" fill="none" />
        </svg>
    </>;
}