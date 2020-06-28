<template>
  <div>
    <div class="row q-mt-md">
      <div class="col-md-12">
        <q-toggle
          label="Séléctionner tout"
          size="sm"
          :disable="!disable"
          v-model="all"
          color="blue-10"
          @input="checkAllToggle"
        />
      </div>
    </div>
    <div class="row">
      <div v-for="(g, i) in groups" :key="i" class="col-md-6">
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section>
              <div class="text-caption text-bold">{{ g }}</div>
            </q-item-section>
          </q-item>

          <div v-for="(p, j) in privileges" :key="j">
            <q-item tag="label" v-if="p.group === g" clickable v-ripple>
              <q-item-section avatar>
                <q-toggle
                  v-model="selection"
                  :disable="!disable"
                  class="text-caption"
                  :val="p.id"
                  size="xs"
                  color="blue-10"
                  @input="checkToggles"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <div class="text-caption">{{ p.description }}</div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['selected', 'disable'],
  data () {
    return {
      all: false,
      selection: [],
      privileges: [],
      groups: []
    }
  },
  created () {
    console.log(this.disable)
    this.getAll()
    this.selection = this.selected
    if (this.selection.length === this.privileges.length) {
      this.all = false
    } else {
      this.all = true
    }
  },
  methods: {
    getAll () {
      this.$axios.get('privileges/index').then(res => {
        res.data.forEach(el => {
          if (!this.groups.find(e => e === el.group)) {
            this.groups.push(el.group)
          }
          this.privileges.push(el)
        })
      })
    },
    checkToggles () {
      if (this.selection.length === this.privileges.length) {
        this.all = true
      } else {
        this.all = false
      }
      this.$emit('set-privileges', this.selection)
    },
    checkAllToggle () {
      this.selection = []
      if (this.all) {
        this.privileges.forEach(el => {
          this.selection.push(el.id)
        })
      }
      this.$emit('set-privileges', this.selection)
    }
  }
}
</script>
<style></style>
