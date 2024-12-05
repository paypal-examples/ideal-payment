/* eslint-disable consistent-return, new-cap, no-alert, no-console */

/* Paypal */

let orderID;

async function getOrder(){
  return await fetch(`/api/orders/${orderID}`).then(res => res.json())
}

function clearOrder(){
  orderID = undefined
}

function createOrder(data, actions) {
 
  if(orderID){
    return new Promise(resolve => resolve(orderID))
  }
  
  return fetch("/api/orders", {
    method: "post",
    // use the "body" param to optionally pass additional order information
    // like product skus and quantities
    body: JSON.stringify({
      cart: [
        {
          sku: "ABCDEF",
          quantity: 1,
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((order) => { 
      orderID = order.id 
      return orderID
    });
}

async function captureOrder(){
  await fetch(`/api/orders/${orderID}/capture`, {
    method: "post",
  })
    .then((res) => res.json())
    .then((data) => {
      swal(
        "Order Captured!",
        `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
          data.purchase_units[0].payments.captures[0].amount.currency_code
        } ${data.purchase_units[0].payments.captures[0].amount.value}`,
        "success"
      );
    })
    .catch(console.error);
}

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder: createOrder,
    onApprove(data, actions) {
      fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          swal(
            "Order Captured!",
            `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
              data.purchase_units[0].payments.captures[0].amount.currency_code
            } ${data.purchase_units[0].payments.captures[0].amount.value}`,
            "success"
          );
        })
        .catch(console.error);
    },
    onCancel(data, actions) {
      console.log("onCancel called");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render("#paypal-btn");

/* iDEAL  */


paypal
  .Buttons({
    fundingSource: paypal.FUNDING.BANCONTACT,
    style: {
      label: "pay",
    },
    createOrder: createOrder,
    onApprove(data, actions) {
      // fetch(`/api/orders/${data.orderID}/capture`, {
      //   method: "post",
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(data);
      //     swal(
      //       "Order Captured!",
      //       `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
      //         data.purchase_units[0].payments.captures[0].amount.currency_code
      //       } ${data.purchase_units[0].payments.captures[0].amount.value}`,
      //       "success"
      //     );
      //   })
      //   .catch(console.error);
    },
    onCancel(data, actions) {
      console.log(data);
      swal("Order Canceled", `ID: ${data.orderID}`, "warning");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render("#ideal-btn");




