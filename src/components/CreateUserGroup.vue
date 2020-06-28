<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div v-if="action !== 'view'" class="text-subtitle2 text-bold">
      {{ action === "create" ? "Nouveau " : "Modification du " }} groupe
      d'utilisateurs
    </div>

    <q-tab-panels v-model="panel" animated class="no-padding q-ma-xs">
      <q-tab-panel name="first">
        <q-input
          filled
          dense
          :readonly="action === 'view' ? true : false"
          v-model="name"
          class="q-mb-md"
          hint="Nom du groupe *"
          size="sm"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Veuillez saisir le nom du groupe'
          ]"
        />
        <q-input
          filled
          :readonly="action === 'view' ? true : false"
          type="textarea"
          v-model="description"
          label
          hint="Description"
        />
        <div class="row text-subtitle2 q-mt-md q-mb-md">
          <div class>Type d'authentification:</div>
        </div>

        <q-list>
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio
                :disable="action === 'view' ? true : false"
                v-model="authType"
                val="PWD"
                color="blue-10"
                size="lg"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <div class="text-caption">
                  Nom d'utilisateur et mot de passe
                </div>
              </q-item-label>
              <q-item-label caption
                >Recommandé pour les utilisateurs qui ont accés aux données de
                base</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio
                :disable="action === 'view' ? true : false"
                v-model="authType"
                color="blue-10"
                val="PIN"
                size="lg"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <div class="text-caption">PIN</div>
              </q-item-label>
              <q-item-label caption
                >Recommandé pour les utilisateurs qui ont accés limité ( Ex: POS
                ..)</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
        <div class="row justify-end q-mt-md">
          <q-btn
            label="Suivant"
            type="button"
            size="sm"
            class="q-pa-sm"
            color="blue-10"
            @click="nextPanel"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="next">
        <div class="text-subtitle1 text-bold">Privilèges</div>
        <div v-if="!disablePrivileges" class="text-caption text-red">
          Vous ne pouvez pas modifier les privilèges de ce groupe
        </div>
        <div v-else class="text-caption">
          Cochez privilèges que vous voulez affecter au groupe
        </div>

        <PrivilegesComponent
          v-on:set-privileges="setPrivileges"
          :selected="privileges"
          :disable="action === 'create' ? true : disablePrivileges"
        ></PrivilegesComponent>
        <div class="row">
          <div class="col-md-12">
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Précedent"
                type="button"
                color="grey-2 text-grey-10"
                size="sm"
                class="q-pa-sm"
                @click="prevPanel"
              />
              <q-btn
                v-if="action !== 'view' && panel === 'next'"
                label="Enregistrer"
                type="submit"
                color="blue-10"
                size="sm"
                class="q-pa-sm"
              />
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-form>
</template>

<script>
import PrivilegesComponent from 'components/Privileges'
export default {
  props: ['action', 'row'],
  name: 'CreateUserGroup',
  data () {
    return {
      name: '',
      description: '',
      authType: 'PWD',
      privileges: [],
      panel: 'first',
      disablePrivileges: false
    }
  },
  components: {
    PrivilegesComponent
  },
  created () {
    if (this.action === 'edit' || this.action === 'view') {
      this.name = this.row.name
      this.description = this.row.description
      this.authType = this.row.authType
      if (this.row.deletable && this.action !== 'view') {
        this.disablePrivileges = true
      }

      this.row.group_privileges.forEach(el => {
        this.privileges.push(el.privilegeId)
      })
    }
  },
  methods: {
    nextPanel () {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.panel = 'next'
        }
      })
    },
    prevPanel () {
      this.panel = 'first'
    },
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          const groupPrivileges = []
          this.privileges.forEach(el => {
            groupPrivileges.push({ privilegeId: el })
          })
          const data = {
            name: this.name,
            description: this.description,
            authType: this.authType,
            group_privileges: groupPrivileges
          }
          let url = 'group/create'
          let method = 'post'
          let action = 'crée'
          if (this.action === 'edit') {
            url = 'group/update/' + this.row.id
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
                this.row.authType = this.authType
                this.row.group_privileges = groupPrivileges
                this.$emit('update-row', this.row)
              } else {
                this.$emit('add-row', res.data)
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
    setPrivileges (privileges) {
      this.privileges = privileges
    }
  }
}
</script>

<style></style>
