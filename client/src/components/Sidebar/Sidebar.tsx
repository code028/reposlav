import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
// import { useDarkMode } from '../../hooks/useDarkMode';
import { 
  Box, GraduationCap, ChartNoAxesColumn, ChartPie, UsersRound, 
  UserRound, BookOpen, Files, Archive, LogOut, CircleUserRound, 
  Fingerprint, 
  BadgePlus,
  BadgeHelp,
  Captions,
} 
from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearTokens } from '../../store/slices/sessionSlice';
import { useLogoutMutation } from '../../store/api/sessionSlice';
import { clearUser } from '../../store/slices/userSlice';

interface ISidebar {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<ISidebar> = ({isOpen, setIsOpen}) => {  
  // const userRole = useAppSelector(state => state.user.role);
  // const [theme, setTheme] = useDarkMode();
  // const toggleTheme = () => {
  //   setTheme(theme === 'dark' ? 'light' : 'dark');
  // };

  const sidebarItems = [
    { 
      label: "Професор", 
      links: [
        {name: "Додај рад", href: "/", icon: <BadgePlus />}, 
        {name: "Дипломски радови", href: "/a", icon: <Files />}, 
        {name: "Архива", href: "/arhive", icon: <Archive />}
      ] 
    },
    { 
      label: "Служба", 
      links: [
        {name: "Одсеци", href: "/departments/", icon: <ChartPie />}, 
        {name: "Предмети", href: "/subjects/", icon: <Captions />}, 
        {name: "Професори", href: "/professors/", icon: <UserRound />},
        {name: "Студенти", href: "/students/", icon: <UsersRound />},
        {name: "Региструј Студента", href: "/register/student", icon: <UsersRound />},
        {name: "Додај Студента", href: "/stud/add", icon: <UsersRound />},
      ] 
    },
    { 
      label: "Администрација", 
      links: [
        {name: "Универзитети", href: "/universities/", icon: <GraduationCap />}, 
        {name: "Факултети", href: "/faculties/", icon: <BookOpen />},
        {name: "Контрола", href: "/a", icon: <Fingerprint />},
      ] 
    },
    { 
      label: "Статистика", 
      links: [
        {name: "Факултети", href: "http://localhost:3000/", icon: <ChartNoAxesColumn />},
        {name: "Професори", href: "http://localhost:3000/", icon: <ChartNoAxesColumn />},
        {name: "Студенти", href: "/auth/login", icon: <ChartNoAxesColumn />}
      ] 
    },
    { 
      label: "Упутствo", 
      links: [
        {name: "Платформа", href: "http://localhost:3000/", icon: <BadgeHelp />},
      ] 
    }
  ];

  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.session.refreshToken);
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({refreshToken}).unwrap();

      dispatch(clearTokens());
      dispatch(clearUser());
      navigate('/auth/login');

    } catch (error) {
      console.error('Failed to logout:', error);
    }
    
  }

  return (
    <div onMouseEnter={() => setIsOpen(true)} className={`h-screen bg-primary-custom flex flex-col items-center duration-200 ${!isOpen ? 'w-max-[80px] w-[80px]' : 'w-min-[320px] w-[320px]'} relative`}>
      <div className="flex flex-row items-center gap-3 py-7 text-primary-custom line-clamp-1">
        <div className="p-2 bg-black bg-opacity-80 dark:bg-white rounded-full">
          <Box size={32} className="text-[#bebebe] dark:text-black" />
        </div>
        { 
          isOpen && 
          <h1 className="font-bold text-[20px] transition select-none duration-500">
            Репозиторијум
          </h1>
        }
      </div>
      <div id='nebitan' className='w-full h-full flex flex-1 flex-col overflow-y-scroll overflow-x-hidden '>
        {sidebarItems.map((item, index) => {
          const {label , links} = item;
          return (
            <div key={`${index}`} className={`w-full h-fit px-3 py-2 flex flex-col gap-y-3 items-center`}>
              { isOpen === true &&  
                  <label htmlFor="section1" className={`w-full h-fit text-[#797474] font-semibold text-sm border-b-2 text-nowrap flex flex-row justify-between`}>
                    {label}
                  </label>
              }              
                {links.map((link) => {
                  const { name, href, icon} = link;
                  return (
                      // isActive={() => ['/events', '/myevents'].includes(pathname)} 
                      <NavLink key={name} to={href} className={({ isActive }) => isActive ? 'bg-black bg-opacity-80 text-white rounded-lg w-full' : 'bg-transparent w-full text-black'}>
                        <div className={`flex gap-4  items-center bg-opacity-50 rounded-md ${!isOpen && 'justify-center'}  px-4 py-2 select-none`}>
                          <div className='rounded-2xl'>{icon}</div>
                          {
                            isOpen && <div className='text-nowrap font-semibold'>{name}</div>
                          }
                        </div>
                      </NavLink>
                  )
                })}
            </div>
          )
        })}
      </div>
      <div className={`w-full px-3`}>
        <div className={`w-full border-t-[2px] flex py-5 px-5 ${isOpen ? 'justify-between' : 'justify-center' } items-center'`}>
          <NavLink to={'/profile'} >
            <div className='flex gap-3 justify-center items-center'>
              <CircleUserRound size={34} />
              {isOpen && <div className='font-semibold'>Профил</div> }
            </div>
          </NavLink>
          {isOpen && 
            <button onClick={handleLogout} className='px-2 py-2 bg-[#333333] rounded-md text-white'>
              <LogOut />
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default Sidebar