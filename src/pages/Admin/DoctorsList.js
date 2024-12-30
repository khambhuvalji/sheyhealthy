import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { hideLoading, showLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { Table } from 'antd'
import toast from "react-hot-toast"
import moment from 'moment'

function DoctorsList() {

  const [doctors, setDoctors] = useState([])
  const dispath=useDispatch()

  const getDoctorsData=async()=>{
    try {
      dispath(showLoading())
      const response=await axios.get('/api/admin/get-all-doctors',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      dispath(hideLoading())

      if(response.data.success){
        dispath(setDoctors(response.data.data))
      }
    } catch (error) {
      dispath(hideLoading())
    }
  }

  const changeDoctorStatus=async(record,status)=>{
    try {
      dispath(showLoading())
      const response=await axios.post('/api/admin/change-doctor-account-status',{doctorId:record._id,status:status},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      dispath(hideLoading())

      if(response.data.success){
        toast.success(response.data.message)
        getDoctorsData()
      }
    } catch (error) {
      toast.error("Error changing doctor account status")
      dispath(hideLoading())
    }
  }

  useEffect(() => {
    getDoctorsData();
  }, [])

  const columns=[
    {
      title:"Name",
      dataIndex:"name",
      render:(text,record)=><span>{record.firstName} {record.lastName}</span> 
    },
    {
      title:"Phone",
      dataIndex:"phoneNumber"
    },
    {
      title:"Created At",
      dataIndex:"createdAt",
      render:(record,text)=>moment(record.createAt).format("DD-MM-YYYY")
    
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
          {record.status==='pending' && <h1 className='anchor' onClick={()=>changeDoctorStatus(record,"approved")}>Approve</h1>}
          {record.status==='approved' && <h1 className='anchor' onClick={()=>changeDoctorStatus(record,"blocked")}>Block</h1>}
        </div>
      )
    }
  ]

  return (
    <Layout>
      <h1 className='page-title'>Doctors List</h1>

      <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default DoctorsList