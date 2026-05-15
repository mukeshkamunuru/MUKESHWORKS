import axios from 'axios'

const BASE = 'http://127.0.0.1:8000/api'

const getToken = () => localStorage.getItem('access')

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
})

export const login         = (data) => axios.post(`${BASE}/auth/login/`, data)
export const register      = (data) => axios.post(`${BASE}/auth/register/`, data)
export const getMe         = ()     => axios.get(`${BASE}/auth/me/`, authHeaders())
export const getRecords    = ()     => axios.get(`${BASE}/joining-ids/`, authHeaders())
export const createRecord  = (data) => axios.post(`${BASE}/joining-ids/`, data, authHeaders())
export const deleteRecord  = (id)   => axios.delete(`${BASE}/joining-ids/${id}/delete/`, authHeaders())
