var eventSource = undefined;
var currentBasketId = undefined;

function createBasket() {
  $.ajax({
    url : `/api/baskets`,
    type : 'POST',
    success : function(data) {
      console.log("Created basket:......................", data);
      $("#subscribe-to-basket-id").val(data);
      $(".lastbasketid").text(data);
      subscribeToBasketModel();
    },
    data : JSON.stringify({
      'type' : $("#basket-type").val()
    }),
    contentType : "application/json"
  });
}

function subscribeToBasketModel() {
  if (eventSource) {
    unsubscribeFromBasketModel();
  }
  currentBasketId = $("#subscribe-to-basket-id").val();
  $(".currentbasketid").text(currentBasketId);
  eventSource = new EventSourcePolyfill(
      `/api/baskets/${currentBasketId}/updates`, {
        headers : {
          authorization : 'bearer my.token.value'
        }
      });
  var listener = function(event) {
    $("#updatelog")
        .prepend(
            `<div>${event.type === "message" ? event.data : eventSource.url}</div>`)
        .prepend(`<h4>${event.type}</h4>`);
  };
  eventSource.addEventListener("open", listener);
  eventSource.addEventListener("message", listener);
  eventSource.addEventListener("error", listener);
}

function unsubscribeFromBasketModel() {
  eventSource.close();
  eventSource = undefined;
}

function addThing() {

  console.log("Adding thing:......................", $("#thing-name").val(), $(
      "#thing-description").val());

  $.ajax({
    url : `/api/baskets/${currentBasketId}/things`,
    type : 'PUT',
    success : function() {
      console.log("Successfully added the thing...");
    },
    data : JSON.stringify({
      "name" : $("#thing-name").val(),
      "description" : $("#thing-description").val()
    }),
    contentType : "application/json"
  });
}

$(function() {

  $(".baskettypelisting").hide();

  $("form").on('submit', function(e) {
    e.preventDefault();
  });
  $("#create-basket").click(function() {
    createBasket();
  });
  $("#add-thing").click(function() {
    addThing();
  });
  $("#subscribe-to-basket").click(function() {
    subscribeToBasketModel();
  });
  $("#subscribe-to-basket-list-by-type").click(function(event) {
    console.log("subscribe-to-basket-list-by-type clicked! ", event);
    // $("#subscribe-to-basket-id").val();
    // subscribeToBasketModel();
  });
});
