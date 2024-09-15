import React, { useState } from "react"
import Sidebar from "../Sidebar/Sidebar"

interface IMainLayout {
    children: React.ReactNode
}

const MainLayout: React.FC<IMainLayout> = ({children}) => {

    const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='w-full h-screen flex'>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full h-screen"  onClick={() => setIsOpen(false)}>
        {children}
      </div>
    </div>
  )
}

export default MainLayout