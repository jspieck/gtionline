<template>
  <div class="accordion-item">
    <!-- Item title -->
    <div class="accordion-item-header" @click="doclick">
      <slot name="accordion-item-title"></slot>
    </div>
    <!-- Item body -->
    <div class="accordion-item-body" v-if="this.expanded === true">
      <slot name="accordion-item-body"></slot>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    doclick(e) {
      this.expanded = !this.expanded;

      if (e.target.classList.contains('accordion-item-header')) {
        e.target.classList.toggle('active');
      }
      e.preventDefault();
    },
  },
};
</script>

<style scoped lang="scss">

  .accordion-item-header {
    background-color: $brightBlue;

    text-align: left;
    padding: .5em;
    padding-left: 1em;
    color: white;

    border-style: solid;
    border-width: 1px;
    border-color: black;
    border-top-style: none;

    cursor: pointer;
  }

  .accordion-item-header:after {
    content: "\f3d0";
    font-family: IonIcons;
    font-size: 1.2em;
    float: right;
    position: relative;
    top: -2px;
    transition: .3s all;
    transform: rotate(0deg);
  }

  .accordion-item-header.active:after {
    transform: rotate(-180deg);
  }

  .accordion-item-body {
    background-color: white;
    margin-left: .5em;
    margin-right: .1em;

    border-style: solid;
    border-width: 1px;
    border-top-style: none;
    border-bottom-style: none;
    // border-bottom-left-radius: .3em;

    padding: 1em;

    overflow-x: auto;
  }

  .accordion-item:first-child {
    .accordion-item-header {
      border-top-style: solid;
    }
  }
  .accordion-item:last-child {
    .accordion-item-body {
      border-bottom-style: solid;
    }
  }


  // .accordion-item-header.active {
  //   background-color: red;
  // }
</style>
