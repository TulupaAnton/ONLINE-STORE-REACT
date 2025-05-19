import { useCartStore } from '../CartStore/hooks/useCartStore'
import {
  faTrashAlt,
  faTimes,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Cart.module.css'
import { Link } from 'react-router-dom'
import { EMPTY_CART_ICON_SIZE } from '../../constants'
import { useNotification } from '../Notification/NotificationContext'

export default function Cart () {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity
  } = useCartStore()
  const { showNotification } = useNotification()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error')
    }
  }

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>
        Корзина ({cart.reduce((sum, item) => sum + item.quantity, 0)} товаров)
      </h2>

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <FontAwesomeIcon icon={faTimes} size={EMPTY_CART_ICON_SIZE} />
          <p>Ваша корзина пуста</p>
        </div>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map(item => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.title}</h3>
                  <p className={styles.price}>{item.price} $</p>

                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className={styles.quantityButton}
                      disabled={item.quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>

                    <span className={styles.quantity}>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className={styles.quantityButton}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>

                  <p className={styles.subtotal}>
                    Сумма: {(item.price * item.quantity).toFixed(2)} $
                  </p>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.id)}
                  aria-label='Удалить'
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.cartSummary}>
            <p className={styles.total}>Итого: {total.toFixed(2)} $</p>
            <div className={styles.actions}>
              <button className={styles.clearButton} onClick={clearCart}>
                Очистить корзину
              </button>
              <Link
                to={cart.length > 0 ? '/contact' : '#'}
                className={`${styles.checkoutButton} ${
                  cart.length === 0 ? styles.disabled : ''
                }`}
                onClick={handleCheckoutClick}
              >
                Оформить заказ
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
