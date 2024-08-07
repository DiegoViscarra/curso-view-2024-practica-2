<template>
  <div>
    <Modal v-model:modelValue="showNewModal">
      <RegisterPatientView @on-register="onRegister($event)" />
    </Modal>
    <Modal v-model:modelValue="showEditModal">
      <EditPatientView @on-update="onUpdate($event)" :item="itemToEdit" />
    </Modal>
    <h1>Patients List</h1>
    <button @click="showNewModal = true" class="btn btn-primary">New</button>
    <button @click="search()" class="btn btn-lith" style="float:right">Search</button>
    <input type="search" style="float:right" v-model="textToSearch" @search="search()">
    <div style="margin: 20px 0;">
      <h3>Filters:</h3>
      <form @submit.prevent="filter()">
        <label for="date"> Birth Date: </label>
        <input type="date" id="date" v-model="filter.date" placeholder="Enter birth date" />

        <label for="gender"> Gender: </label>
        <select id="gender" v-model="filter.gender">
          <option value="">All</option>
          <option :value="gender" v-for="(gender, index) in genderList" :key="`gender-${index}`">{{ gender }}</option>
        </select>
        
        <button type="submit" class="btn btn-lith">Filter</button>
      </form>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Birth Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in itemList" :key="index">
          <td>{{ 1 + index }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.gender }}</td>
          <td>{{ item.phone }}</td>
          <td>{{ item.birthDate }}</td>
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
import RegisterPatientView from './RegisterPatientView.vue'
import EditPatientView from './EditPatientView.vue'

export default {
  name: 'Patient',
  data() {
    return {
      showNewModal: false,
      showEditModal: false,
      itemToEdit: null,
      textToSearch: '',
      textToFilter: '',
      itemList: [],
      genderList: [
        "Male",
        "Female"
      ],
      filter: {
        date: null,
        gender:''
      }
    }
  },
  components: {
    Modal,
    RegisterPatientView,
    EditPatientView
  },
  methods: {
    getList() {
      const vm = this;
      const query = `${this.textToFilter} ${this.textToSearch}`.trim();
      this.axios.get(this.baseUrl + "/patients?q=" + query)
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
        this.axios.delete(this.baseUrl + "/patients/" + id)
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
      if (this.filter.date != null && this.filter.date != '') {
        this.textToFilter += "&birthDate=" + this.filter.date;
      }
      if (this.filter.gender != null && this.filter.gender != '') {
        this.textToFilter += "&gender=" + this.filter.gender;
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