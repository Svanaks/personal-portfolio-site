$(document).ready(() => {
  $('#fr').on('click', (e) => {
    e.preventDefault();
    $target = $(e.target);
    // console.log($target.attr('data-id'));
    const lang = $target.attr('data-id');
    localStorage.setItem('lang', lang);

    $.ajax({
      type:'POST',
      url: '/lang/'+lang,
      success: (res) => {
        // window.location.href='/';
        window.location.reload(true);
      },
      error: (err) => {
        console.log(err);
      }
    });
  });
  $('#en').on('click', (e) => {
    e.preventDefault();
    $target = $(e.target);
    // console.log($target.attr('data-id'));
    const lang = $target.attr('data-id');
    localStorage.setItem('lang', lang);

    $.ajax({
      type:'POST',
      url: '/lang/'+lang,
      success: (res) => {
        // window.location.href='/';
        window.location.reload(true);
      },
      error: (err) => {
        console.log(err);
      }
    });
  });

  // $('#fr').on('click', (e) => {
  //   $target = $(e.target);
  //   // console.log($target.attr('data-id'));
  //   const lang = $target.attr('data-id');
  //   localStorage.setItem('lang', lang);
  // });
  //
  // $('#en').on('click', (e) => {
  //   $target = $(e.target);
  //   // console.log($target.attr('data-id'));
  //   const lang = $target.attr('data-id');
  //   localStorage.setItem('lang', lang);
  // });


  $('.delete-project').on('click', (e) => {
    $target = $(e.target);
    console.log($target.attr('data-id'));
    const id = $target.attr('data-id');

    $.ajax({
      type:'DELETE',
      url: '/projects/'+id,
      success: (res) => {
        alert('Deleting Project');
        window.location.href='/';
      },
      error: (err) => {
        console.log(err);
      }
    });
  });

  // The following code is based off a toggle menu by @Bradcomp
  // source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
  (function() {
      var burger = document.querySelector('.nav-toggle');
      var menu = document.querySelector('.nav-menu');
      burger.addEventListener('click', function() {
          burger.classList.toggle('is-active');
          menu.classList.toggle('is-active');
      });
  })();
});
