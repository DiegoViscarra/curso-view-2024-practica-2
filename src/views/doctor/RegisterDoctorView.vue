<template>
  <div>
    <h1>Register Doctor</h1>
    <form @submit.prevent="submitForm()">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="form.name" :class="{ 'is-invalid': errors.name }"
          placeholder="Enter the name" />
        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <label for="specialty">Specialty:</label>
        <input type="text" id="specialty" v-model="form.specialty" :class="{ 'is-invalid': errors.specialty }"
          placeholder="Enter the specialty" />
        <div v-if="errors.specialty" class="invalid-feedback">{{ errors.specialty }}</div>
      </div>

      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" v-model="form.phone" :class="{ 'is-invalid': errors.phone }"
          placeholder="Ingrese el teléfono" />
        <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
      </div>

      <div class="form-group">
        <label for="date">Admission Date:</label>
        <input type="date" id="date" v-model="form.admissionDate" :class="{ 'is-invalid': errors.date }"
          placeholder="Enter the admission date" />
        <div v-if="errors.date" class="invalid-feedback">{{ errors.date }}</div>
      </div>

      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RegisterDoctor',
  data() {
    return {
      form: {
        name: null,
        specialty: null,
        phone: null,
        admissionDate: null
      },
      errors: {}
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.name) {
        this.errors.name = 'Name is required.';
      }

      if (!this.form.specialty) {
        this.errors.specialty = 'Specialty is required.';
      }

      if (!this.form.phone) {
        this.errors.phone = 'Phone is required.';
      } else if (!/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}([-.\s]?\d{1,9})+$/.test(this.form.phone)) {
        this.errors.phone = 'Phone is not valid.';
      }

      if (!this.form.admissionDate) {
        this.errors.date = 'Date is required.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        this.save();
        this.form = {
          name: null,
          specialty: null,
          phone: null,
          admissionDate: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/doctors", this.form)
        .then(function (response) {
          if (response.status == '201') {
            vm.$emit('on-register', response.data);
          }
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  },
  computed: {
    ...mapGetters(['getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    }
  },
}
</script>