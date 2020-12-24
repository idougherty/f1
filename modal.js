let chas = document.querySelector('.chas');
let modalChas = document.querySelector('.modal-chas');
let chasC = document.querySelector('.chas-c');

let eng = document.querySelector('.eng');
let modalEng = document.querySelector('.modal-eng');
let engC = document.querySelector('.eng-c');

let aero = document.querySelector('.aero');
let modalAero = document.querySelector('.modal-aero');
let aeroC = document.querySelector('.aero-c');

let trans = document.querySelector('.trans');
let modalTrans = document.querySelector('.modal-trans');
let transC = document.querySelector('.trans-c');

let tire = document.querySelector('.tire');
let modalTire = document.querySelector('.modal-tire');
let tireC = document.querySelector('.tire-c');

let gad = document.querySelector('.gad');
let modalGad = document.querySelector('.modal-gad');
let gadC = document.querySelector('.gad-c');

let eDO = document.querySelector('.driver');
let modalED0 = document.querySelector('.modal-e-driver');
let eDOC = document.querySelector('.ed-c');


chas.addEventListener('click', function(){
    modalChas.classList.add('bg-active');
});
chasC.addEventListener('click', function(){
    modalChas.classList.remove('bg-active');
});


eng.addEventListener('click', function(){
    modalEng.classList.add('bg-active');
});
engC.addEventListener('click', function(){
    modalEng.classList.remove('bg-active');
});

aero.addEventListener('click', function(){
    modalAero.classList.add('bg-active');
});
aeroC.addEventListener('click', function(){
    modalAero.classList.remove('bg-active');
});

trans.addEventListener('click', function(){
    modalTrans.classList.add('bg-active');
});
transC.addEventListener('click', function(){
    modalTrans.classList.remove('bg-active');
});

tire.addEventListener('click', function(){
    modalTire.classList.add('bg-active');
});
tireC.addEventListener('click', function(){
    modalTire.classList.remove('bg-active');
});

gad.addEventListener('click', function(){
    modalGad.classList.add('bg-active');
});
gadC.addEventListener('click', function(){
    modalGad.classList.remove('bg-active');
});

eDO.addEventListener('click', function(){
    modalED0.classList.add('bg-active');
});
eDOC.addEventListener('click', function(){
    modalED0.classList.remove('bg-active');
});