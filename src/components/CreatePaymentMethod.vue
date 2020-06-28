<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div v-if="action !== 'view'" class="text-subtitle2 text-bold">
      {{ action === "create" ? "Nouvelle " : "Modification du " }} méthode de
      règlement
    </div>
    <div class="row">
      <div class="col-md-12 q-pa-sm q-pb-xs">
        <div class="text-caption">Nom de la méthode de règlement</div>
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="name"
          class="q-mb-md"
          hint=""
          size="sm"
          lazy-rules
          :rules="[
            val =>
              (val && val.length > 0) ||
              'Veuillez saisir le nom de la méthode de règlement'
          ]"
        />
      </div>
      <div class="col-md-12 q-pa-sm q-pt-xs">
        <div class="text-caption">Description</div>
        <q-input
          filled
          :readonly="action === 'view' ? true : false"
          type="textarea"
          v-model="description"
          label
          hint="Description"
        />
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
      moduleName: 'paymentmethod',
      moduleLabel: 'La méthode de règlement',
      name: '',
      description: '',
      active: true
    }
  },
  created () {
    if (this.action === 'edit' || this.action === 'view') {
      this.name = this.row.name
      this.description = this.row.description
      this.active = this.row.active
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          const data = {
            name: this.name,
            description: this.description,
            duration: this.duration,
            active: this.active
          }
          let url = 'paymentmethod/create'
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
                this.row.description = this.description
                this.row.active = this.active
                this.row.duration = this.duration
                this.$root.$emit('add-row', {
                  row: this.row,
                  moduleName: this.moduleName
                })
              } else {
                res.data.country = this.country
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
    }
  }
}
</script>

<style></style>
