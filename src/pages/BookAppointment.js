import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import axios from 'axios'
import { Button, Col, Row, } from 'antd'
import moment from 'moment'
import toast from "react-hot-toast"

function BookAppointment() {

    const { user } = useSelector((state) => state.user);
    const [isAvailable, setIsAvailable] = useState(false)
    const [date, setDate] = useState("01/01/2025")
    const [time, setTime] = useState("10:00")
    const [doctor, setDoctor] = useState(null)
    const params = useParams()
    const dispatch = useDispatch()

    const getDoctorData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/get-doctor-info-by-id', { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            dispatch(hideLoading())
            console.log(response.data.data)
            if (response.data.success) {
                dispatch(setDoctor(response.data.data))
            }

        } catch (error) {
            console.log(error.message)
            dispatch(hideLoading())
        }
    }

    const checkAvailability = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/check-booking-avilability', {
                doctorId: params.doctorId,
                date: date,
                time: time
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            dispatch(hideLoading())
            console.log(response.data)
            if (response.data.success) {
                toast.success(response.data.message)
                setIsAvailable(true)
            }
            else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error("Error booking appointment")
            dispatch(hideLoading())
        }
    }

    const bookNow = async () => {
        setIsAvailable(false)
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/book-appointment', {
                doctorId: params.doctorId,
                userId: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            dispatch(hideLoading())
            console.log(response.data)
            if (response.data.success) {
                toast.success(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error("Error booking appointment")
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        if (user) {
            getDoctorData()
        }
    }, [])

    return (
        <Layout>
            {
                doctor && (
                    <div>
                        <h1 className='page-title'>{doctor.firstName} {doctor.lastName}</h1>
                        <hr />

                        <Row>
                            <Col span={8} xs={24} sm={24} lg={8}>
                                <h1 className='normal-text'><b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}</h1>

                                <div className='d-flex flex-column pt-2'>
                                    <DatePicker format="DD-MM-YYYY" className='mt-3' value={date} onChange={(value) => {
                                        setDate(moment(value).format("DD-MM-YYYY"))
                                        // isAvailable(false)
                                    }} />
                                    {/* <TimePicker format="HH:mm" className='mt-3' value={time} disableClock={true} clearIcon={null} clockIcon={null} onChange={(value)=>{
                                        setTime(
                                            moment(value).format("HH:mm"), 
                                        )
                                    }} /> */}

                                    <TimePicker format="HH:mm" className='mt-3' value={time} disableClock={true} clearIcon={null} clockIcon={null} onChange={(value) => {
                                        setTime(value)
                                        setIsAvailable(false)
                                    }} />

                                    {!isAvailable && (<Button className='primary-button mt-3 full-width-button' onClick={checkAvailability}>Check Availability</Button>)}

                                    {isAvailable && (<Button className='primary-button mt-3 full-width-button' onClick={bookNow}>Book Now</Button>)}
                                </div>
                            </Col>

                            <Col span={8} xs={24} sm={24} lg={8}>
                                    <p><b>Phone Number : </b> {doctor.phoneNumber}</p>
                                    <p><b>Address : </b> {doctor.address}</p>
                                    <p><b>Fee Per Visit : </b> {doctor.feePerCunsultation}</p>
                                
                            </Col>
                        </Row>
                    </div>
                )
            }
        </Layout>
    )
}

export default BookAppointment