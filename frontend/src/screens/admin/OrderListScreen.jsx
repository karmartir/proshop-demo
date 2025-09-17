import React from 'react'
import { Table } from 'react-bootstrap'
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice'
import Message from '../../components/Message'
import Loader from '../../components/Loader'

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery()

  return (
   <div>
    order admin
   </div>
  )
}

export default OrderListScreen
