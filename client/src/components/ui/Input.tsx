import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import React from "react"
import { NavLink } from "react-router-dom";

interface IInput {
    id?: string,
    label: string,
    type: 'text' | 'number' | 'email' | 'password' | 'date',
    placeholder?: string,
    className?: string,
    value: any,
    setValue: (value: any) => void,
    show?: boolean,
    setShow?: (show: boolean) => void,
    withPassForgot?: boolean,
    disabled?: boolean,
}

const Input: React.FC<IInput> = ({id, label, type, placeholder, className, value, setValue, show = false, setShow, withPassForgot, disabled = false}) => {
    let content = 
        <>
            <label htmlFor={id} className="text-[#9e9e9e] text-sm font-semibold">{label}</label>
            <input 
                id={id} 
                type={type} 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                className={`py-1 px-3 rounded outline outline-[#9e9e9e] outline-1 focus:outline-offset-1 focus:outline-black dark:focus:outline-white focus:outline-[1px] ${className} text-primary-custom bg-primary-custom`} 
                placeholder={placeholder} 
                required 
                autoComplete="off"
                disabled={disabled}
            />
        </>;

    if (type === 'password') {
        content = 
            <>
                <label htmlFor={id} className="text-[#9e9e9e] text-sm font-semibold">{label}</label>
                <div className="flex flex-row items-center relative">
                    <input 
                        id={id} 
                        type={show ? 'text' : 'password'} 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)} 
                        className={`w-full py-1 px-3 rounded outline outline-[#9e9e9e] outline-1 focus:outline-offset-1 focus:outline-black dark:focus:outline-white focus:outline-[1px] ${className} text-primary-custom bg-primary-custom`} 
                        placeholder={placeholder} 
                        required 
                        autoComplete="off"
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        onClick={() => setShow ? setShow(!show) : undefined}
                        className="absolute right-1 text-neutral-600 dark:text-neutral-400 mr-2 transition hover:text-black dark:hover:text-white"
                    >
                        {show ? <Eye size="17" /> : <EyeOff size="17" />}
                    </button>
                </div>
                {withPassForgot && 
                    <div className="w-full text-right pt-1">
                        <NavLink
                        to={"/password/reset"}
                        className={
                            "text-[#9e9e9e] text-xs hover:animate-pulse hover:text-red-500 transition flex justify-end items-center gap-2"
                        }
                        >
                        <LockKeyhole />
                        <span>Заборавили сте лозинку?</span>
                        </NavLink>
                    </div>
                }
            </>
    }
    
    return (
        <div className="w-full flex flex-col gap-y-1">  
            {content}
        </div>
    )
}

export default Input         