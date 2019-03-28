<template>
  <div class="card text-center">
    <div class="card-body">
      <h5 class="card-title">{{ product.name }}</h5>
      <div class="card-text">
        <a :href="checkoutLink(product._id)"><img class="card-img-top img-thumbnail p-0 m-0" :src="imageLink" :alt="product.name"></a>
        <div v-if="!product.variations || variations.length" class="qr-codes">
          QR Codes:
          <a
            v-for="qrcode in qrcodes"
            :href="qrcode.href"
            :key="qrcode.href"
          >{{qrcode.name}}</a>
        </div>
        <div v-if="!product.variations || variations.length" class="checkout-links">
          Add to cart:
          <a
            v-for="qrcode in qrcodes"
            :href="qrcode.checkoutHref"
            :key="qrcode.checkoutHref"
          >{{qrcode.name}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import uriTemplates from "uri-templates";
import _ from "lodash";

export default {
  name: "ProductDetails",

  props: ["product", "alerts"],

  data: function() {
    return {
      variations: null
    };
  },

  created: function() {
    this.loadVariations();
  },

  computed: {
    qrcodes: function() {
      if (!this.product.variationAttributes) {
        return [
          {
            name: this.product.name,
            href: this.getQrCodeLink(this.product._id),
            checkoutHref: this.checkoutLink(this.product._id)
          }
        ];
      }
      if (this.variations) {
        return this.variations.map(variation => ({
          name: variation.variationAttributeValues
            .map(value => value.value)
            .join(" "),
          href: this.getQrCodeLink(variation._id),
          checkoutHref: this.checkoutLink(variation._id)
        }));
      }
    },
    imageLink: function() {
      var link = _.get(this.product, "_links[default-image-data]", null);
      return link
        ? uriTemplates(link.href).fill({ width: 400, height: 200 })
        : "https://dummyimage.com/400x200/ffffff/0011ff.png&text=no+image";
    }
  },

  methods: {
    loadVariations: async function() {
      if (this.product.variationAttributes) {
        const { data: product } = await this.$axios.get(
          this.product._links.self.href
        );
        this.variations = product.variations;
      }
    },
    checkoutLink(productId) {
    var addToCartTemplate =
      "https://beyond-instore-checkout.herokuapp.com/{shop}/cart/{productId}";
      return uriTemplates(addToCartTemplate).fill({
        shop: this.$route.params.shop,
        productId
      });
    },
    getQrCodeLink: function(productId) {
      var addToCartLink = this.checkoutLink(productId)
      var qrCodeTemplate =
        "https://api.qrserver.com/v1/create-qr-code/?{&size,format,data}";
      return uriTemplates(qrCodeTemplate).fill({
        size: "400x400",
        format: "png",
        data: encodeURI(addToCartLink)
      });
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  width: 23vw;
  min-height: 30vw;
  box-shadow: 2px 0px 10px #aaa;
  cursor: pointer;
}

.card-img-top {
  height: 80%;
}

.qr-codes a,
.checkout-links a {
  padding: 5px;
}
</style>
