<template>
  <div class="accordion-item">
    <!-- Item title -->
    <div class="accordion-item-header" @click="doclick">
      <slot name="accordion-item-title"></slot>
    </div>
    <!-- Item body -->
    <div class="accordion-item-body" v-if="this.expanded === true" ref="accordion_item_body">
      <button v-if="this.expandableSideways" class="accordion-item-expand-sideways-toggle ion-md-expand"
          @click="toggleExpandSideways">
      </button>
      <slot name="accordion-item-body" ></slot>
    </div>

  </div>
</template>

<script>
export default {
  props: ['expandableSideways'],
  data() {
    return {
      expanded: false,
      expandedSideways: true,
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
    toggleExpandSideways(e) {
      this.expandedSideways = !this.expandedSideways;
      console.log('target: ', e.target);

      if (e.target.classList.contains('accordion-item-expand-sideways-toggle')) {
        // e.target.classList.toggle('active');
        console.log('toggle requested!');
        this.$refs.accordion_item_body.classList.toggle(
          'accordion-item-body-expanded-sideways',
        );
      }
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

    .accordion-item-expand-sideways-toggle {
      // content: "&#xf386;";
      // font-family: IonIcons;

      // content: "\f3d0";
      // font-family: IonIcons;
      // background-color: pink;

      float: right;
      font-size: 1.4em;

      padding-top: .1em;
      background-color: rgba($brightBlue, 0.5);
      // background-color: transparent;
      // color: $brightBlue;
    }
  }

  .accordion-item-body-expanded-sideways {
    position: relative;
    width: 96vw;
    left: 50%;
    margin-left: -49vw;

    border-style: solid;
    border-width: 1px;

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
