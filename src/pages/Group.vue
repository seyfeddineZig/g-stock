<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-end">
      <q-btn
        color="blue-10"
        text-color="white"
        class="q-pa-sm"
        size="sm"
        label="Nouveau groupe"
        @click="
          dialogAction = 'create';
          createDialog = true;
        "
      />
      <q-dialog v-model="createDialog">
        <q-card>
          <q-card-section>
            <CreateUserGroup
              v-on:close-dialog="createDialog = false"
              v-on:update-row="updateRow"
              v-on:add-row="addRow"
              :action="dialogAction"
              :row="rowData"
            ></CreateUserGroup>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <div class>
      <q-table
        title="Groupes des utilisateurs"
        :data="data"
        :columns="columns"
        no-data-label="Aucune ligne n'a été trouvée"
        row-key="name"
        class="no-shadow"
        :pagination.sync="pagination"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Recherche"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <div class="text-bold">{{ col.label }}</div>
            </q-th>
            <q-th>
              <div class="text-bold">Options</div>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" :key="`m_${props.row.id}`">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">{{
              col.value
            }}</q-td>
            <q-td auto-width>
              <q-btn-dropdown
                v-if="confirmDeleteDialog !== props.row.id"
                flat
                round
                text-color="grey-10"
                icon="fas fa-ellipsis-v"
                dropdown-icon="none"
                size="sm"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="
                      dialogAction = 'view';
                      rowData = props.row;
                      createDialog = true;
                    "
                  >
                    <q-item-section avatar>
                      <q-avatar
                        text-color="grey-10"
                        icon="fas fa-info"
                        size="sm"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <div class="text-caption">Voir détails</div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="
                      dialogAction = 'edit';
                      rowData = props.row;
                      createDialog = true;
                    "
                  >
                    <q-item-section avatar>
                      <q-avatar
                        text-color="grey-10"
                        icon="fas fa-pen"
                        size="sm"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <div class="text-caption">Modifier</div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-if="props.row.deletable"
                    clickable
                    v-close-popup
                    @click="confirmDeleteDialog = props.row.id"
                  >
                    <q-item-section avatar>
                      <q-avatar
                        text-color="red"
                        icon="fas fa-trash"
                        size="sm"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <div class="text-caption text-red">Supprimer</div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-group v-else flat>
                <q-btn
                  flat
                  label="Confirmer la suppression"
                  class="text-red"
                  size="sm"
                  @click="deleteRow(props.row.id)"
                />
                <q-btn
                  flat
                  label="Annuler"
                  class="text-grey-10"
                  size="sm"
                  @click="confirmDeleteDialog = null"
                />
              </q-btn-group>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import CreateUserGroup from 'components/CreateUserGroup'
import io from 'socket.io-client'

export default {
  name: 'UserGroupPage',
  data () {
    return {
      socket: io(this.$axios.defaults.baseURL.replace('api/', '')),
      dialogAction: 'create',
      rowData: '',
      createDialog: false,
      confirmDeleteDialog: null,
      filter: '',
      loading: false,
      pagination: {
        rowsPerPage: 25
      },
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Nom',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: 'Description',
          field: row => row.description
        },
        {
          name: 'authType',
          align: 'left',
          label: "type d'authentification",
          sortable: true,
          field: row => (row.authType === 'PWD' ? 'Mot de passe' : 'Code PIN')
        }
      ],
      data: []
    }
  },
  components: {
    CreateUserGroup
  },
  created () {
    this.getAll()
  },
  mounted () {
    this.socket.on('USER_GROUP_CREATE/UPDATE', row => {
      const i = this.data.findIndex(el => el.id === row.id)
      if (i === -1) {
        this.data.push(row)
      } else {
        this.data.splice(i, 1, row)
      }
    })
    this.socket.on('USER_GROUP_DELETE', id => {
      const i = this.data.findIndex(el => el.id === id)
      if (i !== -1) {
        this.data.splice(i, 1)
      }
    })
  },
  methods: {
    getAll () {
      this.$axios.get('group/index').then(res => {
        this.data = res.data
      })
    },
    updateRow (row) {
      const i = this.data.findIndex(el => el.id === row.id)
      if (i !== -1) {
        this.data.splice(i, 1, row)
        this.socket.emit('USER_GROUP_CREATE/UPDATE', row)
      }
    },
    addRow (row) {
      this.data.push(row)
      this.socket.emit('USER_GROUP_CREATE/UPDATE', row)
    },
    deleteRow (id) {
      this.$axios.delete('group/delete/' + id).then(res => {
        if (res) {
          const i = this.data.findIndex(el => el.id === id)
          if (i !== -1) {
            this.data.splice(i, 1)
          }
          this.$q.notify({
            type: 'positive',
            position: 'bottom-right',
            timeout: 1500,
            message: 'Le groupe a été supprimé avec succés'
          })
          this.socket.emit('USER_GROUP_DELETE', id)
        } else {
          this.confirmDeleteDialog = null
        }
      })
    }
  }
}
</script>
