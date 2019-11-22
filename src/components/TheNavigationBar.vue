<template>
  <div class="navbar">
    <img id="logo" src="../assets/logo.svg"/>
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
#logo {
  height: 40px;
  width: 100px;
  position: absolute;
  left: 10px;
  top: 13px;
}
.navbar {
  position: fixed;
  width: 100%;
  top: 0;
  display: block;
  background-color: $freshBlue;
  color: white;

  ul {
    list-style-type: none;
  }

  li {
    display: inline-block;
    padding: 0.4em 1em;
    position: relative;
    text-align: left;
    border-bottom: 1px solid #0d336f26;

    a {
      cursor: pointer;
    }
  }
}

.navbar-dropdown {
  padding: 0;
  display: none;
  position: absolute;
  top: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  color: black;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-bottom: none;
  border-bottom: 2px solid $freshBlue;
  left: 50%;
  transform: translate(-50%);

  li {
    padding: 0;
    a {
      color: $freshBlue;
      text-decoration: none;
      padding: 0.4em 1em;
      line-height: 30px;
      display: block;
    }
  }
  li:hover {
    background-color: #F9F9F9;
  }
}

.navbar ul li:hover > .navbar-dropdown {
  display: block;
}

.navbar-dropdown li {
  display: block;
}
</style>
