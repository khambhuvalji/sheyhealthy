import { Button, Form, Input } from 'antd'
import axios from 'axios';
import React from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Login() {
  // const {loading}=useSelector(store=>store.alerts);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      const response = await axios.post('/api/user/login', values);
      dispatch(hideLoading())

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data)
        navigate('/')
      }
      else {
        dispatch(hideLoading())
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='authentication'>
      <div className='authentication-form card p-2'>
        <h1 className='card-title'>Welcome Back</h1>

        <Form layout='vertical' onFinish={onFinish}>

          <Form.Item label="Email" name="email">
            <Input placeholder='Email' />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input type='password' placeholder='Password' />
          </Form.Item>

          <Button className='primary-button my-2 full-width-button' htmlType='submit'>Login</Button>

          <Link to='/register' className='anchor'>CLICK HERE TO REGISTER</Link>
        
        </Form>
      </div>
    </div>
  )
}

export default Login 