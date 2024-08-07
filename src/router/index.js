import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DoctorView from '../views/doctor/DoctorView'
import PatientView from '../views/patient/PatientView'
import AppointmentView from '../views/appointment/AppointmentView'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/doctor',
    name: 'doctor',
    component: DoctorView
  },
  {
    path: '/patient',
    name: 'patient',
    component: PatientView
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: AppointmentView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
