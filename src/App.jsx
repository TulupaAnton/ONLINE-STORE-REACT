import React, { useEffect } from 'react'
import './App.css'
import Header from './Components/Header/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductList from './Components/ ProductList/ProductList'
import Cart from './Components/Cart/Cart'
import Contact from './Components/Contact/Contact'
import Shipment from './Components/Shipment/Shipment'
import Payment from './Components/Payment/Payment'
import { NotificationProvider } from './Components/Notification/NotificationContext'

function App () {
  useEffect(() => {
    if (!localStorage.getItem('cart')) {
      localStorage.setItem('cart', JSON.stringify([]))
    }
  }, [])

  return (
    <div>
      <BrowserRouter>
        <NotificationProvider>
          <Header />
          <Routes>
            <Route path='/' element={<ProductList />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/shipment' element={<Shipment />} />
            <Route path='/payment' element={<Payment />} />
          </Routes>
        </NotificationProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
