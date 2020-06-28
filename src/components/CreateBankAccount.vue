<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div
      v-if="action !== 'view'"
      class="text-subtitle2 text-bold"
    >{{ action === "create" ? "Nouvelle " : "Modification de la" }} banque</div>
    <div class="row">
      <div class="col-md-9 q-pa-sm q-pb-xs">
        <div class="text-caption">Numéro du compte</div>
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="numAccount"
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

      <div class="col-md-12 q-pa-sm q-pb-xs">
        <div class="text-caption">Banque</div>
        <q-select
          filled
          dense
          v-model="bank"
          :options="banks"
          lazy-rules
          :rules="[val => (val && val !== null) || 'Veuillez choisir une banque']"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click.stop @click="$emit('create-bank')" />
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
      moduleName: 'bankaccount',
      moduleLabel: 'Le compte bancaire',
      numAccount: '',
      bankId: '',
      active: true
    }
  },
  computed: {
    banks () {
      const banks = this.$store.getters['defaultstore/getAll']('bank')
      banks.forEach(el => {
        el.label = el.name
      })
      return banks
    }
  },
  created () {
    if (this.action === 'edit' || this.action === 'view') {
      this.numAccount = this.row.numAccount
      this.active = this.row.active
      this.bank = this.getBank(this.row.bankId)
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          const data = {
            numAccount: this.numAccount,
            bankId: this.bank.id,
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
                this.row.bankAccount = this.bankAccount
                this.row.active = this.active
                this.row.bankId = this.bank.id
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
    getBank (id) {
      const bank = this.$store.getters['defaultstore/getOne']({
        moduleName: 'bank',
        id: id
      })
      bank.label = bank.name
      return bank
    }
  }
}
</script>

<style></style>
