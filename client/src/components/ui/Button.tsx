import React from 'react'

interface IButton {
    type: 'button'| 'submit' | 'reset',
    disabled?: boolean,
    children: React.ReactNode,
    className?: string,

}

const Button: React.FC<IButton> = ({type, disabled, children, className}) => {
  return (
    <button type={type} disabled={disabled} className={`bg-[#161616] w-full text-white dark:bg-[#ececec] dark:text-black py-2 px-3 rounded mt-3 font-semibold hover:bg-opacity-95 transition ${className}`}>{children}</button>
  )
}

export default Button