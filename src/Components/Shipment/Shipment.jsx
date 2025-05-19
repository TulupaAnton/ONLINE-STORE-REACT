import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Shipment.module.css'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useNotification } from '../Notification/NotificationContext'
import {
  MIN_ADDRESS_LENGTH,
  MIN_CITY_LENGTH,
  ZIP_CODE_LENGTH
} from '../../constants'

const validationSchema = yup.object().shape({
  address: yup
    .string()
    .min(
      MIN_ADDRESS_LENGTH,
      `Адрес должен содержать минимум ${MIN_ADDRESS_LENGTH} символов`
    )
    .required('Адрес обязателен'),
  apartment: yup.string(),
  city: yup
    .string()
    .matches(/^[\p{L}\s]+$/u, 'Город должен содержать только буквы')
    .min(
      MIN_CITY_LENGTH,
      `Город должен содержать минимум ${MIN_CITY_LENGTH} символа`
    )
    .required('Город обязателен'),
  country: yup
    .string()
    .required('Страна обязательна')
    .notOneOf([''], 'Пожалуйста, выберите страну'),
  zipCode: yup
    .string()
    .matches(
      new RegExp(`^[0-9]{${ZIP_CODE_LENGTH}}$`),
      `ZIP код должен состоять из ${ZIP_CODE_LENGTH} цифр`
    )
    .required('ZIP код обязателен')
})

export default function Shipment () {
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const formik = useFormik({
    initialValues: {
      address: '',
      apartment: '',
      city: '',
      country: '',
      zipCode: ''
    },
    validationSchema,
    onSubmit: values => {
      localStorage.setItem('shipment-info', JSON.stringify(values))
      navigate('/payment')
    }
  })

  const handleSubmitClick = () => {
    if (!formik.isValid) {
      showNotification('Please fill all required fields', 'error')
      return
    }
    formik.handleSubmit()
  }

  const countries = [
    { value: '', label: 'Select your country' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' }
  ]

  return (
    <div className={styles.main}>
      <h1>Shipping Information</h1>
      <p className={styles.subtitle}>Please enter your shipping details</p>

      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <label>
          Address*
          <input
            type='text'
            name='address'
            placeholder='Enter your address'
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address && (
            <div className={styles.error}>{formik.errors.address}</div>
          )}
        </label>

        <label>
          Apartment, suite, etc.{' '}
          <span className={styles.optional}>(optional)</span>
          <input
            type='text'
            name='apartment'
            placeholder='Enter your apartment information'
            value={formik.values.apartment}
            onChange={formik.handleChange}
          />
        </label>

        <label>
          City*
          <input
            type='text'
            name='city'
            placeholder='Enter your city'
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.city && formik.errors.city && (
            <div className={styles.error}>{formik.errors.city}</div>
          )}
        </label>

        <label>
          Country/Region*
          <select
            name='country'
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {countries.map(country => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          {formik.touched.country && formik.errors.country && (
            <div className={styles.error}>{formik.errors.country}</div>
          )}
        </label>

        <label>
          ZIP code*
          <input
            type='text'
            name='zipCode'
            placeholder='Enter your ZIP code'
            value={formik.values.zipCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.zipCode && formik.errors.zipCode && (
            <div className={styles.error}>{formik.errors.zipCode}</div>
          )}
        </label>
        <button
          type='button'
          className={styles.nextButton}
          disabled={!formik.isValid || !formik.dirty}
          onClick={handleSubmitClick}
        >
          Continue to Payment
        </button>
      </form>
    </div>
  )
}
