$(document).ready(function () {
  $('.data-layout').each(function(index, obj){
    $.get('layout/' + $(obj).data('layout'), function(data) {
      $(obj).html(data);
    }, 'text');
  });
  $('input[type="text"], textarea').on('focus', function(){
    $(this).parent().addClass('active');
    $(this).parent().removeClass('no-shadow');
  }).on('blur', function(){
    if($(this).val().trim() == ''){
      $(this).parent().removeClass('active');
      $(this).parent().removeClass('no-shadow');
    }
    else {
      $(this).parent().addClass('no-shadow');
    }
  });
  window.onbeforeunload = function(event){
    return false;
  }
});
