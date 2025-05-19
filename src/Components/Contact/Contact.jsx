import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Contact.module.css'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useNotification } from '../Notification/NotificationContext'

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required')
})

export default function Contact () {
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    validationSchema,
    onSubmit: values => {
      localStorage.setItem('contact-info', JSON.stringify(values))
      navigate('/shipment')
    }
  })

  const handleSubmitClick = () => {
    if (!formik.isValid) {
      showNotification('Please fill all required fields', 'error')
      return
    }
    formik.handleSubmit()
  }

  return (
    <div className={styles.main}>
      <h1>Contact Information</h1>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <label>
          First Name*
          <input
            type='text'
            name='firstName'
            placeholder='Enter your first name'
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className={styles.error}>{formik.errors.firstName}</div>
          )}
        </label>
        <label>
          Last Name*
          <input
            type='text'
            name='lastName'
            placeholder='Enter your last name'
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className={styles.error}>{formik.errors.lastName}</div>
          )}
        </label>
        <label>
          Email*
          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className={styles.error}>{formik.errors.email}</div>
          )}
        </label>
        <label>
          Phone*
          <input
            type='text'
            name='phone'
            placeholder='Enter your phone'
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className={styles.error}>{formik.errors.phone}</div>
          )}
        </label>
        <button
          type='button'
          className={styles.nextButton}
          disabled={!formik.isValid || !formik.dirty}
          onClick={handleSubmitClick}
        >
          Next step
        </button>
      </form>
    </div>
  )
}
