<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div
      v-if="action !== 'view'"
      class="text-subtitle2 text-bold"
    >{{ action === "create" ? "Nouvelle " : "Modification du " }} devise</div>
    <div class="row">
      <div class="col-md-6 q-pa-sm q-pb-xs">
        <div class="text-caption">Nom de la devise</div>
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
              (val && val.length > 0) || 'Veuillez saisir le nom de la devise'
          ]"
        />
      </div>
      <div class="col-md-6 q-pa-sm q-pb-xs">
        <div class="text-caption">Symbole</div>
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="symbol"
          class="q-mb-md"
          hint
          size="sm"
          lazy-rules
          :rules="[
            val =>
              (val && val.length > 0) || 'Veuillez saisir le nom de la devise'
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
      <div class="col-md-12 q-pa-sm q-pt-xs">
        <q-toggle v-if="deletable" v-model="active" color="blue-10" label="Actif ?" size="sm" />
      </div>
    </div>
    <div v-if="deletable && symbol !== ''" class="row">
      <div class="col-md-5 col-sm-5 col-xs-5 q-pa-sm q-pt-xs">
        <q-input disable dense filled v-model="defaultCurrency" :suffix="symbol" />
      </div>

      <div class="col-md-2 col-sm-2 col-xs-2 q-pa-sm text-center text-h6 text-bold text-grey-10">
        <q-icon class="q-pl-md" name="fas fa-exchange-alt" />
      </div>
      <div class="col-md-5 col-sm-5 col-xs-5 q-pa-sm q-pt-xs">
        <q-input
          filled
          dense
          v-model="conversionValue"
          :suffix="getDefaultCurrency.symbol"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Veuillez saisir le montant',
            val =>
              (val && !isNaN(val) && parseFloat(val) > 0) ||
              'Veuillez un montant valide'
          ]"
        />
      </div>
    </div>
    <div class="row">
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
  props: ['action', 'row', 'getDefaultCurrency'],
  data () {
    return {
      moduleName: 'currency',
      moduleLabel: 'La devise',
      name: '',
      defaultCurrency: 1,
      symbol: '',
      description: '',
      active: true,
      deletable: true,
      conversionValue: 1
    }
  },
  created () {
    if (this.action === 'edit' || this.action === 'view') {
      this.name = this.row.name
      this.description = this.row.description
      this.symbol = this.row.symbol
      this.active = this.row.active
      this.deletable = this.row.deletable
      this.conversionValue = this.row.conversionValue
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          const data = {
            name: this.name,
            description: this.description,
            active: this.active,
            symbol: this.symbol,
            conversionValue: this.conversionValue
          }
          let url = 'currency/create'
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
                this.row.symbol = this.symbol
                this.row.description = this.description
                this.row.active = this.active
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
