import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate =useNavigate()
    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
    },[])
  return (
    <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard, here you can access your personalized learning resources and track your progress.</p>

        <Link to={"/quiz"}> Take Quiz</Link>
        <Link to={"/leaderboard"}> Leaderboard</Link>
    </div>
  )
}

export default Dashboard