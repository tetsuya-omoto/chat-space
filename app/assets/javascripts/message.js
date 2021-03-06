$(function(){
  function buildHTML(message){
    var image_url = (message.image)? `<image class="message-lower__image" src="${message.image}"`:"";
    var html = `<div class="message" {data: {id: ${message.id}}}>
                  <div class="message-upper-info">
                    <div class="message-upper-info__talker">
                    ${message.user_name}
                    </div>
                    <div class="message-upper-info__date">
                    ${message.created_at}
                    </div>
                  </div>
                  <div class="message-lower">
                    <p class="message-lower__text">
                      ${message.content}
                    </p>
                  </div>
                    ${image_url}
                </div>`
                
    return html;
  }
  var buildMessageHTML = function(message) {
    var image_url = (message.image)? `<image class="message-lower__image" src="${message.image}">`:"";
    var content_text = (message.content)? `<p class="message-lower__text">
                                             ${message.content}
                                           </p>`:"";
    var html = `<div class="message" data-id= ${message.id} >
      <div class="message-upper-info"> 
        <div class="message-upper-info__talker">
          ${message.user_name}
        </div> 
        <div class="message-upper-info__date">
          ${message.created_at}
        </div>
      </div>
      <div class="lower-message">
        ${content_text}
        ${image_url}
      </div>
    </div>`
    return html;
  };

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html)
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      $('.submit-btn').removeAttr("disabled");
    })
    .fail(function(){
      alert('メッセージ送信に失敗しました');
    })
    
    .always(function(){
      $(".submit-btn").prop("disabled", false);
      $('#new_message')[0].reset();
    });
  })
  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
    　　var last_message_id = $('.message:last').data('id');
    　　var href = 'api/messages'
    　　$.ajax({
      　　url: href,
      　　type: 'get',
      　　dataType: 'json',
      　　data: {id: last_message_id}
       })
    
       .done(function(messages) {
        var insertHTML = '';
        messages.forEach(function(message) {
        insertHTML = buildMessageHTML(message);
        $('.messages').append(insertHTML)
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
        })
      })
      .fail(function() {
        alert('error');
      });
    };
  };
  setInterval(reloadMessages, 5000);
});