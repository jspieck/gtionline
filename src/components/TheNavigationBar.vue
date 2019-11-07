<template>
  <div class="navbar">
    <ul>
      <li v-for="submenu in menu" v-bind:key="submenu.id">
        <a>{{submenu.label}}</a>
        <ul class="navbar-dropdown">
          <li v-for="item in submenu.items" v-bind:key="item.id">
            <router-link :to="`${item.link}`">{{item.label}}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TheNavigationBar',
  data() {
    return {
      menu: [
        {
          id: 0,
          label: 'Zahlensysteme',
          items: [
            {
              id: 0,
              label: 'Polyadisch',
              link: '/polyadic',
            },
            {
              id: 1,
              label: 'Gleitkommazahlen',
              link: '/fparithmetic',
            },
          ],
        },
        {
          id: 1,
          label: 'Funktionsminimierung',
          items: [
            {
              id: 2,
              label: 'KV-Diagramm',
              link: '/kvdiagram',
            },
            {
              id: 3,
              label: 'Quine/McCluskey',
              link: '/quinemccluskey',
            },
            {
              id: 4,
              label: 'Nelson-Petrick',
              link: '/nelsonpetrick',
            },
          ],
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navbar {
  position: fixed;
  width: 100%;
  top: 0;
  display: block;
  background-color: rgb(0, 0, 128);
  color: white;
}

.navbar ul {
  list-style-type: none;
}

.navbar li {
  display: inline-block;
  margin: 0 0.6em;
  position: relative;
  text-align: left;
}

.navbar li a {
  cursor: pointer;
}

.navbar-dropdown {
  padding: 10px 0;
  display: none;
  position: absolute;
  top: 100%;
  box-sizing: border-box;
  max-height: calc(100vh - 61px);
  overflow-y: auto;
  right: -15px;
  color: black;
  background-color: white;
  border: 1px solid black;
}

.navbar ul li:hover > .navbar-dropdown {
  display: block;
}

.navbar-dropdown li {
  display: block;
}
</style>
