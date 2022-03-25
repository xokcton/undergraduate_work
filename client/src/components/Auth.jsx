import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { useForm } from "react-hook-form"

import { ShowPassword } from '../assets'
import signinImage from '../assets/signup.jpg'

const cookies = new Cookies()
const initialState = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarURL: ''
}

const Auth = () => {
  const [showPassword, setShowPassword] = useState(true)
  const [showRepeatPassword, setShowRepeatPassword] = useState(true)
  const [form, setForm] = useState(initialState)
  const [isSignup, setIsSignup] = useState(true)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const HandleSubmit = async Data => {
    const { username, password, phoneNumber, avatarURL } = Data
    const URL = 'http://localhost:5000/auth'
    const { data: { token, hashedPassword, userId, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
      username, password, fullName: form.fullName, phoneNumber, avatarURL
    }) 

    cookies.set('token', token)
    cookies.set('username', username)
    cookies.set('fullName', fullName)
    cookies.set('userId', userId)

    if (isSignup) {
      cookies.set('phoneNumber', phoneNumber)
      cookies.set('avatarURL', avatarURL)
      cookies.set('hashedPassword', hashedPassword)
    }

    window.location.reload()
  }
  
  const switchMode = () => {
    setIsSignup((prevState) => !prevState)
  }

  return (
    <div className='auth__form-container'>
      <div className='auth__form-container_fields'>
        <div className='auth__form-container_fields-content'>
          <p>{ isSignup ? 'Sign Up' : 'Sign In' }</p>
          <form onSubmit={handleSubmit(HandleSubmit)}>
            {isSignup && (
              <>
              <div className='auth__form-container_fields-content_input'>
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text"
                  {...register('fullName', { required: true, minLength: 5 })}
                  name='fullName'
                  placeholder='Full Name'
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.fullName && <span className='error'>This field is required and there must be at least 5 characters!</span>}
              </>
            )}
            <div className='auth__form-container_fields-content_input'>
                <label htmlFor="username">Username</label>
                <input 
                  type="text"
                  {...register('username', { required: true, minLength: 5 })}
                  placeholder='Username'
                  onChange={handleChange}
                  required
                />
            </div>
            {errors.username && <span className='error'>This field is required and there must be at least 5 characters!</span>}
            {isSignup && (
              <>
                <div className='auth__form-container_fields-content_input'>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input 
                    type="tel"
                    {...register('phoneNumber', { required: false, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im })}
                    placeholder='Phone Number'
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.phoneNumber && <span className='error'>Optional field! Template: 0999999999</span>}
                <div className='auth__form-container_fields-content_input'>
                  <label htmlFor="avatarURL">Avatar URL</label>
                  <input 
                    type="text"
                    {...register('avatarURL')}
                    placeholder='Avatar URL'
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.avatarURL && <span className='error'>Optional field! Or image URL...</span>}
              </>
            )}
            <div className='auth__form-container_fields-content_input'>
              <label htmlFor="password">Password</label>
              <input 
                type={showPassword ? "password" : "text"}
                {...register('password', { required: true, minLength: 5 })}
                placeholder='Password'
                onChange={handleChange}
                required
              />
              <div className="auth__form-container_fields-content_input-password">
                <ShowPassword isTrue={showPassword} setShowPassword={setShowPassword} />
              </div>
            </div>
            {errors.password && <span className='error'>This field is required and there must be at least 5 characters!</span>}
            {isSignup && (
              <>
              <div className='auth__form-container_fields-content_input'>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type={showRepeatPassword ? "password" : "text"}
                  {...register('confirmPassword', { required: true, minLength: 5 })}
                  placeholder='Confirm Password'
                  onChange={handleChange}
                  required
                />
                <div className="auth__form-container_fields-content_input-password">
                  <ShowPassword isTrue={showRepeatPassword} setShowPassword={setShowRepeatPassword} />
                </div>
              </div>
              {errors.confirmPassword && <span className='error'>This field is required and there must be at least 5 characters!</span>}
              </>
            )}
            <div className='auth__form-container_fields-content_button'>
              <button>{ isSignup ? 'Sign Up' : 'Sign In' }</button>
            </div>
          </form>
          <div className='auth__form-container_fields-account'>
            <p>
              { isSignup ? 'Already have an account?' : 'Don\'t have an account?' }
              <span onClick={switchMode}>
                { isSignup ? 'Sign In' : 'Sign Up' }
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className='auth__form-container_image'>
        <img src={signinImage} alt="sign in" />
      </div>
    </div>
  )
}

export default Auth
