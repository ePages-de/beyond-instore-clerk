<template>
  <table v-if="orders.length > 0">
    <thead>
      <tr>
        <th>Order</th>
        <th colspan="2">Product</th>
        <th class="price-column">Total amount</th>
        <th>Status</th>
        <th class="invoice-column">Invoice</th>
      </tr>
    </thead>
    <OrderListItem
      v-for="order in orders"
      v-on:orderMarkAsCompleted="markAsCompleted"
      v-on:toggleChildren="toggleChildren"
      :key="order.orderNumber"
      :order="order"
      :locale="shop.defaultLocale"
    />
  </table>
</template>
<script>
import ShopMixin from "@/mixins/ShopMixin";
import OrderListItem from "@/components/OrderListItem";

const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJzY29wZSI6WyJmZWF0OnIiLCJ1c2VyOnJ1YyIsIm9yZGU6ciIsInNoaW06Y2RyIiwicHJhZDpyY2R1IiwibGNudDp1IiwicHJvZDp1ciIsInNoYWQ6cnUiLCJjbHByOmNyIiwicHltdDp1ciIsImxlZ2w6dXIiLCJwcmRhOnJ1Iiwic2hhdDpjZHJ1IiwicnRwcjpyYyIsInNocHI6cmN1IiwicmZwcjp1ciIsInNob3A6cnUiLCJvcmRyOnVyIiwiaW52bjpydSIsInNocHo6ZGN1ciIsIm9yZHA6ciIsImNhdGc6Y2R1ciIsIm9yZG46dXIiLCJweXByOnVyIl0sInRlbmFudElkIjoxMDQxLCJleHAiOjE1NTQxNjE2MjgsImlhdCI6MTU1NDExODQyOCwianRpIjoiNGJlYzUxNGEtODdlZi00YmJiLWE0NjUtMmRmNzA0OGExYjhkIiwiY2xpZW50X2lkIjoiOGZhOWMwY2MtNzZkZi00NWFlLTgyMzQtNTM1ODczYzYyOGJhIn0.RFO7YaiA5ZivH_vXslVWSDdRVyKw8qPO86A55d9sE6wjV9p0pF1D7IhaZkdGuHPGaUi034M5cuYH89_w6yV_54ivB-ppEuNURbM8VyjloDHhMlryxJuldBuMsX6sM-_1kqtljep_ylEdEA44kEaw46LVsrNa8kX2OjZypTO5T3WUppA8lHgOPgqHVIrc6j6km9BT6bonbDg_ce_H-nDy9zaeh_QXszJ7prAqcPUSjuKczN5dWoPPLYsynmyh6oSEc4L08Vp2wgJN0sqYOYs1B04cPIHmfv1fOblTLLkHmaBCUCwJ7UEajmxFToVUc6wqCxa5quc_w81izAAeiobcCg";
export const headers = { Authorization: `Bearer ${token}` };

export default {
  name: "OrderList",
  mixins: [ShopMixin],
  components: { OrderListItem },
  data: function() {
    return {
      orders: [],
      openedOrders: []
    };
  },

  created() {
    this.getOrders();
  },

  methods: {
    toggleChildren(orderId) {
      if (this.openedOrders.includes(orderId)) {
        this.openedOrders = this.openedOrders.filter(
          order => order !== orderId
        );
      } else {
        this.openedOrders = [...this.openedOrders, orderId];
      }
    },
    markAsCompleted(orderId) {
      this.orders = this.orders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            paymentStatus: "PAID",
            shippingStatus: "SHIPPED"
          };
        }
        return order;
      });
    },
    async getOrders() {
      const { data } = await this.$axios.get("/orders?size=20", { headers });
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
.price-column,
.invoice-column {
  text-align: right;
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
