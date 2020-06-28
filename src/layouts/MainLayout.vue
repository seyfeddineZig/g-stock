<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-grey-1 text-grey-10">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <div class="text-h6">{{ authUser ? authUser.name : "" }}</div>
        </q-toolbar-title>

        <div>
          <q-btn color="white" text-color="black" label="deconnexion" @click="disconnect()" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-blue-10">
      <q-list dense>
        <q-item-label header>
          <div class="text-body2 text-white">Données de base</div>
        </q-item-label>
        <SidebarLink v-for="link in SidebarLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SidebarLink from 'components/SidebarLink'
import io from 'socket.io-client'

export default {
  name: 'MainLayout',

  components: {
    SidebarLink
  },

  data () {
    return {
      socket: io(this.$axios.defaults.baseURL.replace('api/', '')),
      leftDrawerOpen: false,
      message: '',
      SidebarLinks: [
        {
          title: "Groupes d'utilisateurs",
          icon: '',
          link: '/group'
        },
        {
          title: 'Catégories',
          icon: '',
          link: '/product/category'
        },
        {
          title: 'Taxe',
          icon: '',
          link: '/product/tax'
        },
        {
          title: 'Condition de règlement',
          icon: '',
          link: '/provider/paymentcondition'
        },
        {
          title: 'Méthode de règlement',
          icon: '',
          link: '/provider/paymentmethod'
        },
        {
          title: 'Devise',
          icon: '',
          link: '/settings/currency'
        },
        {
          title: 'Pays',
          icon: '',
          link: '/settings/country'
        },
        {
          title: 'Départements',
          icon: '',
          link: '/settings/department'
        },
        {
          title: 'Adresse',
          icon: '',
          link: '/settings/address'
        },
        {
          title: 'Banque',
          icon: '',
          link: '/settings/bank'
        },
        {
          title: 'Catégorie fournisseur',
          icon: '',
          link: '/settings/customercategory'
        }
      ]
    }
  },
  computed: {
    authUser: {
      get () {
        return this.$store.getters['auth/getAuthUser']
      },
      set () {}
    }
  },
  created () {
    this.getAuthUser()
    this.$root.$on('add-row', this.addRow)
    this.$root.$on('delete-row', this.deleteRow)
    this.$root.$on(
      'add-row-to-specific-attribut',
      this.addRowToSpecificAttribute
    )
  },
  mounted () {
    this.socket.on('CREATE/UPDATE', ({ row, moduleName }) => {
      this.$store.dispatch('defaultstore/addRow', {
        row: row,
        moduleName: moduleName
      })
      this.$root.$emit('row-added', {
        row: row,
        moduleName: moduleName
      })
    })
    this.socket.on(
      'CREATE/UPDATE_SPECIFIC_ATTRIBUTE',
      ({ row, moduleName, id, attribute }) => {
        this.$store.dispatch('defaultstore/addRowToSpecificAttribute', {
          row: row,
          moduleName: moduleName,
          id: id,
          attribute: attribute
        })
      }
    )
    this.socket.on(
      this.moduleName + '_DELETE',
      ({ id, moduleName, moduleLabel }) => {
        this.$store.commit('defaultstore/deleteRow', {
          id: id,
          moduleName: moduleName,
          moduleLabel: moduleLabel
        })
      }
    )
  },
  methods: {
    getAuthUser () {
      this.$axios
        .get('profile')
        .then(res => {
          this.$store.dispatch('auth/setAuthUser', res.data.user)
        })
        .catch(err => {
          this.$q.notify({
            position: 'bottom-right',
            message: err.response,
            color: 'red'
          })
        })
    },
    disconnect () {
      localStorage.removeItem('TOKEN')
      localStorage.removeItem('TOKEN_EXPIRATION')
      this.$store.dispatch('auth/setAuthUser', null)
      this.$router.push('/login')
    },
    addRow ({ row, moduleName }) {
      this.socket.emit('CREATE/UPDATE', {
        row: row,
        moduleName: moduleName
      })
    }
  }
}
</script>
