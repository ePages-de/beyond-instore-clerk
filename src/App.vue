<template>
  <div id="app">
    <h1>Instore Orders</h1>
    <router-view/>
  </div>
</template>

<script>
/* eslint-disable */
import ShopMixin from "@/mixins/ShopMixin";

export default {
  name: "App",

  mixins: [ShopMixin],

  data: function() {
    return {
      alerts: []
    };
  },

  computed: {
    shopName: function() {
      return this.shop.name;
    }
  },

  created: function() {
    console.info(`==== created App @ ${this.$options.name}`);
    this.$axios.defaults.baseURL = `https://${
      this.$route.params.shop
    }.beyondshop.cloud/api`;
  }
};
</script>

<style>
</style>
