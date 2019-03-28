<template>
  <tr class="order-list-item" :class="{done: completed}">
    <td class="order-number">{{order.orderNumber}}</td>
    <td class="image-column">
      <div class="image-container">
        <img :src="imageLink(60, 60)">
      </div>
    </td>
    <td class="product-name">{{ order.productLineItems[0].product.name }}</td>
    <td class="price-column">{{ order.grandTotal | formatPrice(locale) }}</td>
    <td class="status-column">
      <span v-if="completed">Completed</span>
      <button v-if="!completed" v-on:click.prevent="completeOrder">Confirm</button>
    </td>
    <td class="invoice-column">
      <span v-if="!hasCustomBillingAddress">n/a</span>
      <button v-if="hasCustomBillingAddress" v-on:click.prevent="printInvoice">Print</button>&nbsp;
      <button v-if="hasCustomBillingAddress" v-on:click.prevent="sendInvoice">Send</button>
    </td>
  </tr>
</template>

<script>
/* eslint-disable */
import _ from "lodash";
import uriTemplates from "uri-templates";
import { headers } from "@/components/OrderList";

export default {
  name: "OrderListItem",
  props: ["order", "locale"],
  computed: {
    completed() {
      return (
        this.order.paymentStatus === "PAID" &&
        this.order.shippingStatus === "SHIPPED"
      );
    },
    hasCustomBillingAddress() {
      return _.isEqual(this.order.shippingAddress, this.order.billingAddress);
    }
  },
  filters: {
    formatPrice: function(price, locale) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: price.currency
      }).format(price.amount);
    }
  },
  methods: {
    imageLink: function(width, height = 2560) {
      var link = _.get(
        this.order,
        "productLineItems[0].product._links[default-image-data]",
        null
      );
      return link
        ? uriTemplates(link.href).fill({ width, height })
        : "https://dummyimage.com/180x200/ffffff/0011ff.png&text=no+image";
    },
    async completeOrder() {
      console.info("=== Complete order @ OrderListItem");
      const {
        data: { _id: shippingProcessId }
      } = await this.$axios.post(
        `/orders/${this.order._id}/processes/shippings`,
        {
          comment: "",
          sendMail: true,
          trackingCode: "",
          trackingLink: "",
          lineItems: this.order.productLineItems.map(productLineItem => ({
            quantity: productLineItem.quantity,
            productLineItemId: productLineItem._id
          }))
        },
        { headers }
      );

      const { data } = await this.$axios.get(this.order._links.processes.href, {
        headers
      });
      const paymentProcessMarkPaidLink =
        data._embedded["payment-processes"][0]._links["mark-paid"].href;
      const shippingProcessMarkShippedLink =
        data._embedded["shipping-processes"][0]._links["mark-shipped"].href;

      await this.$axios.post(
        shippingProcessMarkShippedLink,
        { comment: "" },
        { headers }
      );

      await this.$axios.post(
        paymentProcessMarkPaidLink,
        {
          comment: "",
          details: {
            amount: {
              amount: this.order.grandTotal.amount,
              currency: this.order.grandTotal.currency
            }
          }
        },
        { headers }
      );
    },
    async printInvoice() {
      console.info("=== Print invoice @ OrderListItem");
      await createInvoice();
    },
    async sendInvoice() {
      console.info("=== Send invoice @ OrderListItem");
      await createInvoice();
    },
    async createInvoice() {
      console.info("=== Create invoice @ OrderListItem");
    }
  }
};
</script>

<style scoped>
tr {
  border-bottom: 1px solid #e9e8dc;
  background-color: white;
}
tr:last-child {
  border-bottom: none;
}
tr:hover {
  background-color: #e8f3f2;
}
td {
  padding: 15px;
}

.price-column,
.invoice-column {
  text-align: right;
}
.invoice-column {
  width: 11em;
}
.image-column {
  width: 75px;
}
.image-container {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
}
.done,
.done a {
  color: silver;
  fill: silver;
}
.done img {
  opacity: 0.5;
}
button {
  background-color: #418ccc;
  transition: 0.3s ease-out;
  padding: 0.8em;
  border: 0;
  border-radius: 2px;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
}
button:hover {
  background-color: #2e72ac;
  transition: 0.3s ease-out;
}

@media (max-width: 1023px) {
  .image-container {
    display: none;
  }
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
