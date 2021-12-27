<template>
  <div>
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
@import '~pretty-checkbox/src/pretty-checkbox.scss';

html {
  height: 100%;
}
body {
  height: 100%;
}
.bodyContainer {
  width: 1000px;
  margin: auto;
}
@media screen and (max-width: 1000px) {
  .bodyContainer {
    width: 100%;
  }
}
#app {
  font-family: 'Source Sans Pro', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  min-height: 100%;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  // background: linear-gradient(90deg, rgba(3,9,18,1) 0%, rgba(4,18,52,1) 20%, rgba(4,18,52,1) 80%, rgba(3,9,18,1) 100%);
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

.tab:hover {
  background: #ababab5e;
}

.menu li:hover {
  background: #ffffff2b;
}

h4{
  font-size: 18px;
  margin-top: 40px;
}

#content {
  padding-top: 64px;

  & > div {
    padding: 10px;
  }
}
</style>
