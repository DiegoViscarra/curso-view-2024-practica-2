<template>
  <div>
    <Modal v-model:modelValue="showNewModal">
      <RegisterDoctorView @on-register="onRegister($event)" />
    </Modal>
    <Modal v-model:modelValue="showEditModal">
      <EditDoctorView @on-update="onUpdate($event)" :item="itemToEdit" />
    </Modal>
    <h1>Doctors List</h1>
    <button @click="showNewModal = true" class="btn btn-primary">New</button>
    <button @click="search()" class="btn btn-lith" style="float:right">Search</button>
    <input type="search" style="float:right" v-model="textToSearch" @search="search()">
    <div style="margin: 20px 0;">
      <h3>Filter:</h3>
      <form @submit.prevent="filter()">
        <label for="date"> Admission Date: </label>
        <input type="date" id="date" v-model="dateFilter" placeholder="Enter admission date" />
        <button type="submit" class="btn btn-lith">Filter</button>
      </form>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Specialty</th>
          <th>Phone</th>
          <th>Admission Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in itemList" :key="index">
          <td>{{ 1 + index }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.specialty }}</td>
          <td>{{ item.phone }}</td>
          <td>{{ item.admissionDate }}</td>
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
import RegisterDoctorView from './RegisterDoctorView.vue'
import EditDoctorView from './EditDoctorView.vue'

export default {
  name: 'Doctor',
  data() {
    return {
      showNewModal: false,
      showEditModal: false,
      itemToEdit: null,
      textToSearch: '',
      textToFilter: '',
      itemList: [],
      dateFilter: null
    }
  },
  components: {
    Modal,
    RegisterDoctorView,
    EditDoctorView
  },
  methods: {
    getList() {
      const vm = this;
      const query = `${this.textToFilter} ${this.textToSearch}`.trim();
      this.axios.get(this.baseUrl + "/doctors?q=" + query)
        .then(function (response) {
          vm.itemList = response.data;
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
        this.axios.delete(this.baseUrl + "/doctors/" + id)
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
  }
}
</script>