import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";

const Dashboard = () => {
  let navigate = useNavigate();

  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("devroom")) {
      navigate("/users/login");
    }
    setLoggedIn(true);
  }, []);

  const getProfile = async () => {
    let { status, data } = await axios.get("/api/profiles/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    })
    if (status == 200) {
      setProfile(data.profile);
    }
  }

  const getUser = async () => {
    let { data } = await axios.get("/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    setUser(data.user);
    console.log(data.user);
    setLoading(false);
  }

  useEffect(() => {
    if (loggedIn) {
      getUser();
      getProfile();
    }
  }, [loggedIn]);

  let clickDeleteExperience = async(experienceId) => {
    const {data} = await axios.delete(`/api/profiles/experience/${experienceId}`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    })
    Swal.fire("Experience deleted", "", "success");
    setProfile(data.profile);
  }

  let clickDeleteEducation = async(educationId) => {
    const {data} = await axios.delete(`/api/profiles/education/${educationId}`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    })
    Swal.fire("Experience deleted", "", "success");
    setProfile(data.profile);
  }

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard