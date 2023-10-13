/// I-modal - скидочное модальное окно
$(document).ready(function() {
  sessionStorage.setItem('openedSaleModal', '0')
});

// $(document).mouseleave(function(e){
// //$(document).bind('mouseleave touchmove touchstart', function(e){
//   if (e.clientY < 10 && sessionStorage.getItem('openedSaleModal') !='1') {
//     let modal = $('#sale-modal')
//     open_imodal(modal);
//     sessionStorage.setItem('openedSaleModal', '1')
//   }    
// });

// if (matchMedia("screen and (max-width: 1023px)").matches) {

//   document.addEventListener("DOMContentLoaded", function (e) {

//     if (sessionStorage.getItem('openedSaleModal') != '1') {
//       let modal = $('#sale-modal')
//       open_imodal(modal);
//       sessionStorage.setItem('openedSaleModal', '1')
//     }    

//   });

// }

// //Отслеживаем клик по блоку на главной странице
$('#sale-modal').on( "click","#copy-btn", function() {  
    
  $(this).addClass("active");

  // копирование промокода в буфер обмена

  // let $temp = $("<input>");
  // $("body").append($temp);
  // $temp.val('Madmotion').select();
  // document.execCommand("copy");
  // $temp.remove();

  // закрываем окно с попапом
  close_imodal();

    
  // "уезжаем" к разделу заказа блоков
  var scroll_el = $(".pp_base");
  var header_heigth = $(".header").outerHeight();
  if ($(scroll_el).length != 0) {
    $("html, body").animate(
      { scrollTop: $(scroll_el).offset().top - header_heigth },
      500
    );
  }

  // добавляем 8 блок в корзину
  blockchange('BBC', 'Part_8');


});

////I-modal - модальные окна
$('body').on( "click",".i-modal-btn", function() {
  open_imodal(this);
});

$('.i-modal').on( "click", function(e) {
  if(e.target==this||$(e.target).hasClass('close-i-modal-btn-wrapper')||$(e.target).hasClass('return-btn')||$(e.target).hasClass('sale-modal-wrapper')){
    e.stopPropagation();
    close_imodal();
}});

function open_imodal(item){
  $('html').addClass("scroll-lock");
  let popupId = $(item).attr('data-popup-id');
  $(`#${popupId}`).delay(50).fadeIn(500);
};

function close_imodal(){
  // $('html').css('overflow-y','auto');
  $('html').removeClass("scroll-lock");
  $('.i-modal').fadeOut();
  setTimeout(() => $('.i-modal').scrollTop(0), 400);
};

//Отслеживаем клик по блоку на главной странице
$('.new-item-chapters-wrapper').on( "click",".new-item-chapter", function() {  
    
  let blockNumber = $(this).attr('data-block');
    let inCart = false;
    
    //Узнаем добавлен ли блок в корзину
    if($(`.pp_ls_block[data-block="${blockNumber}"]`).hasClass('checked_block')){
        inCart = true;
    }

    //Получаем json
    $.getJSON(`/blocks/${blockNumber}-block.json`,function(data){
        setInfo(data, inCart, blockNumber);
    });

});

//Устанавливаем основную инфу блока в modal
async function setInfo(info, inCart, blockNumber){
    let item = $('#block-modal');
    let cover = ''; //переменная с html содержимым обложки

    if(info['type-cover'] == 'video'){
      cover = `
      <video class="cover" preload="auto" muted="muted" loop autoplay playsinline>
        <source src="${info['cover-img']}"></source>
      </video>`
    }else{
      cover = `<img class="cover" src="${info['cover-img']}">`
    }

    item.find('.cover').remove();
    item.find('.course-cover').append(cover);

    item.find('.course-short-info').find('.number-lessons').children('.title').text(info['lessons']);
    item.find('.course-short-info').find('.time').children('.title').text(info['time']);
    item.find('.course-short-info').find('.level').children('.title').text(info['level']);

    item.find('.course-description').children('.title').html(info['title']);
    item.find('.course-description').children('.description').html(info['description']);


    //Добавляем иконки
    item.find('.icons-wrapper').html('')
    info['icons'].forEach(function (e) {
        i = `<div class="icon ${e}-icon"></div>`;
        item.find('.icons-wrapper').append(i);
    })

    //Добавляем преподавателей
    item.find('.teachers-wrapper').html('')
    
    info['teachers'].forEach(function (e) {
        i = `
        <div class="teacher-item">
        <img src="${e['avatar']}" alt="">
            <div class="teacher-info">
                <div class="title">${e['name']}</div>
                <div class="description">${e['prof']}</div>
            </div>
        </div>
        `;
        item.find('.teachers-wrapper').append(i);
    })


    //Добавляем этапы обучений
    item.find('.course-inside-info').html('')

    info['timeline'].forEach(function (e) {
        //Получаем тэги
        let tags = ``;
        e['tags'].forEach(function (e) {
            tags+=`<div class="tag">${e}</div>`
        });
        //Вставляем инфу
        i = `<div class="inside-item">
                <div class="inside-item-content">
                    <div class="title">
                        ${e['title']}
                    </div>
                    <div class="description">
                        ${e['description']}
                    </div>
                    <div class="tags-wrapper">
                        ${tags}
                    </div>
                </div>
                <div class="inside-item-img ${info['item-img-add-class']}">
                    <video preload="auto" autoplay loop muted playsinline>
                      <source src="${e['img']}"></source>
                    </video>
                </div>
            </div>
        `;
        //Добавляем в html
        item.find('.course-inside-info').append(i);
    })
    //Добавляем кнопку
    $('.buy-btn').attr(`data-block`,blockNumber);
    if(inCart == true){
        $('.buy-btn').addClass('active');
        console.log('1')
    }else{
        $('.buy-btn').removeClass('active');
        console.log('2')
    }
  
}

///// Работа кнопки
$(".buy-btn").click(function(e) {
    e.preventDefault();
    let blockNumber = $(this).attr('data-block');
    $(this).toggleClass('active');
    $(`.pp_ls_block[data-block="${blockNumber}"]`).click();
});

//Создание карточек на главной странице
$(document).ready(function() {

  let itemsCount = 11; // Тут нужно подумать как тянуть число json файлов
  for (let i = 1; i <= itemsCount; i++) { 
    $.getJSON(`/blocks/${i}-block.json`,function(data){
      if(data['type-preview'] == "video"){
        setItemTypeVideo(data, i)
      }else{
        setItemTypeImg(data, i);
      }
      setInfo(data, inCart = false, i);
    });
  }

});   

function setItemTypeImg(data, i){
  let progress = '';
  if (data['in_progress'] == 'in_progress') {
    progress = 'in-progress';
  } else if (data['in_progress'] == 'presale') {
    progress = 'presale';
  } else if (data['in_progress'] == 'no_timeline') {
    progress = 'no-timeline';
  }

  var strInstPrice = ""; 
  if ((isNaN(BBC_Inst_price[i])) || (progress.length > 0)) {
    strInstPrice = data['price-title']
  } else {
    strInstPrice = 'от ' + (Math.ceil(BBC_Inst_price[i] / 12 / 10) * 10).toLocaleString() + ' ₽ в месяц';
  }

  var strFullPrice = ""; 
  if ((isNaN(BBC_Full_price[i])) || (progress.length > 0)) {
    strFullPrice = data['price-description']
  } else {
    strFullPrice = 'или сразу ' + (BBC_Full_price[i]).toLocaleString() + ' ₽';
  }

  let item = `
  <div class="new-item-chapter ${progress} i-modal-btn text-${data['text-color']}" style="order:${i}" data-popup-id="block-modal" data-block="${i}">
    <div class="chapter-cover">
						<img class="lazy" src="${data['preview-img']}" alt="${data['title']}">
    </div>
    
    <div class="item-content bl-${i}">

      <div class="item-chapter-header">
        <div class="info-wrapper">
            <div class="presale-title">предпродажа</div> 
            <div class="pretitle">Блок ${i}</div>
            <div class="lessons-icon"><span class="icon-text">${data['lessons']}</span></div>
            <div class="time-icon"><span class="icon-text">${data['time']}</span></div>

        </div>
        <div class="title">${data['title']}</div>
      </div>
      
      <div class="price-wrapper">
        <div class="title">
        ${strInstPrice}
        </div>
        <div class="post-title">
        ${strFullPrice}
        </div>
      </div>

    </div>

  </div>
  `;
  
  $('.new-item-chapters-wrapper').append(item);

};

function setItemTypeVideo(data, i){
  let progress = '';
  if (data['in_progress'] == 'in_progress') {
    progress = 'in-progress';
  } else if (data['in_progress'] == 'presale') {
    progress = 'presale';
  } else if (data['in_progress'] == 'no_timeline') {
    progress = 'no-timeline';
  }

  var strInstPrice = ""; 
  if ((isNaN(BBC_Inst_price[i])) || (progress.length > 0)) {
    strInstPrice = data['price-title']
  } else {
    strInstPrice = 'от ' + (Math.ceil(BBC_Inst_price[i] / 12 / 10) * 10).toLocaleString() + ' ₽ в месяц';
  }

  var strFullPrice = ""; 
  if ((isNaN(BBC_Full_price[i])) || (progress.length > 0)) {
    strFullPrice = data['price-description']
  } else {
    strFullPrice = 'или сразу ' + (BBC_Full_price[i]).toLocaleString() + ' ₽';
  }

  let item = `
  <div class="new-item-chapter ${progress} i-modal-btn text-${data['text-color']}" style="order:${i}" data-popup-id="block-modal" data-block="${i}">
    <div class="chapter-cover">
      <video preload="auto" muted="muted" loop autoplay playsinline>
        <source src="${data['preview-img']}" alt="Видео загружается...">
      </video>
    </div>  

    <div class="item-content bl-${i}">
      <div class="item-chapter-header">
        <div class="info-wrapper">
            <div class="presale-title">предпродажа</div> 
            <div class="pretitle">Блок ${i}</div>
            <div class="lessons-icon"> <span class="icon-text">${data['lessons']}<span class="icon-text"></div>
            <div class="time-icon"><span class="icon-text">${data['time']}</span></div>
        </div>
        <div class="title">${data['title']}</div>
      </div>
      
      <div class="price-wrapper">
        <div class="title">
          ${strInstPrice}
        </div>
        <div class="post-title">
          ${strFullPrice}
        </div>
      </div>

    </div>

  </div>
  `;
  
  $('.new-item-chapters-wrapper').append(item);

};


// function setItemTypeImg(data, i){
//   let progress = '';
//   if(data['in_progress'] == 'true'){
//     progress = 'in_progress';
//   }
//   let item = `
//   <div class="new-item-chapter ${progress} i-modal-btn text-${data['text-color']}" style="order:${i}" data-popup-id="block-modal" data-block="${i}">
//     <div class="chapter-cover">
// 						<img class="lazy" src="${data['preview-img']}" alt="${data['title']}">
//     </div>
    
//     <div class="item-content">

//       <div class="item-chapter-header">
//         <div class="info-wrapper">
         
//             <div class="pretitle">Блок ${i}</div>
//             <div class="lessons-icon"><span class="icon-text">${data['lessons']}</span></div>
//             <div class="time-icon"><span class="icon-text">${data['time']}</span></div>

//         </div>
//         <div class="title">${data['title']}</div>
//       </div>
      
//       <div class="price-wrapper">
//         <div class="title">
//           ${data['price-title']}
//         </div>
//         <div class="post-title">
//           ${data['price-description']}
//         </div>
//       </div>

//     </div>

//   </div>
//   `;
  
//   $('.new-item-chapters-wrapper').append(item);

// };
// function setItemTypeVideo(data, i){
//   let progress = '';
//   if(data['in_progress'] == 'true'){
//     progress = 'in-progress';
//   }
//   let item = `
//   <div class="new-item-chapter ${progress} i-modal-btn text-${data['text-color']}" style="order:${i}" data-popup-id="block-modal" data-block="${i}">
//     <div class="chapter-cover">
//       <video preload="auto" muted="muted" loop autoplay playsinline>
//         <source src="${data['preview-img']}" alt="Видео загружается...">
//       </video>
//     </div>  

//     <div class="item-content">
//       <div class="item-chapter-header">
//         <div class="info-wrapper">
//             <div class="pretitle">Блок ${i}</div>
//             <div class="lessons-icon"> <span class="icon-text">${data['lessons']}<span class="icon-text"></div>
//             <div class="time-icon"><span class="icon-text">${data['time']}</span></div>
//         </div>
//         <div class="title">${data['title']}</div>
//       </div>
      
//       <div class="price-wrapper">
//         <div class="title">
//           ${data['price-title']}
//         </div>
//         <div class="post-title">
//           ${data['price-description']}
//         </div>
//       </div>

//     </div>

//   </div>
//   `;
  
//   $('.new-item-chapters-wrapper').append(item);

// };


/////////////////
//Massonry-grid// этот скрипт для 1 варианта верстки блоков
/////////////////
// function get_minHeight_massonry(){
//     let minHeight_massonry = [];
//     $('.new-item-chapter').each(function() {
//       minHeight_massonry.push( $(this).height());
//     });
//     return Math.min.apply(null,minHeight_massonry);
//   }

//   $('.new-item-chapter').each(function() {
//     // let gridRow = Math.round($(this).height() / 20); 
//     // console.log(gridRow);
//     // $(this).css('grid-row',`span ${gridRow}`);
//     if($( this ).height() > get_minHeight_massonry()){
//       $(this).addClass('grid-control');
//     }
//   });

//   $(window).bind('resize', function(){
//     $('.new-item-chapter').each(function() {
//       if($( this ).height() > get_minHeight_massonry()){
//         $(this).addClass('grid-control');
//       }else{
//         $(this).removeClass('grid-control');
//       }
//     })
//   });