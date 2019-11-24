<template>
  <div id="app">
    <TheNavigationBar></TheNavigationBar>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import TheNavigationBar from './components/TheNavigationBar.vue';

export default {
  name: 'app',
  components: {
    TheNavigationBar,
  },
};
</script>

<style lang="scss">
html {
  height: 100%;
}
body {
  height: 100%;
}
#app {
  font-family: 'Source Sans Pro', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#content {
  padding-top: 64px;
}
</style>
