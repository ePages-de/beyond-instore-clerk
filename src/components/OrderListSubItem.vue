<template>
  <tr class="detail-row">
    <td class="order-number"></td>
    <td class="image-column">
      <div class="image-container">
        <img :src="imageLink(60, 60)">
      </div>
    </td>
    <td class="product-name">{{ product.product.name }} {{variationValue }}</td>
    <td class="price-column">{{ product.lineItemPrice | formatPrice(locale) }}</td>
    <td class="status-column"></td>
    <td class="invoice-column"></td>
  </tr>
</template>

<script>
import uriTemplates from "uri-templates";
import _ from "lodash";

export default {
  name: "OrderListSubItem",
  props: ["product", "locale"],
  computed: {
    variationValue() {
      if (this.product.product.variationAttributeValues) {
        return this.product.product.variationAttributeValues
          .map(value => value.value)
          .join(" ");
      }
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
        this.product,
        "product._links[default-image-data]",
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
tr.detail-row {
  background-color: #fbfbf8;
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

