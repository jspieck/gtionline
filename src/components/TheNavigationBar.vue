<template>
  <div class="navbar">
    <a href="/" ><img id="logo" src="../assets/logo.svg"></a>
    <input class="menu-btn" type="checkbox" id="menu-btn" />
    <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
    <ul class="menu">
      <li v-for="submenu in menu" v-bind:key="submenu.id">
        <a v-if="submenu.link === undefined">{{submenu.label}}</a>
        <router-link v-else :to="`${submenu.link}`">{{submenu.label}}</router-link>

        <ul class="navbar-dropdown" v-if="submenu.items !== undefined">
          <li v-for="item in submenu.items" v-bind:key="item.id">
            <router-link :to="`${item.link}`">{{item.label}}</router-link>
          </li>
        </ul>
      </li>
    </ul>
    <div id="languageDropdown">
      <LSelect @input="chooseLang"/>
    </div>
  </div>
</template>

<script>
import LanguageSelect from '@/components/LanguageSelect.vue';

export default {
  name: 'TheNavigationBar',
  components: {
    LSelect: LanguageSelect,
  },
  data() {
    return {};
  },
  computed: {
    menu() {
      return [
        {
          id: 0,
          label: this.$t('numeralSystem'),
          items: [
            {
              id: 0,
              label: this.$t('polyadic'),
              link: '/polyadic',
            },
            {
              id: 1,
              label: this.$t('floatingPoint'),
              link: '/fparithmetic',
            },
          ],
        },
        {
          id: 1,
          label: this.$t('functionMin'),
          link: 'bfminimizer',
          // items: [
          //   {
          //     id: 2,
          //     label: this.$t('kvDiagram'),
          //     link: '/kvdiagram',
          //   },
          //   {
          //     id: 3,
          //     label: 'Quine/McCluskey',
          //     link: '/quinemccluskey',
          //   },
          //   {
          //     id: 4,
          //     label: 'Nelson-Petrick',
          //     link: '/nelsonpetrick',
          //   },
          //   {
          //     id: 5,
          //     label: 'Boolean-Function Minimierung',
          //     link: '/bfminimizer',
          //   },
          // ],
        },
      ];
    },
  },
  methods: {
    chooseLang(lang) {
      this.$i18n.locale = lang.name;
    },
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

#languageDropdown {
  position: absolute;
  right: 14px;
  top: 14px;
}

.navbar {
  position: fixed;
  width: 100%;
  top: 0;
  display: block;
  background-color: $freshBlue;
  color: white;
  z-index: 2;

  ul {
    list-style-type: none;
    li:hover > .navbar-dropdown {
      display: block;
    }
  }

  li {
    display: inline-block;
    padding: 0.4em 1em;
    position: relative;
    text-align: left;
    border-bottom: 1px solid #0d336f26;

    &:hover {
      color: $freshYellow;
    }

    a {
      white-space: nowrap;
      cursor: pointer;
      text-decoration: none;
      color: white;
    }
  }

  .menu-btn {
    display: none;
  }
  .menu-btn:checked ~ .menu {
    max-height: 240px;
    overflow: visible;
  }
  .menu-btn:checked ~ .menu-icon .navicon {
    background: transparent;
  }
  .menu-btn:checked ~ .menu-icon .navicon:before {
    transform: rotate(-45deg);
  }
  .menu-btn:checked ~ .menu-icon .navicon:after {
    transform: rotate(45deg);
  }
  .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:before,
  .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:after {
    top: 0;
  }

  .menu-icon {
    cursor: pointer;
    display: block;
    float: right;
    padding: 28px 20px;
    position: relative;
    user-select: none;
    .navicon {
      background: white;
      display: block;
      height: 2px;
      position: relative;
      transition: background .2s ease-out;
      width: 18px;
    }
    .navicon:before, .navicon:after {
      background: white;
      content: '';
      display: block;
      height: 100%;
      position: absolute;
      transition: all .2s ease-out;
      width: 100%;
    }
    .navicon:before {
      top: 5px;
    }
    .navicon:after {
      top: -5px;
    }
  }
  .menu {
    clear: both;
    overflow: hidden;
    max-height: 0;
    margin: 4px;
    padding-left: 0;
    transition: max-height .2s ease-out;
  }
}

@media (min-width: 768px) {
  .navbar {
    .menu {
      clear: none;
      max-height: none;
      overflow: visible;
      margin: 16px 0;
    }
    .menu-icon {
      display: none;
    }
  }
  #content {
    padding-top: 102px;
  }
}

.navbar-dropdown {
  padding: 0;
  display: none;
  position: absolute;
  top: 100%;
  z-index: 2;
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
    display: block;
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
    a {
      color: $darkYellow;
    }
  }
}
</style>
