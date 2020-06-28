<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
@font-face {
  font-family: Montserrat;
  src: url("assets/montserrat/Montserrat-Regular.otf") format("opentype");
}

@font-face {
  font-family: Montserrat;
  font-weight: bold;
  src: url("assets/montserrat/Montserrat-Medium.otf") format("opentype");
}

* {
  font-family: "Montserrat", sans-serif;
}
</style>
