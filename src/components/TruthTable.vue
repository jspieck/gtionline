<template>
  <div class="truthTable">
    <!-- <button @click="$emit('truthtable-modified', getKVDiagram())">Throw modified event</button> -->
  </div>
</template>

<script>

export default {
  emits: [
    'truthtable-modified',
    'requesting-bf-after-reactivation',
  ],
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {
    getKVDiagram() {

    },
  },
};
</script>

<style lang="scss">

</style>
