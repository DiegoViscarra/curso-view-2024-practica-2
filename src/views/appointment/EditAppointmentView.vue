<template>
  <div>
    <h1>Edit Appointment</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="doctor">Doctor:</label>
        <select id="doctor" v-model="form.doctorId" :class="{ 'is-invalid': errors.doctorId }">
          <option :value="doctor.id" v-for="(doctor, index) in doctorList" :key="`doctor-${index}`">{{ doctor.name }}
          </option>
        </select>
        <div v-if="errors.doctorId" class="invalid-feedback">{{ errors.doctorId }}</div>
      </div>

      <div class="form-group">
        <label for="patient">Patient:</label>
        <select id="patient" v-model="form.patientId" :class="{ 'is-invalid': errors.patientId }">
          <option :value="patient.id" v-for="(patient, index) in patientList" :key="`patient-${index}`">{{ patient.name }}
          </option>
        </select>
        <div v-if="errors.patientId" class="invalid-feedback">{{ errors.patientId }}</div>
      </div>

      <div class="form-group">
        <label for="motive">Motive:</label>
        <input type="text" id="motive" v-model="form.motive" :class="{ 'is-invalid': errors.motive }"
          placeholder="Enter the motive" />
        <div v-if="errors.motive" class="invalid-feedback">{{ errors.motive }}</div>
      </div>

      <div class="form-group">
        <label for="date">Date:</label>
        <input type="date" id="date" v-model="form.date" :class="{ 'is-invalid': errors.date }"
          placeholder="Enter the date" />
        <div v-if="errors.date" class="invalid-feedback">{{ errors.date }}</div>
      </div>

      <div class="form-group">
        <label for="hour">Hour:</label>
        <input type="time" id="hour" v-model="form.hour" :class="{ 'is-invalid': errors.hour }"
          placeholder="Enter the hour" />
        <div v-if="errors.hour" class="invalid-feedback">{{ errors.hour }}</div>
      </div>

      <button type="submit" class="btn btn-primary">Edit</button>
    </form>
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'EditAppointment',
  data() {
    return {
      doctorList: [],
      patientList: [],
      errors: {}
    };
  },
  props: ['item'],
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.doctorId) {
        this.errors.doctorId = 'Doctor is required.';
      }

      if (!this.form.patientId) {
        this.errors.patientId = 'Patient is required.';
      }

      if (!this.form.motive) {
        this.errors.motive = 'Motive is required.';
      }

      if (!this.form.date) {
        this.errors.date = 'Date is required.';
      }

      if (!this.form.hour) {
        this.errors.hour = 'Hour is required.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        this.save();
      }
    },
    save() {
      const vm = this;
      this.axios.patch(this.baseUrl + "/appointments/" + this.item.id, this.form)
        .then(function (response) {
          if (response.status == '200') {
            vm.$emit('on-update', response.data);
          }
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
    getPatientList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/patients")
        .then(function (response) {
          vm.patientList = response.data;
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
    },
    form() {
      return Object.assign({}, this.item);
    }
  },
  mounted() {
    this.getDoctorList();
    this.getPatientList();
  }
}
</script>