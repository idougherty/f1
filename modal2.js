let eDO = document.querySelector('.e-driver');
let modalED0 = document.querySelector('.modal-e-driver');
let eDOC = document.querySelector('.ed-c');

let nDO = document.querySelector('.n-driver');
let modalND0 = document.querySelector('.modal-n-driver');
let nDOC = document.querySelector('.nd-c');


eDO.addEventListener('click', function(){
    modalED0.classList.add('bg-active');
});
eDOC.addEventListener('click', function(){
    modalED0.classList.remove('bg-active');
});

nDO.addEventListener('click', function(){
    modalND0.classList.add('bg-active');
});
nDOC.addEventListener('click', function(){
    modalND0.classList.remove('bg-active');
});

let eRO = document.querySelector('.e-re');
let modalER0 = document.querySelector('.modal-e-re');
let eROC = document.querySelector('.er-c');

let nDO = document.querySelector('.n-re');
let modalND0 = document.querySelector('.modal-n-re');
let nDOC = document.querySelector('.nr-c');


eRO.addEventListener('click', function(){
    modalER0.classList.add('bg-active');
});
eROC.addEventListener('click', function(){
    modalER0.classList.remove('bg-active');
});

nRO.addEventListener('click', function(){
    modalNR0.classList.add('bg-active');
});
nROC.addEventListener('click', function(){
    modalNR0.classList.remove('bg-active');
});