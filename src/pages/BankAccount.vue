<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-end">
      <q-btn
        color="blue-10"
        text-color="white"
        class="q-pa-sm"
        size="sm"
        label="Nouveau compte bancaire"
        @click="
          dialogAction = 'create';
          createDialog = true;
        "
      />
      <q-dialog v-model="createDialog">
        <q-card>
          <q-card-section>
            <CreateBankAccount
              v-on:close-dialog="createDialog = false"
              v-on:create-bank="CreateBankDialog = true"
              v-on:create-department="createDepartmentDialog = true"
              :action="dialogAction"
              :row="rowData"
            ></CreateBankAccount>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="CreateBankDialog">
        <q-card>
          <q-card-section>
            <CreateBank v-on:close-dialog="CreateBankDialog = false" action="create" :row="null"></CreateBank>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="createDepartmentDialog">
        <q-card>
          <q-card-section>
            <CreateDepartment
              v-on:close-dialog="createDepartmentDialog = false"
              action="create"
              :row="null"
            ></CreateDepartment>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <div class>
      <q-table
        title="comptes bancaires"
        :data="data"
        :columns="columns"
        no-data-label="Aucune ligne n'a été trouvée"
        row-key="name"
        class="no-shadow"
        :pagination.sync="pagination"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Recherche">
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
            <q-th>Active ?</q-th>
            <q-th>
              <div class="text-bold">Options</div>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" :key="`m_${props.row.id}`">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{
              col.value
              }}
            </q-td>
            <q-td class="text-center">
              <q-icon
                name="fas fa-circle"
                :color="props.row.active ? 'blue-10' : 'grey-4'"
                size="xs"
              />
            </q-td>
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
                      <q-avatar text-color="grey-10" icon="fas fa-info" size="sm" />
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
                      <q-avatar text-color="grey-10" icon="fas fa-pen" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <div class="text-caption">Modifier</div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-if="props.row.deletable || true"
                    clickable
                    v-close-popup
                    @click="confirmDeleteDialog = props.row.id"
                  >
                    <q-item-section avatar>
                      <q-avatar text-color="red" icon="fas fa-trash" size="sm" />
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
import CreateBankAccount from 'components/CreateBankAccount'
import CreateDepartment from 'components/CreateDepartment'
import CreateBank from 'components/CreateBank'

export default {
  name: 'BankPage',
  data () {
    return {
      moduleName: 'bankaccount',
      moduleLabel: 'Le compte bancaire',
      dialogAction: 'create',
      rowData: '',
      createDialog: false,
      createBankDialog: false,
      createDepartmentDialog: false,
      confirmDeleteDialog: null,
      filter: '',
      loading: false,
      pagination: {
        rowsPerPage: 25
      },
      columns: [
        {
          name: 'numAccount',
          required: true,
          label: 'Numéro du compte',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'bank',
          align: 'left',
          label: 'Banque',
          field: row => this.bank(row.bankId).name
        }
      ]
    }
  },
  computed: {
    data () {
      return this.$store.getters['defaultstore/getAll'](this.moduleName)
    }
  },
  components: {
    CreateDepartment,
    CreateBankAccount,
    CreateBank
  },
  created () {
    this.fetchData('bankaccount')
    this.fetchData(this.moduleName)
  },
  methods: {
    bank (id) {
      const bankaccount = this.$store.getters['defaultstore/getOne']({
        moduleName: 'bankaccount',
        id: id
      })
      return bankaccount
    },
    fetchData (moduleName) {
      const fetch = this.$store.getters['defaultstore/fetched'](moduleName)
      this.$store.dispatch('defaultstore/fetchData', {
        Vue: this,
        fetch: fetch,
        moduleName: moduleName
      })
    }
  }
}
</script>
