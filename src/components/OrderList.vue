<template>
  <table>
    <thead>
      <tr>
        <th>Order</th>
        <th colspan="2">Product</th>
        <th>Total amount</th>
        <th>Status</th>
        <th>Invoice</th>
      </tr>
    </thead>
    <tbody v-if="orders.length > 0">
      <OrderListItem v-for="order in orders" :key="order.orderNumber" :order="order"/>
    </tbody>
  </table>
</template>
<script>
import OrderListItem from "@/components/OrderListItem";

const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJzY29wZSI6WyJmZWF0OnIiLCJ1c2VyOnJ1YyIsIm9yZGU6ciIsInNoaW06Y2RyIiwicHJhZDpyY2R1IiwibGNudDp1IiwicHJvZDp1ciIsInNoYWQ6cnUiLCJjbHByOmNyIiwicHltdDp1ciIsImxlZ2w6dXIiLCJwcmRhOnJ1Iiwic2hhdDpjZHJ1IiwicnRwcjpyYyIsInNocHI6cmN1IiwicmZwcjp1ciIsInNob3A6cnUiLCJvcmRyOnVyIiwiaW52bjpydSIsInNocHo6ZGN1ciIsIm9yZHA6ciIsImNhdGc6Y2R1ciIsIm9yZG46dXIiLCJweXByOnVyIl0sInRlbmFudElkIjoxMDQxLCJleHAiOjE1NTM4MDU1MDQsImlhdCI6MTU1Mzc2MjMwNCwianRpIjoiODkzZDU0MTMtNjVjNC00YTQ3LWFhMmMtZDVmNGI2NjljM2Y1IiwiY2xpZW50X2lkIjoiOGZhOWMwY2MtNzZkZi00NWFlLTgyMzQtNTM1ODczYzYyOGJhIn0.KOnp6Zq6Pd-UQ13p0mT21zt-Bk88YdVjDomMtXRue6aDPxZQ8MxEGm_8deyluVeb9IA8t-XzY_33msb8kc2FY6HTTy7445TkOekSzd7aPraTcVfmLIXwwq1rbOypNyPjga_440D--Y2hQuCeTvIPhVKRVM3vG3Zalcgy3IrGaTfnWnhmAliu13Cc76zV1kMp_3J0A0UR8ye0nQhCFXWAdhifFG-Fx9SUh5IumkEc6Zz7u21VnoGUmBQBwKM6axgBPVgPRqa3GchyPVryrTlDxhBU7AF2KpObjEj-RnMs1JJo8cbrHUqMtRkKQ92EZCNbA_jhSfU0puQydqlXsnG03Q";

export default {
  components: { OrderListItem },
  data: function() {
    return {
      orders: []
    };
  },

  created() {
    this.getOrders();
  },

  methods: {
    async getOrders() {
      const { data } = await this.$axios.get("/orders?size=20", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.orders = data._embedded.orders.filter(
        order => order.salesChannel === "instore"
      );
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #eeeeee;
  text-align: left;
}
tr {
  border-bottom: 1px solid #e9e8dc;
  background-color: white;
}
th {
  padding: 15px;
}
@media (max-width: 1023px) {
  .image-column {
    padding: 0 !important;
    width: 0;
    min-width: 0;
  }
}
@media (max-width: 532px) {
  .invoice-column {
    display: none;
    min-width: 0;
  }
}
</style>

