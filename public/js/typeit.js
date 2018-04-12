var lang = localStorage.getItem('lang');

if(lang == 'fr') {
  $('.type-it').typeIt({
     speed: 160,
     loop: true,
     loopDelay: 1000,
     lifeLike: false,
     autoStart: false
  })
  .tiType('Web Développeur')
  .tiPause(2000)
  .tiDelete(11)
  .tiPause(500)
  .tiType('Designer')
  .tiPause(2000)
  .tiDelete(12)
  .tiPause(500)
  .tiType('<a href="/projects">Voir mes travaux</a>')
  .tiPause(2000)
} else {
  $('.type-it').typeIt({
     speed: 160,
     loop: true,
     loopDelay: 1000,
     lifeLike: false,
     autoStart: false
  })
  .tiType('Web Developer')
  .tiPause(2000)
  .tiDelete(9)
  .tiPause(500)
  .tiType('Designer')
  .tiPause(2000)
  .tiDelete(12)
  .tiPause(500)
  .tiType('<a href="/projects">Check My Work</a>')
  .tiPause(2000)
}
