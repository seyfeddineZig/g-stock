<template>
  <q-page padding>
    <div class="row justify-center">
      <div v-if="loading" class="col-md-3 justify-center">
        <q-circular-progress
          indeterminate
          size="100px"
          :thickness=".05"
          color="blue-10"
          track-color="grey-3"
          class="q-ma-md"
        />
      </div>
      <div v-else class="col-md-3">
        <div class="text-subtitle1 text-bold">S'authentifier</div>
        <q-form ref="form" @submit="authentication" class="q-gutter-md">
          <q-input
            v-model="username"
            filled
            dense
            type="text"
            hint="Nom d'utilisateur"
            lazy-rules
            :rules="[
              val =>
                (val && val.length > 0) ||
                'Veuillez saisir le nom d\'utilisateur'
            ]"
          ></q-input>
          <q-input
            v-model="password"
            filled
            dense
            :type="isPwd ? 'password' : 'text'"
            hint="Mot de passe"
            lazy-rules
            :rules="[
              val =>
                (val && val.length > 0) || 'Veuillez saisir le mot de passe'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'far fa-eye-slash' : 'far fa-eye'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                size="20px"
                rounded
              />
            </template>
          </q-input>
          <div class="row">
            <div class="col-md-12 row justify-end">
              <q-btn color="blue-10" text-color="white" type="submit" label="Valider" size="md" />
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Auth',
  data () {
    return {
      username: '',
      password: '',
      isPwd: true,
      error: '',
      loading: false
    }
  },
  methods: {
    authentication () {
      this.loading = true
      this.$refs.form.validate().then(success => {
        if (success) {
          const data = {
            email: this.username,
            password: this.password
          }
          this.$axios.post('auth', data).then(res => {
            const d = new Date().getTime()
            localStorage.setItem('TOKEN', res.data.token)
            localStorage.setItem('TOKEN_EXPIRATION', d)
            this.$router.push('/')
          })
        }
      })
      this.loading = false
    }
  }
}
</script>
