<template>
  <Menu>
    <router-link to="/">Home</router-link>
    <router-link to="/doctor">Doctors</router-link>
    <router-link to="/patient">Patients</router-link>
    <router-link to="/appointment">Appointments</router-link>
  </Menu>
  <router-view/>
</template>

<script>
import Menu from './components/Menu.vue'

export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>