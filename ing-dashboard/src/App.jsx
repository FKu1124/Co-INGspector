import { useEffect, useState } from 'react'
import './App.css'
import MyNavbar from './components/Navbar'
import TableView from './components/TableView'
import LoginView from './components/LoginView'
import Analysis from './components/Analysis'
import { Toast } from 'flowbite-react'

function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [count, setCount] = useState(0)
  const [route, setRoute] = useState("Notifications")
  const [toastNotifications, setToastNotifications] = useState([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true" ? true : false
    const _count = count
    setLoggedIn(isLoggedIn)
    setRoute(localStorage.getItem("route"))
    setCount(_count)
    getNotificationCount()
  }, [])

  const getNotificationCount = async () => {
    const res = await fetch(`http://localhost:8012/getNotificationCount`)
    const data = await res.json()
    setCount(data.notifications)
  }

  const addToastNotifications = (newNotification) => {
    if (toastNotifications.length >= 4)
      toastNotifications.shift()
    setToastNotifications([...toastNotifications, newNotification])


  }

  if (!loggedIn) {
    return (
      <LoginView />
    )
  } else {
    return (
      <div className="container">
        <MyNavbar setAppRoute={setRoute} notificationCount={count} />
        <div className='flex flex-col'>

          <div className="h-20"></div>

          <div className="flex flex-row justify-around pt-16 w-screen">
            {/* <div className='flex-initial bg-green-500'> */}
            <div className='flex-1'>
              {/* <p>Hallo</p> */}
            </div>
            {route === "Notifications" ?
              <TableView className='flex-1' setNotificationCounter={setCount} addToastNotifications={addToastNotifications} /> :
              <Analysis className='flex-1' setNotificationCounter={setCount} addToastNotifications={addToastNotifications} />
            }
            {/* <div className='flex-initial bg-red-500'> */}
            <div className='flex-1'>
              {/* <p>Hallo</p> */}
              {/* <button onClick={() => getAccountData}>Get Transactions</button> */}
            </div>
          </div>
          <div className="h-20"></div>
        </div>
        {toastNotifications.length !== 0 && (
          <div className="absolute bottom-0 right-0 mb-5 mr-5">
            {toastNotifications.map(item => (
              <Toast className="bg-gray-900 mb-2">
                {/* <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                </div> */}
                <div className="ml-3 text-sm font-normal text-white">{item}</div>
                <Toast.Toggle />
              </Toast>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default App
