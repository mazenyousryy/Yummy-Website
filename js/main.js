"use strict";

// *hide spinner when document is ready
function hideOuterSpinner() {
    $(".loading-screen").fadeOut(500, (e) => {
        $("body").addClass("overflow-visible").removeClass("overflow-hidden");
    });
}

// *displayed when someome navigate between page section
function displayInnerSpinner() {
    $("body").addClass("overflow-hidden");
    $(".loading-screen").css({ display: "block" });
    $(document).ready(function () {
        $(".loading-screen").fadeOut(1000, (e) => {
            $("body").addClass("overflow-visible").removeClass("overflow-hidden");
        });
    });

    // &change z-index value so that loading screen appears inder side nav
    $(".loading-screen").css({ zIndex: "500" });
}

// ^get width of side navbar
const navWidth = $("header").width() - 60;
const navLinks = $(".nav-item");

// ^ function that opens side nav when user click on menu-btn
function openSideNav() {
    $(".menu-icon").addClass("fa-xmark").removeClass("fa-bars");
    $("header").animate({ left: "0" }, 500);
    for (let i = 0; i < navLinks.length; i++) {
        navLinks.eq(i).animate({ top: "0" }, (i + 4) * 120);
    }
}

// ^ function that Closes side nav when user click on xBtn
function closeSideNav() {
    $(".menu-icon").addClass("fa-bars").removeClass("fa-xmark");
    $("header").animate({ left: `${-navWidth}` }, 500);
    navLinks.animate({ top: "280px" }, 500);
}

// ^change menu-icon & open the Side nav Menu when click on menu-btn
$(".menu-btn").click((e) => {
    e.preventDefault();

    // &toggle between open & close side nav
    if ($(".menu-icon").hasClass("fa-bars") === true) {
        openSideNav();
    } else {
        closeSideNav();
    }
});

// ^ get ALL meals Data
let mealsDetails;
async function getMealsData(link, objName) {
    const api = await fetch(link);
    const response = await api.json();

    // &get array of objects
    mealsDetails = response[`${objName}`];
}

// ^create a function that hides part of a page when click on a navLink
function hideSec(section) {
    $(section).empty();
}

// ^display all meals
function displayMeals(arr) {
    arr.map((meal, index) => {
        // &display only 20 meals as asked in the exam description
        if (index < 20) {
            $(".mealSec .mealsContainer").append(`
        <div
        class="col-md-6 col-lg-4 col-xl-3"
      >
        <div class="mealInfo singleMeal position-relative overflow-hidden rounded-3">
          <img src='${meal.strMealThumb}' loading="lazy" alt="${meal.strMeal} meal photo" class="w-100" />
          <div
            class="mealOverlay position-absolute start-0 top-100 end-0 d-flex justify-content-center align-items-center"
          >
            <h2 class="fw-bold text-black text-center fs-3 px-2">${meal.strMeal}</h2>
          </div>
        </div>
      </div>
        `);
        }
    });
}

// ^ display serach sec when click on search navLink
function displaySearchSec() {
    $('.nav-link[href="#search"]').click((e) => {
        closeSideNav();
        displayInnerSpinner();
        // *get to top of the page when navigate to any section
        $("body, html").animate({ scrollTop: "0" }, 300);
        hideSec(".mealsContainer");
        hideSec(".signUpForm");
        $(".searchForm").html(`
      <div class=" row g-4 pt-5">
      <div class="col-md-5 offset-md-1">
            <div class="formInputs">
              <input
                type="text"
                class="form-control bg-transparent text-light"
                placeholder="Search By Name"
                name="nameSearch"
                id = "searchedName"
              />
            </div>
          </div>
          <div class="col-md-5">
            <div class="formInputs">
              <input
                type="text"
                class="form-control bg-transparent text-light"
                placeholder="Search By First Letter"
                name="fLetterSearch"
                id = "searchedLetter"
                maxlength = 1
              />
            </div>
          </div>
          </div>
      `);

        // &display searched meals by name
        displayMatchedName();

        // &display searched meals by first letter
        displayMatchedLetter();
    });
}

// ^display matched search Name
function displayMatchedName() {
    let inputName = $("#searchedName");
    inputName.keyup(async (e) => {
        const searchName = inputName.val();
        await getMealsData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchName}`, "meals");
        $(document).ready(function () {
            displayInnerSpinner();
            $(".mealSec .mealsContainer").html(``);
            displayMeals(mealsDetails); //& display matched meals
            displayMealInfo(mealsDetails); //&display meal info when click on any meal
        });
    });
}
// ^display matched search first letter
function displayMatchedLetter() {
    let inputLetter = $("#searchedLetter");
    inputLetter.keyup(async (e) => {
        const firstLetter = inputLetter.val();
        // &make the fisrt letter a if the input field is empty using ternary operator
        firstLetter !== ""
            ? await getMealsData(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`, "meals")
            : await getMealsData(`https://www.themealdb.com/api/json/v1/1/search.php?f=a`, "meals");
        $(document).ready(function () {
            displayInnerSpinner();
            $(".mealSec .mealsContainer").html(``);
            displayMeals(mealsDetails); //& display matched meals
            displayMealInfo(mealsDetails); //&display meal info when click on any meal
        });
    });
}

// // ^create a function that gets categories

// async function getmealsDetails() {
//   const api = await fetch(
//     `https://www.themealdb.com/api/json/v1/1/categories.php`
//   );
//   const response = await api.json();

//   // // &get array of objects
//   // mealsDetails = response.categories;
// }

// ^ function that display categories when click on categories navLink
function displayCategories() {
    $('.nav-link[href="#categories"]').click(async (e) => {
        closeSideNav();
        // *get to top of the page when navigate to any section
        $("body, html").animate({ scrollTop: "0" }, 300);
        $(".mealsContainer").html("");
        hideSec(".searchForm");
        hideSec(".signUpForm");
        await getMealsData("https://www.themealdb.com/api/json/v1/1/categories.php", "categories");
        $(document).ready(function () {
            displayInnerSpinner();

            mealsDetails.map((categ, index) => {
                if (index < 20) {
                    // &display only 20 categories as asked in the exam description

                    $(".mealsContainer").append(`
        <div
        class="col-md-6 col-lg-4 col-xl-3"
      >
        <div class="mealCateg position-relative overflow-hidden rounded-3">
          <img src='${categ.strCategoryThumb}' loading="lazy" alt="${categ.strCategory} meal photo" class="w-100" />
          <div
            class="mealOverlay position-absolute start-0 end-0 d-flex justify-content-center align-items-center text-center"
          >
          <div>
            <h2 class="fw-bold text-black fs-3 px-2">${categ.strCategory}</h2>
            <p class="my-2 text-dark">${categ.strCategoryDescription.slice(0, 150)}...</p>
          </div>
          </div>
        </div>
      </div>
        `);
                }
            });
            // &display all meals with selected category when click on any category in category section
            getMatchedMeal(mealsDetails, ".mealCateg", "c", "strCategory");
        });
    });
}

// ^create a function that displays areas when click on areas navLinks
function displayAreas() {
    $('.nav-link[href="#area"]').click(async (e) => {
        $(".mealsContainer").html("");
        closeSideNav();
        // *get to top of the page when navigate to any section
        $("body, html").animate({ scrollTop: "0" }, 300);
        hideSec(".searchForm");
        hideSec(".signUpForm");
        await getMealsData(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`, "meals");
        $(document).ready(function () {
            displayInnerSpinner();

            mealsDetails.map((area) => {
                $(".mealsContainer").append(`
        <div
        class="col-6 col-md-4 col-lg-3"
      >
        <div class="mealArea text-center">
        <i class="fa-solid fa-house-laptop"></i>
        <p class="fs-3 fw-semibold my-0">${area.strArea}</p>
        </div>
      </div>
        `);
            });
            // &display all meals that match with the selected area when click on any area in area section
            getMatchedMeal(mealsDetails, ".mealArea", "a", "strArea");
        });
    });
}

// ^create a function that displays ingradients when click on ingradients navLinks
function displayIngradients() {
    $('.nav-link[href="#ingradients"]').click(async (e) => {
        $(".mealsContainer").html("");
        closeSideNav();
        // *get to top of the page when navigate to any section
        $("body, html").animate({ scrollTop: "0" }, 300);
        hideSec(".searchForm");
        hideSec(".signUpForm");
        await getMealsData(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`, "meals");
        $(document).ready(function () {
            displayInnerSpinner();
            mealsDetails.map((ingradient, index) => {
                if (index < 20) {
                    // &display only 20 ingradients as asked in the exam description

                    $(".mealsContainer").append(`
        <div
        class="col-md-6 col-lg-3"
      >
        <div class="mealIngradient text-center">
        <i class="fa-solid fa-drumstick-bite"></i>
        <h3 class="my-2">${ingradient.strIngredient}</h3>
        <p class="fw-semibold my-0">${ingradient.strDescription.substring(0, 130)}...</p>
        </div>
      </div>
        `);
                }
            });
            // &display all meals that match with the selected ingradient when click on any ingr in ingr section
            getMatchedMeal(mealsDetails, ".mealIngradient", "i", "strIngredient");
        });
    });
}

// ^ display sign up form sec when click on contact navLink
function displaySignUpSec() {
    $('.nav-link[href="#contact"]').click((e) => {
        closeSideNav();
        $(document).ready(function () {
            displayInnerSpinner(); // *get to top of the page when navigate to any section
            $("body, html").animate({ scrollTop: "0" }, 300);
            hideSec(".mealsContainer");
            hideSec(".searchForm");
            $(".signUpForm").css({ marginTop: "100px" });
            $(".signUpForm").html(`
      <form method="post" class="py-4">
        <div class="row g-4">
        <div class="col-md-5 offset-md-1">
          <div class="formInput">
            <input
              type="text"
              class="form-control bg-transparent text-light fName"
              placeholder="Enter Your Name"
              name="FullName"
            />
            <p class="nameAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>
          </div>
        </div>
        <div class="col-md-5">
          <div class="formInput">
            <input
              type="email"
              class="form-control bg-transparent text-light email"
              placeholder="Enter Your Email"
              name="email"
            />
            <p class="emailAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>
          </div>
        </div>
        <div class="col-md-5 offset-md-1">
          <div class="formInput">
            <input
              type="tel"
              class="form-control bg-transparent text-light mobileNo"
              placeholder="Enter your Phone"
              name="phoneNo"
            />
            <p class="phoneAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         
            </div>
        </div>
        <div class="col-md-5">
          <div class="formInput">
            <input
              type="number"
              class="form-control bg-transparent text-light age"
              placeholder="Enter Your Age"
              name="age"
            />
            <p class="ageAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         </div>
        </div>
        <div class="col-md-5 offset-md-1">
          <div class="formInput">
            <input
              type="password"
              class="form-control bg-transparent text-light pass"
              placeholder="Enter Your Password"
              name="pass"
            />
            <p class="passAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         </div>
        </div>
        <div class="col-md-5">
          <div class="formInput">
            <input
              type="password"
              class="form-control bg-transparent text-light rePass"
              placeholder="RePassword"
              name="rePass"
            />
            <p class="rePassAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         </div>
        </div>
      </div>
      <div class="submitBtn text-center my-4">
        <button
          type="submit"
          class="btn fw-semibold btn-outline-warning px-5"
        >
          Submit
        </button>
      </div>
      </form>
        `);

            // &fire validation on keyup
            fireValidation();

            $(".signUpForm form").submit((e) => {
                e.preventDefault();
            });
        });
    });
}

// ^create a function that display single meal info
function displayMealInfo(arr) {
    let mealSing = $(".singleMeal");
    for (let i = 0; i < mealSing.length; i++) {
        mealSing[i].addEventListener("click", (e) => {
            closeSideNav();
            hideSec(".searchForm");
            hideSec(".signUpForm");
            // *get to top of the page when navigate to any section
            $("body, html").animate({ scrollTop: "0" }, 300);
            $(".mealsContainer").html("");

            $(document).ready(function () {
                displayInnerSpinner();
                // &append meals info
                appendMealInfo(arr, i);
            });
        });
    }
}

// ^append meal details in html
function appendMealInfo(arr, i) {
    displayInnerSpinner();
    // *get to top of the page when navigate to any section
    $("body, html").animate({ scrollTop: "0" }, 300);
    $(".mealsContainer").html(`
        <div class="col-md-4">
          <div class="mealDetails text-light text-center">
            <img src="${arr[i].strMealThumb}" loading="lazy" alt="${arr[i].strMeal} meal photo" class="w-100 rounded-3" />
            <h1 class="text-capitalize fw-bold mt-2">${arr[i].strMeal}</h1>
          </div>
        </div>
        <div class="col-md-8">
          <div class="mealInst text-light">
            <h2 class="fw-bold">Instructions</h2>
            <p class="fs-5 mt-2 mb-4">
              ${arr[i].strInstructions}
            </p>
            <p class="fs-3 fw-bold my-2">
              Area:&nbsp;<span class="text-capitalize fw-semibold fs-4"
                >${arr[i].strArea}</span
              >
            </p>
            <p class="fs-3 fw-bold my-2">
              Category:&nbsp;<span class="text-capitalize fw-semibold fs-4"
                >${arr[i].strCategory}</span
              >
            </p>
            <p class="fs-3 fw-bold my-2">Recipes:</p>
            <ul class="px-1 list-unstyled d-flex flex-wrap gap-2 recipies">
            </ul>
            <p class="fs-3 fw-bold mt-3 mb-2">Tags:</p>
            <ul class="list-unstyled d-flex flex-wrap gap-2 px-1 g-4 tags">
            </ul>
           <div class="my-4">
           <a
           href="${arr[i].strSource}" target="_blank"
           class="btn btn-success fw-semibold fs-6 d-inline-block me-1"
           >Source</a
         >
         <a
           href="${arr[i].strYoutube}" target="_blank"
           class="btn btn-danger fw-semibold fs-6 d-inline-block me-1"
           >Youtube</a
         >
           </div>
          </div>
        </div>
        `);

    // & the max number of ingradients in every meal is 20
    for (let j = 1; j < 21; j++) {
        if (arr[i][`strIngredient${j}`] !== "") {
            $(".recipies").append(`
                  <li class="recipe alert alert-info fw-medium p-2 rounded-2 flex-wrap">
                    ${arr[i][`strMeasure${j}`]} ${arr[i][`strIngredient${j}`]}
                </li>
          `);
        }
    }

    // &check if there is tags or not to prevent errors
    if (arr[i].strTags !== null) {
        // &convert tags string to an array to make loop on it and display its content
        let mealTags = arr[i].strTags.split(",");
        mealTags.map((tag) => {
            $(".tags").append(`
                <li class="tag alert alert-danger fw-medium p-2 rounded-2">${tag}</li>
        `);
        });
    } else {
        $(".tags").html(`
                <li class="tag alert alert-danger fw-medium p-2 rounded-2">
                  No tags available
              </li>
          `);
    }
}
// ^get meals matched with clicked category
let matchedMeals; //& will carry all matched meals with the selected item
function getMatchedMeal(arr, element, filter, item) {
    // *get to top of the page when navigate to any section
    $("body, html").animate({ scrollTop: "0" }, 300); // &select all displayed single categories
    let singleItem = $(element);

    // &loop on all categories to get index of each item & then get the matched meals
    for (let i = 0; i < singleItem.length; i++) {
        singleItem[i].addEventListener("click", async (e) => {
            const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${filter}=${arr[i][`${item}`]}`);
            const response = await api.json();

            // &get array of objects
            matchedMeals = response.meals;
            // &matchedMeal array has meal name, image & id only, so need to lookup for meal details using its id

            $(document).ready(function () {
                displayInnerSpinner();
                // &display meals matched with clicked item when user click on any item (catg, area, ingr) in its corresponding section
                $(".mealSec .mealsContainer").html(``);
                displayMeals(matchedMeals);

                // &display meal info when click on any meal
                searchMealById();
            });
        });
    }
}

// ^loockup single meal details by id
let searchedMeal;
function searchMealById() {
    // *get to top of the page when navigate to any section
    $("body, html").animate({ scrollTop: "0" }, 300);
    let mealSing = $(".singleMeal");
    for (let i = 0; i < mealSing.length; i++) {
        mealSing[i].addEventListener("click", async (e) => {
            const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${matchedMeals[i].idMeal}`);
            const response = await api.json();

            // &get array of objects
            searchedMeal = response.meals;
            $(document).ready(function () {
                displayInnerSpinner();
                appendMealInfo(searchedMeal, 0);
            });
        });
    }
}

// ^validate signUp Data
function validateName() {
    const regex = /^[A-Za-z][\sa-zA-Z]{0,}$/gm;
    return regex.test($(".fName").val());
}
function validateEmail() {
    const regex = /^.{0,}@[A-Za-z0-9-\.]{1,}\.[A-Za-z]{2,}$/gm;
    return regex.test($(".email").val());
}

function validateMob() {
    const regex = /^(\+2){0,1}(01)[0125][0-9]{8}$/gm;
    return regex.test($(".mobileNo").val());
}

function validateAge() {
    const regex = /^[1-9][0-9]{0,1}$/gm;
    return regex.test($(".age").val());
}

function validatePass() {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gm;
    return regex.test($(".pass").val());
}
function iaPassMatched() {
    if ($(".rePass").val() === $(".pass").val()) {
        return true;
    }
}

// ^accept validated data &enable the submit btn
function acceptData() {
    if (validateName() === true && validateEmail() === true && validateMob() === true && validateAge() === true && validatePass() === true && iaPassMatched() === true) {
        $(".submitBtn button").removeAttr("disabled");
    } else {
        $(".submitBtn button").attr("disabled", "disabled");
    }
}

// ^fire validation onfocu
function fireValidation() {
    $(document).ready(function () {
        $(".submitBtn button").attr("disabled", "disabled");
        $(".fName").keyup((e) => {
            validateInputs(validateName, ".nameAlert", `Special characters and numbers not allowed`);
        });
        $(".email").keyup((e) => {
            validateInputs(
                validateEmail,
                ".emailAlert",

                `Email not valid *exemple@example.com`
            );
        });
        $(".mobileNo").keyup((e) => {
            validateInputs(
                validateMob,
                ".phoneAlert",

                `Enter valid Phone Number
          `
            );
        });
        $(".age").keyup((e) => {
            validateInputs(
                validateAge,
                ".ageAlert",

                `Enter valid age
          `
            );
        });
        $(".pass").keyup((e) => {
            validateInputs(
                validatePass,
                ".passAlert",

                `Enter valid password *Minimum eight characters, at least one letter and one number`
            );
        });
        $(".rePass").keyup((e) => {
            validateInputs(
                iaPassMatched,
                ".rePassAlert",

                `Password does not match`
            );
        });
    });
}

// ^displayAlertMsg
function validateInputs(func, alert, msg) {
    $(alert).removeClass("d-block").addClass("d-none");
    if (func() === true) {
        $(alert).removeClass("d-block").addClass("d-none");
    } else if (func() !== true) {
        $(alert).removeClass("d-none").addClass("d-block");
        $(alert).html(msg);
    }

    // &accept all data after their validation
    acceptData();
}

// ^call all functions in order
async function displayAllData() {
    await getMealsData("https://www.themealdb.com/api/json/v1/1/search.php?s=", "meals");

    $(document).ready(function () {
        //& display all meals in the home page
        displayMeals(mealsDetails);

        // &fade loading screen smoothly when document is ready
        hideOuterSpinner();

        // &display search inputs & hide all meals in search section
        displaySearchSec();

        // &display meals categories only in categories section
        displayCategories();

        // &display meals areas only in areas section
        displayAreas();

        // &display meals ingradients only in ingradients section
        displayIngradients();

        // &display signUp From only in Sign Up section
        displaySignUpSec();

        // &display single meal info when user click on any meal at the first page
        displayMealInfo(mealsDetails);
    });
}

displayAllData();
