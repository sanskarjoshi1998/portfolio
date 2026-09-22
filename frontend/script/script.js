// add class navbarDark on navbar scroll

const header = document.querySelector('.navbar');
console.log(header)
window.onscroll = function() {
    const top = window.scrollY;
    if(top >=100) {
        header.classList.add('navbarDark');
    }
    else {
        header.classList.remove('navbarDark');
    }
}
// collapse navbar after click on small devices
const navLinks = document.querySelectorAll('.nav-item')
const menuToggle = document.getElementById('navbarSupportedContent')

navLinks.forEach((l) => {
    l.addEventListener('click', () => { new bootstrap.Collapse(menuToggle).toggle() })
})

//Experience in tcs random given

let date = new Date();
month = date.getMonth();
year = date.getFullYear();
let experienceCountTcs = document.getElementById("experience-count-tcs");
experienceCountTcs.innerHTML = "01/2021 - "+month+"/"+year;
let totalExperienceCount = document.getElementById("total-experience-count");
var a = (Math.round((date.getFullYear() - 2021 + (date.getMonth() - 1)/12) * 100) / 100).toFixed(2);
totalExperienceCount.innerText = a;
let myage = document.getElementById("myage");
myage.innerHTML = date.getFullYear() - 1998;
console.log(typeof a);