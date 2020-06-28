<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div
      v-if="action !== 'view'"
      class="text-subtitle2 text-bold"
    >{{ action === "create" ? "Nouvelle " : "Modification de la" }} banque</div>
    <div class="row">
      <div class="col-md-9 q-pa-sm q-pb-xs">
        <div class="text-caption">Nom de la banque</div>
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="name"
          class="q-mb-md"
          hint
          size="sm"
          lazy-rules
          :rules="[
            val =>
              (val && val.length > 0) || 'Veuillez saisir le nom de la banque'
          ]"
        />
      </div>
      <div class="col-md-3 q-pa-sm q-pb-xs">
        <div class="text-caption">BIC \ SWIFT</div>
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="bic_swift"
          class="q-mb-md"
          hint
          size="sm"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Veuillez saisir le BIC ou SWIFT'
          ]"
        />
      </div>
      <div class="col-md-12 q-pa-sm q-pb-xs">
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
      moduleName: 'bank',
      moduleLabel: 'La banque',
      name: '',
      bic_swift: '',
      country: null,
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
    }
  },
  created () {
    if (this.action === 'edit' || this.action === 'view') {
      this.name = this.row.name
      this.bic_swift = this.row.bic_swift
      this.active = this.row.active
      this.country = this.getCountry(this.row.countryId)
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          const data = {
            name: this.name,
            bic_swift: this.bic_swift,
            countryId: this.country.id,
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
                this.row.name = this.name
                this.row.bic_swift = this.bic_swift
                this.row.active = this.active
                this.row.countryId = this.country.id
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
    getCountry (id) {
      const country = this.$store.getters['defaultstore/getOne']({
        moduleName: 'country',
        id: id
      })
      country.label = country.name
      return country
    }
  }
}
</script>

<style></style>
