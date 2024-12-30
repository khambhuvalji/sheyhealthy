import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import { toast } from "react-hot-toast"
import axios from 'axios'
import { Table } from 'antd'
import moment from 'moment'

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([])
    const dispath = useDispatch()

    const getAppointmentsData = async () => {
        try {
            dispath(showLoading())
            const response = await axios.get('/api/doctor/get-appointments-by-doctor-id', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispath(hideLoading())

            if (response.data.success) {
                setAppointments(response.data.data) 
            }
        } catch (error) {
            dispath(hideLoading())
        }
    }

    const changeAppointmentStatus=async(record,status)=>{
        try {
          dispath(showLoading())
          const response=await axios.post('/api/doctor/change-appointment-status',{appointmentId:record._id,status:status},{
            headers:{
              Authorization:`Bearer ${localStorage.getItem("token")}`
            }
          })
          dispath(hideLoading())
    
          if(response.data.success){
            toast.success(response.data.message)
            getAppointmentsData()
          }
        } catch (error) {
          toast.error("Error changing doctor account status")
          dispath(hideLoading())
        }
      }

    const columns=[
        {
            title:"Id",
            dataIndex:"_id"
        },
        {
          title:"Patient",
          dataIndex:"name",
          render:(text,record)=><span>{record.userInfo.name}</span>  
        },
        {
          title:"Phone",
          dataIndex:"phoneNumber",
          render:(text,record)=><span>{record.userInfo.phoneNumber}</span> 
        },
        {
          title:"Date & Time",
          dataIndex:"createdAt",
          render:(text,record)=><span>{moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}</span> 
        },
        {
          title:"Status",
          dataIndex:"status"
        },
        {
            title:"Actions",
            dataIndex:"actions",
            render:(text,record)=>(
              <div className='d-flex'>
                {record.status==='pending' &&
                <div className='d-flex'>
                    <h1 className='anchor px-2' onClick={()=>changeAppointmentStatus(record,"approved")}>Approve</h1>
                    <h1 className='anchor' onClick={()=>changeAppointmentStatus(record,"rejected")}>Reject</h1>
                </div>
                }
                {/* {record.status==='approved' && <h1 className='anchor' onClick={()=>changeAppointmentStatus(record,"rejected")}>Block</h1>} */}
              </div>
            )
          }
      ] 

    useEffect(() => {
        getAppointmentsData();
    }, [])

    return (
        <Layout>
            <h1 className='page-title'>Appointments</h1>

            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default DoctorAppointments