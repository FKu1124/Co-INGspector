import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import logoURL from '../assets/icon.png'
import { useEffect, useState } from 'react';

export default function MyNavbar({setAppRoute, notificationCount}) {
  
  const [route, setRoute] = useState("Navigation")

  const logOut = () => {
    localStorage.removeItem("loggedIn")   
    localStorage.removeItem("type")
    window.location.reload();
  }

  const navigate = (route) => {
    setRoute(route)
    setAppRoute(route)
    localStorage.setItem("route", route)
  }

  useEffect(() => {
    setRoute(localStorage.getItem("route"))
  }, [])
  
  return (
    <Navbar fluid rounded className='w-screen fixed border-b border-slate-500 z-50'>
      <Navbar.Brand href="/">
        <img src={logoURL} className="mr-3 h-6 sm:h-9 rounded-lg" alt="ING Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Co-INGspector</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Felix K</span>
            <span className="block truncate text-sm font-medium">felixk@co-ingspector.com</span>
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => logOut()}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <button onClick={() => navigate("Notifications")} type="button" className="relative inline-flex items-center p-3 text-center">
          <Navbar.Link href="#" active={route === "Notifications" ? true : false} className="text-2xl">Notifications</Navbar.Link>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-2 -end-2 dark:border-gray-900">{notificationCount}</div>
        </button>
        <button onClick={() => navigate("Analysis")} type="button" className="relative inline-flex items-center p-3 text-center">
          <Navbar.Link href="#" active={route === "Analysis" ? true : false} className="text-2xl">Transaction Stream</Navbar.Link>
          {/* <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-2 -end-2 dark:border-gray-900">20</div> */}
        </button>
      </Navbar.Collapse>
    </Navbar>
  );
}