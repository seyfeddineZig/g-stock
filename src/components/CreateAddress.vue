<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div
      v-if="action !== 'view'"
      class="text-subtitle2 text-bold"
    >{{ action === "create" ? "Nouvelle " : "Modification de l'" }} adresse</div>
    <div class="row">
      <div class="col-md-9 q-pa-sm q-pb-xs">
        <div class="text-caption">Rue</div>
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="road"
          class="q-mb-md"
          hint
          size="sm"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Veuillez saisir le nom de la rue'
          ]"
        />
      </div>
      <div class="col-md-3 q-pa-sm q-pb-xs">
        <div class="text-caption">Code postal</div>
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="postalCode"
          class="q-mb-md"
          hint
          size="sm"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Veuillez saisir le code']"
        />
      </div>
      <div class="col-md-6 q-pa-sm q-pb-xs">
        <div class="text-caption">Pays</div>
        <q-select
          filled
          dense
          v-model="country"
          :options="countries"
          lazy-rules
          :rules="[val => (val && val !== null) || 'Veuillez choisir un pays']"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click.stop @click="$emit('create-country')" />
          </template>
        </q-select>
      </div>
      <div class="col-md-6 q-pa-sm q-pb-xs">
        <div class="text-caption">Département</div>
        <q-select
          filled
          dense
          v-model="department"
          :options="departments"
          lazy-rules
          :rules="[
            val => (val && val !== null) || 'Veuillez choisir un département'
          ]"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click.stop @click="$emit('create-department')" />
          </template>
        </q-select>
      </div>
      <div class="col-md-6 q-pa-sm q-pt-xs">
        <q-toggle v-model="active" color="blue-10" label="Actif ?" size="sm" />
      </div>

      <div class="col-md-12 q-mt-md text-right q-pa-sm">
        <q-btn
          v-if="action !== 'view'"
          label="Enregistrer"
          type="submit"
          color="blue-10"
          size="sm"
          class="q-pa-sm"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
export default {
  props: ['action', 'row'],
  data () {
    return {
      moduleName: 'address',
      moduleLabel: "L'adresse",
      road: '',
      postalCode: '',
      country: null,
      department: null,
      active: true
    }
  },
  computed: {
    countries () {
      const countries = this.$store.getters['defaultstore/getAll']('country')
      countries.forEach(el => {
        el.label = el.name
      })
      return countries
    },
    departments () {
      if (this.country) {
        const departments = this.$store.getters['defaultstore/getByAttribute']({
          moduleName: 'department',
          attribute: 'countryId',
          value: this.country.id
        })
        departments.forEach(el => {
          el.label = el.name
        })
        return departments
      } else {
        return []
      }
    }
  },
  created () {
    if (this.action === 'edit' || this.action === 'view') {
      this.road = this.row.road
      this.postalCode = this.row.postalCode
      this.active = this.row.active
      this.department = this.getDepartment(this.row.departmentId)
      this.country = this.getCountry()
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          const data = {
            road: this.road,
            postalCode: this.postalCode,
            departmentId: this.department.id,
            active: this.active
          }
          let url = this.moduleName + '/create'
          let method = 'post'
          let action = 'crée'
          if (this.action === 'edit') {
            url = this.moduleName + '/update/' + this.row.id
            method = 'put'
            action = 'modifié'
          }
          this.$axios[method](url, data).then(res => {
            if (res) {
              const message =
                this.moduleLabel + ' a été ' + action + ' avec succés'

              if (this.action === 'edit') {
                this.row.road = this.road
                this.row.postalCode = this.postalCode
                this.row.active = this.active
                this.row.departmentId = this.department.id
                this.$root.$emit('add-row', {
                  row: this.row,
                  moduleName: this.moduleName
                })
              } else {
                this.$root.$emit('add-row', {
                  row: res.data,
                  moduleName: this.moduleName
                })
              }

              this.$q.notify({
                type: 'positive',
                position: 'bottom-right',
                timeout: 1500,
                message: message
              })
              this.$emit('close-dialog')
            }
          })
        }
      })
    },
    getDepartment (id) {
      const dep = this.$store.getters['defaultstore/getOne']({
        moduleName: 'department',
        id: id
      })
      dep.label = dep.name
      return dep
    },
    getCountry () {
      const country = this.$store.getters['defaultstore/getOne']({
        moduleName: 'country',
        id: this.department.countryId
      })
      country.label = country.name
      return country
    }
  }
}
</script>

<style></style>
