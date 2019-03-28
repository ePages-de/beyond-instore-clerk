<template>
  <tr class="order-list-item">
    <td class="order-number">{{order.orderNumber}}</td>
    <td class="image-column">
      <div class="image-container">
        <img :src="imageLink(60, 60)">
      </div>
    </td>
    <td class="product-name">{{ order.productLineItems[0].product.name }}</td>
    <td class="price-column">{{ order.grandTotal | formatPrice(shop) }}</td>
    <td class="status-column"></td>
    <td class="invoice-column"></td>
  </tr>
</template>

<script>
import _ from "lodash";
import uriTemplates from "uri-templates";
import ShopMixin from "@/mixins/ShopMixin";

export default {
  name: "OrderListItem",
  props: ["order"],
  mixins: [ShopMixin],
  filters: {
    formatPrice: function(price, shop) {
      return new Intl.NumberFormat(shop.defaultLocale, {
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
    }
  }
};
</script>

<style scoped>
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
