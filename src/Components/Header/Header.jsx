import React from 'react'
import { Link } from 'react-router-dom'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCartStore } from '../CartStore/hooks/useCartStore'
import { faShopify } from '@fortawesome/free-brands-svg-icons'
import { CART_ICON_SIZE } from '../../constants'

import styles from './Header.module.css'

export default function Header () {
  const { cart } = useCartStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className={styles.wrapper}>
      <div className={styles.title}>
        <nav className={styles.nav}>
          <Link className={styles.store} to='/'>
            <span role='img' aria-label='store'>
              <FontAwesomeIcon
                icon={faShopify}
                size={CART_ICON_SIZE}
                color='green'
              />
            </span>
            Store
          </Link>
          <Link className={styles.cartBtn} to='/cart' aria-label='Cart'>
            <FontAwesomeIcon icon={faShoppingCart} />
            <span style={{ marginLeft: '8px' }}>Cart</span>
            {cartCount > 0 && (
              <span className={styles.cartCount}>{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
