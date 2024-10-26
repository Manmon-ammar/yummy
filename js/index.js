// ? loading screen 
$(document).ready(()=>{
    getAllMeals("").then(()=>{
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow","visible") 
        $(".inner-loading-screen").fadeOut(500)
    });
})

// ! side nav menu

function openSideNav() {
    $(".side-nav-menu").animate({
        left: 0
    }, 500)


    $("i.open-close").removeClass("fa-bars");
    $("i.open-close").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)

    $("i.open-close").addClass("fa-bars");
    $("i.open-close").removeClass("fa-x");


    $(".links li").animate({
        top: 300
    }, 500)
}

closeSideNav()
$(".side-nav-menu i.open-close").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

// ? show meals 
async function getAllMeals(term){
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    response = await response.json();
    response.meals ? displayMeals(response.meals):displayMeals([]);
    $(".inner-loading-screen").fadeOut(300);
}
function displayMeals(arr){
    let allMeals = "";
    for(let i = 0 ; i < arr.length ; i++){
        allMeals += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal cursor rounded-2 position-relative overflow-hidden">
                    <img class="w-100" src="${arr[i].strMealThumb}">
                    <div class="meal-layer px-2 position-absolute d-flex align-items-center justify-content-start text-black">
                        <h2 class="h3">${arr[i].strMeal}</h2>
                    </div>
                </div>
            </div>
        `
    }
    $(".meals").html(allMeals);
}

async function getMealDetails(mealId){
    closeSideNav();
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    response = await response.json();
    displayMealDetails(response.meals[0]);
    $(".inner-loading-screen").fadeOut(300);
}
function displayMealDetails(meal){
    let ingredients = ``;
    for(let i = 0 ; i < 20 ; i++){
        if(meal[`strIngredient${i}`]){
            ingredients += `
                <li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>
            `
        }
    }
    let tags = meal.strTags?.split(",");
    if(!tags) tags = [];
    let tagsStr = '';
    for(let i = 0 ; i < tags.length ; i++){
        tagsStr +=`
            <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
        `
    }

    let mealDetails = `
        <div class="col-md-4">
                <img class="w-100 rounded-2" src="${meal.strMealThumb}">
                <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes : </h3>
                <ul class="list-unstyled d-flex flex-wrap">
                    ${ingredients}   
                </ul>
                <h3>Tags : </h3>
                <ul class="list-unstyled d-flex flex-wrap">
                    ${tagsStr}
                </ul>
                <div class="d-flex">
                    <a href="${meal.strSource}" target="_blank">
                        <button class="btn btn-success me-2">Source</button>
                    </a>
                    <a href="${meal.strYoutube}" target="_blank">
                        <button class="btn btn-danger">Youtube</button>
                    </a>
                </div>
            </div>
        `
    $(".meals").html(mealDetails);
}


// & search 
function showSearchInputs(){
    $(".search").html(`
        <div class="row py-4">
            <div class="col-md-6">
                <input onKeyup="getAllMeals(this.value)" type="text" class="form-control text-white bg-transparent" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onKeyup="validateFirstLetter(this)" maxlength="1" type="text" class="form-control text-white bg-transparent" placeholder="Search By First Letter">
            </div>
        </div>    
    `);
    $(".meals").html("");
}
$("#search").on('click', function(){
    closeSideNav();
    showSearchInputs();
});
async function searchByFirstLetter(term){
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    term = "" ? "a" : term;
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    response = await response.json();
    response.meals ? displayMeals(response.meals):displayMeals([]);
    $(".inner-loading-screen").fadeOut(300);
}

function validateFirstLetter(input){
    const value = input.value;
    if(value.length === 1 && /^[a-zA-Z]$/.test(value)){
        searchByFirstLetter(value);  
    } else {
        input.value = '';  
    }
}


// ^ categories
async function getCategories() {
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();
    $(".search").html("");
    displayCategories(response.categories);
    $(".inner-loading-screen").fadeOut(300);
}
$("#categories").on('click' , function(){
    closeSideNav();
    getCategories();
});
function displayCategories(arr){
    let allCategories = "";
    for(let i = 0 ; i < arr.length ; i++){
        allCategories += `
            <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal cursor rounded-2 position-relative overflow-hidden">
                    <img class="w-100" src="${arr[i].strCategoryThumb}">
                    <div class="meal-layer px-2 position-absolute text-center text-black overflow-auto">
                        <h2 class="h3">${arr[i].strCategory}</h2>
                        <p>${arr[i].strCategoryDescription}</p>
                    </div>
                </div>
            </div>
        `
    }
    $(".meals").html(allCategories);
}
async function getCategoryMeals(category) {
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();
    displayMeals(response.meals);
    $(".inner-loading-screen").fadeOut(300); 
}


// * Area
async function getArea(){
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();
    $(".search").html("");
    displayAreas(response.meals);
    $(".inner-loading-screen").fadeOut(300);
}
$('#area').on('click', function(){
    closeSideNav();
    getArea();
});
function displayAreas(arr) {
    let allAreas = "";
    for(let i = 0 ; i < arr.length ; i++){
        allAreas += `
            <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="cursor rounded-2 text-center">
                    <i class="fa-solid fa-house-laptop"></i>
                    <h2 class="h3">${arr[i].strArea}</h2>       
                </div>   
            </div>
        `
    }
    $(".meals").html(allAreas);
}
async function getAreaMeals(area) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();
    displayMeals(response.meals);
}


// & Ingredients 
async function getIngredients() {
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
    $(".search").html(""); 
    diplayIngredients(response.meals.slice(0,20));
    $(".inner-loading-screen").fadeOut(300);
}
$("#ingredients").on('click' , function(){
    closeSideNav();
    getIngredients();
});
function diplayIngredients(arr){
    let allIngredients = "";
    for(let i = 0 ; i < arr.length ; i++){
        allIngredients += `
            <div class="col-md-3">
                <div onclick="getIngredientsMeal('${arr[i].strIngredient}')" class="cursor rounded-2 text-center">
                    <i class="fa-solid fa-drumstick-bite"></i>
                    <h2 class="h3">${arr[i].strIngredient}</h2>
                    <p>${arr[i].strDescription.split(" ").slice(0,25).join(" ")}</p>       
                </div>   
            </div>
        `
    }
    $(".meals").html(allIngredients);
}
async function getIngredientsMeal(ingredients){
    $(".meals").html("");
    $(".inner-loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    response = await response.json();
    displayMeals(response.meals);
    $(".inner-loading-screen").fadeOut(300);
}

// ! contact us
function showContact(){
    $(".meals").html(
        `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 px-5 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                        <div class="alert alert-danger d-none w-100 mt-2" id="nameAlert">
                            special cheracters and numbers are not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                        <div class="alert alert-danger d-none w-100 mt-2" id="emailAlert">
                            Email is not valid 'test@gmail.com'
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div class="alert alert-danger d-none w-100 mt-2" id="phoneAlert">
                            phone is not valid. enter a valid number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                        <div class="alert alert-danger d-none w-100 mt-2" id="ageAlert">
                            age is not valid. enter age between 18-60
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                        <div class="alert alert-danger d-none w-100 mt-2" id="passwordAlert">
                           Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Enter Your Repassword">
                        <div class="alert alert-danger d-none w-100 mt-2" id="repasswordAlert">
                            password does not match
                        </div>   
                    </div>
                </div>
                <button disabled class="btn btn-outline-danger mt-4 submit">Submit</button>
            </div>
        </div>
        `
    );
    $("#nameInput").on("focus", () => {
        nameInputTouched = true
    })

    $("#emailInput").on("focus", () => {
        emailInputTouched = true
    })

    $("#phoneInput").on("focus", () => {
        phoneInputTouched = true
    })

    $("#ageInput").on("focus", () => {
        ageInputTouched = true
    })

    $("#passwordInput").on("focus", () => {
        passwordInputTouched = true
    })

    $("#repasswordInput").on("focus", () => {
        repasswordInputTouched = true
    })
}

$("#contact").on('click', function(){
    closeSideNav();
    showContact();
});

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }

    if (
        nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()
    ) {
        $('.submit').prop('disabled', false); 
    } else {
        $('.submit').prop('disabled', true);  
    }
}

function nameValidation() {
    return (/^[a-zA-Z]+$/.test($("#nameInput").val())); 
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val())); 
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val())); 
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val())); 
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passwordInput").val())); 
}

function repasswordValidation() {
    return $("#repasswordInput").val() == $("#passwordInput").val();  
}
