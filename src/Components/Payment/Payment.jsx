import React from 'react'
import { useCartStore } from '../CartStore/hooks/useCartStore'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Payment.module.css'
import {
  faShoppingCart,
  faUser,
  faMapMarkerAlt,
  faBox,
  faCreditCard,
  faArrowLeft,
  faBuildingColumns,
  faMobileScreenButton
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TAX_RATE, PRICE_DECIMALS } from '../../constants'
import { useNotification } from '../Notification/NotificationContext'

export default function Payment () {
  const { cart, clearCart } = useCartStore()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const contactInfo = JSON.parse(localStorage.getItem('contact-info')) || {}
  const shipmentInfo = JSON.parse(localStorage.getItem('shipment-info')) || {}

  const isDataComplete =
    contactInfo.firstName &&
    contactInfo.lastName &&
    contactInfo.email &&
    contactInfo.phone &&
    shipmentInfo.address &&
    shipmentInfo.city &&
    shipmentInfo.country &&
    shipmentInfo.zipCode &&
    cart.length > 0

  const handlePayment = () => {
    if (!isDataComplete) {
      showNotification('Please complete all steps before payment', 'error')
      return
    }

    // Оформление заказа
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      contact: contactInfo,
      shipment: shipmentInfo,
      items: cart,
      total: total * (1 + TAX_RATE),
      status: 'paid'
    }

    // Сохраняем заказ
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    localStorage.setItem('orders', JSON.stringify([...orders, order]))

    // Очищаем корзину
    clearCart()

    // Перенаправляем на страницу подтверждения
    navigate('/order-confirmation', { state: { orderId: order.id } })
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Order Summary</h1>
      <p className={styles.subtitle}>Review your order before payment</p>

      <div className={styles.sectionsContainer}>
        {/* Контактная информация */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            <h2>Contact Information</h2>
            {!contactInfo.firstName && (
              <span className={styles.warning}>Incomplete</span>
            )}
          </div>
          {contactInfo.firstName ? (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>First Name:</span>
                <span className={styles.infoValue}>
                  {contactInfo.firstName}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Last Name:</span>
                <span className={styles.infoValue}>{contactInfo.lastName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{contactInfo.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoValue}>{contactInfo.phone}</span>
              </div>
            </div>
          ) : (
            <p className={styles.missingData}>
              Contact information not provided
            </p>
          )}
          <Link to='/contact' className={styles.editLink}>
            Edit contact information
          </Link>
        </section>

        {/* Адрес доставки */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
            <h2>Shipping Address</h2>
            {!shipmentInfo.address && (
              <span className={styles.warning}>Incomplete</span>
            )}
          </div>
          {shipmentInfo.address ? (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Address:</span>
                <span className={styles.infoValue}>{shipmentInfo.address}</span>
              </div>
              {shipmentInfo.apartment && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Apartment:</span>
                  <span className={styles.infoValue}>
                    {shipmentInfo.apartment}
                  </span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>City:</span>
                <span className={styles.infoValue}>{shipmentInfo.city}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Country:</span>
                <span className={styles.infoValue}>
                  {shipmentInfo.country === 'us' && 'United States'}
                  {shipmentInfo.country === 'ca' && 'Canada'}
                  {shipmentInfo.country === 'uk' && 'United Kingdom'}
                  {shipmentInfo.country === 'de' && 'Germany'}
                  {shipmentInfo.country === 'fr' && 'France'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ZIP Code:</span>
                <span className={styles.infoValue}>{shipmentInfo.zipCode}</span>
              </div>
            </div>
          ) : (
            <p className={styles.missingData}>
              Shipping information not provided
            </p>
          )}
          <Link to='/shipment' className={styles.editLink}>
            Edit shipping information
          </Link>
        </section>

        {/* Товары */}
        <section className={`${styles.section} ${styles.fullWidth}`}>
          <div className={styles.sectionHeader}>
            <FontAwesomeIcon icon={faBox} className={styles.icon} />
            <h2>
              Order Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
            {cart.length === 0 && <span className={styles.warning}>Empty</span>}
          </div>
          {cart.length > 0 ? (
            <div className={styles.itemsList}>
              {cart.map(item => (
                <div key={item.id} className={styles.item}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <h3>{item.title}</h3>
                    <div className={styles.itemMeta}>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                      <p>
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.missingData}>Your cart is empty</p>
          )}
          {cart.length > 0 && (
            <Link to='/cart' className={styles.editLink}>
              Edit cart
            </Link>
          )}
        </section>

        {/* Способы оплаты */}
        <section className={`${styles.section} ${styles.fullWidth}`}>
          <div className={styles.sectionHeader}>
            <FontAwesomeIcon icon={faCreditCard} className={styles.icon} />
            <h2>Payment Method</h2>
          </div>
          <div className={styles.paymentMethods}>
            <label className={styles.paymentMethod}>
              <input type='radio' name='payment' defaultChecked />
              <div className={styles.paymentContent}>
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className={styles.paymentIcon}
                />
                <div className={styles.paymentText}>
                  <h3 className={styles.creditCardIcon}>Credit Card</h3>
                  <p>Pay with Visa, Mastercard or other credit card</p>
                </div>
              </div>
            </label>
            <label className={styles.paymentMethod}>
              <input type='radio' name='payment' />
              <div className={styles.paymentContent}>
                <FontAwesomeIcon
                  icon={faBuildingColumns}
                  className={styles.paymentIcon}
                />
                <div className={styles.paymentText}>
                  <h3>Bank Transfer</h3>
                  <p>Make a direct bank transfer</p>
                </div>
              </div>
            </label>
            <label className={styles.paymentMethod}>
              <input type='radio' name='payment' />
              <div className={styles.paymentContent}>
                <FontAwesomeIcon
                  icon={faMobileScreenButton}
                  className={styles.paymentIcon}
                />
                <div className={styles.paymentText}>
                  <h3>Mobile Payment</h3>
                  <p>Pay with Apple Pay or Google Pay</p>
                </div>
              </div>
            </label>
          </div>
        </section>
      </div>

      {/* Итог */}
      <div className={styles.totalSection}>
        <div className={styles.totalRow}>
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className={styles.totalRow}>
          <span>Tax ({TAX_RATE * 100}%):</span>
          <span>${(total * TAX_RATE).toFixed(2)}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
          <span>Total:</span>
          <span>${(total * (1 + TAX_RATE)).toFixed(2)}</span>
        </div>
      </div>

      {/* Кнопки */}
      <div className={styles.actions}>
        <Link to='/' className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Shopping
        </Link>
        <button
          className={`${styles.payButton} ${
            !isDataComplete ? styles.disabled : ''
          }`}
          onClick={handlePayment}
          disabled={!isDataComplete}
        >
          Confirm and Pay ${(total * (1 + TAX_RATE)).toFixed(2)}
        </button>
      </div>
    </div>
  )
}
