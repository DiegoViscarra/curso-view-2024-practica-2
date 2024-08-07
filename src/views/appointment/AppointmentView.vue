<template>
  <div>
    <Modal v-model:modelValue="showNewModal">
      <RegisterAppointmentView @on-register="onRegister($event)" />
    </Modal>
    <Modal v-model:modelValue="showEditModal">
      <EditAppointmentView @on-update="onUpdate($event)" :item="itemToEdit" />
    </Modal>
    <h1>Appointments List</h1>
    <button @click="showNewModal = true" class="btn btn-primary">New</button>
    <button @click="search()" class="btn btn-lith" style="float:right">Search</button>
    <input type="search" style="float:right" v-model="textToSearch" @search="search()">
    <div style="margin: 20px 0;">
      <h3>Filters:</h3>
      <form @submit.prevent="filter()">
        <label for="date"> Date: </label>
        <input type="date" id="date" v-model="filter.date" placeholder="Enter date" />

        <label for="doctor"> Doctor: </label>
        <select id="doctor" v-model="filter.doctorId">
          <option value="">All</option>
          <option :value="doctor.id" v-for="(doctor, index) in doctorList" :key="`doctor-${index}`">{{ doctor.name }}
          </option>
          </select>
        <button type="submit" class="btn btn-lith">Filter</button>
      </form>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Hour</th>
          <th>Doctor</th>
          <th>Patient</th>
          <th>Motive</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in itemList" :key="index">
          <td>{{ 1 + index }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.hour }}</td>
          <td>{{ item.doctor.name }}</td>
          <td>{{ item.patient.name }}</td>
          <td>{{ item.motive }}</td>
          <td>
            <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Edit</button>
            <button @click="delete(item.id)" class="btn btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex'
import Modal from '../../components/Modal.vue'
import RegisterAppointmentView from './RegisterAppointmentView.vue'
import EditAppointmentView from './EditAppointmentView.vue'

export default {
  name: 'Appointment',
  data() {
    return {
      showNewModal: false,
      showEditModal: false,
      itemToEdit: null,
      textToSearch: '',
      textToFilter: '',
      itemList: [],
      doctorList: [],
      filter: {
          date: null,
          doctorId: ''
      }
    }
  },
  components: {
    Modal,
    RegisterAppointmentView,
    EditAppointmentView
  },
  methods: {
    getList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/appointments?_sort=date,hour&_order=desc,asc&_expand=doctor&_expand=patient" + this.textToFilter + "&q=" + this.textToSearch)
        .then(function (response) {
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getDoctorList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/doctors")
        .then(function (response) {
          vm.doctorList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    edit(item) {
      this.itemToEdit = Object.assign({}, item);
      this.showEditModal = true;
    },
    delete(id) {
      if (confirm("Are you sure to delete this register?")) {
        const vm = this;
        this.axios.delete(this.baseUrl + "/appointments/" + id)
          .then(function (response) {
            vm.getList();
            vm.$toast.show("Register deleted.", "danger");
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    },
    search() {
      this.getList();
    },
    filter() {
      this.textToFilter = '';
      if (this.dateFilter != null && this.dateFilter != '') {
        this.textToFilter += "&admissionDate=" + this.dateFilter;
      }
      if (this.filter.doctorId != null && this.filter.doctorId != '') {
        this.textToFilter += "&doctorId=" + this.filter.doctorId;
      }
      this.getList();
    },
    onRegister(event) {
      this.getList();
      this.showNewModal = false;
      this.$toast.show('Successful registration', 'success');
    },
    onUpdate(event) {
      this.getList();
      this.showEditModal = false;
      this.itemToEdit = null;
      this.$toast.show('Successful edition', 'info');
    },
    showToast(message, type) {
      this.$toast.show(message, type);
    }
  },
  computed: {
    ...mapGetters(['getBaseUrl']),
    baseUrl() {
        return this.getBaseUrl
    }
  },
  mounted() {
    this.getList();
    this.getDoctorList();
  }
}
</script>