import React from 'react'
import styles from './ProductList.module.css'
import { useCartStore } from '../CartStore/hooks/useCartStore'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../../api/products'
import { useNotification } from '../Notification/NotificationContext'
import {
  STALE_TIME,
  DISCOUNT_PERCENTAGE_ROUNDING,
  PRICE_DECIMALS,
  MAX_RATING,
  RATING_ROUNDING
} from '../../constants'

export default function ProductList () {
  const { showNotification } = useNotification()
  const { addToCart } = useCartStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME
  })

  const handleAddToCart = product => {
    addToCart(product)
    showNotification(`"${product.title}" добавлен в корзину!`, 'success')
  }

  if (isLoading) {
    return <div className={styles.loader}>Загрузка товаров...</div>
  }

  if (error) {
    showNotification(`Не удалось загрузить товары: ${error.message}`, 'error')
    return (
      <div className={styles.error}>Произошла ошибка при загрузке товаров</div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {data.products.map(product => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img
                src={product.thumbnail}
                alt={product.title}
                className={styles.image}
                loading='lazy'
              />
              {product.discountPercentage && (
                <span className={styles.discountBadge}>
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.title}>{product.title}</h3>
              <p className={styles.brand}>{product.brand}</p>
              <div className={styles.priceContainer}>
                <span className={styles.price}>
                  ${product.price.toFixed(PRICE_DECIMALS)}
                </span>
                {product.discountPercentage && (
                  <span className={styles.originalPrice}>
                    $
                    {(
                      product.price /
                      (1 - product.discountPercentage / 100)
                    ).toFixed(PRICE_DECIMALS)}
                  </span>
                )}
              </div>
              <p className={styles.rating}>
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(MAX_RATING - Math.round(product.rating))}
                <span> ({product.rating.toFixed(RATING_ROUNDING)})</span>
              </p>
              <button
                className={styles.button}
                onClick={() => handleAddToCart(product)}
              >
                <FontAwesomeIcon icon={faCartPlus} />
                <span>В корзину</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
