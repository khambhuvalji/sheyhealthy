
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'
import moment from 'moment'

function UsersList() {

  const [users, setUsers] = useState([])
  const dispath=useDispatch()

  const getUsersData=async()=>{
    try {
      dispath(showLoading())
      const response=await axios.get('/api/admin/get-all-users',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      dispath(hideLoading())

      if(response.data.success){
        dispath(setUsers(response.data.data))
      }
    } catch (error) {
      dispath(hideLoading())
    }
  }

  useEffect(() => {
    getUsersData();
  }, [])

  const columns=[
    {
      title:"Name",
      dataIndex:"name"
    },
    {
      title:"Email",
      dataIndex:"email"
    },
    {
      title:"Created At",
      dataIndex:"createdAt",
      render:(record,text)=>moment(record.createAt).format("DD-MM-YYYY")
    },
    {
      title:"Actions",
      dataIndex:"actions",
      render:(text,record)=>(
        <div className='d-flex'>
          <h1 className='anchor'>Block</h1>
        </div>
      )
    }
  ]
  

  return (
    <Layout>
        <h1 className='page-title'>Users List</h1>

        <Table columns={columns} dataSource={users} />
    </Layout>
  )
}

export default UsersList