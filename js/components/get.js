export default function renderUsers() {
	let currentPage = 1;

	const button = document.querySelector("#more");

	async function getJSONFromPage(num) {
		const request = await fetch(`https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${num}&count=6`);
		return await request.json();
	}

	function urlExists(url) {
		try {
		   var http = new XMLHttpRequest();
		   http.open('HEAD', url, false);
		   http.send();
		   if (http.status != 404)
			   return true;
		   else {
				throw new Error("No such url");
			}
		}  catch(error) {
		      return false;
		}
	}
	
	function showMore(parentSelector, page) {
		button.classList.add("hide")

		const preloader = document.querySelector(".preloader__template").content.cloneNode(true);
	
		const parent = document.querySelector(parentSelector);

		parent.append(preloader);

	
		getJSONFromPage(page).then((data) => {
			const count = data.total_users;
			button.textContent = "show more"
			for (let i = 0; i < parent.children.length; i++) {
				if (i === parent.children.length - 1) {
					parent.children[i].remove()
				}
			}
			button.classList.remove("hide")
	
			data.users.forEach((user) => {
				const elem = document.createElement("div");
				elem.classList.add("users__item")
	
				elem.innerHTML = `
					<div class="users__item-avatar">
						<img src=${urlExists(user.photo) ? user.photo : "./assets/photo-cover.svg"} class="avatar">
					</div>
					<p class="users__item-name tooltip" data-tip=${user.name}>${user.name}</p>
					<div class="get__users-additional additional">
						<p class="additional__position tooltip" data-tip=${user.position}>${user.position}</p>
						<p class="additional__email tooltip" data-tip=${user.email}>${user.email}</p>
						<p class="additional__email tooltip" data-tip=${user.photo}>${user.phone}</p>
					</div>
				`;
	
				parent.insertAdjacentElement("beforeend", elem)
			});
	
			if (data.links.next_url == null || page * 6 === count) {
				button.style.cssText = "background-color: #B4B4B4; color: #000000;";
				button.textContent = "Show less";
				button.setAttribute("id", "less");
			}
		})
		
		currentPage++
	}

	button.addEventListener("mouseenter", (e) => {
		button.style.transform = "scale(1.1)";
	}) 
	button.addEventListener("mouseleave", (e) => {
		button.style.transform = "scale(1.0)";
	}) 

	function showLess(parentSelector) {
		const children = document.querySelectorAll(`${parentSelector} > *`);

		for (let i = children.length - 1; i >= 6; i--) {
			children[i].remove()
		}

		button.style.cssText = "background-color: #F4E041; color: black;";
		button.textContent = "Show more";
		button.setAttribute("id", "more");

		currentPage = 1;
	} 

	showMore(".users", currentPage)
		
	document.addEventListener("click", (e) => {
		const target = e.target;
		if (target.closest("#more") || target.closest("#less")) {
			if (button.getAttribute("id") === "more") {
				showMore(".users", currentPage)
			} else if (button.getAttribute("id") === "less") {
				showLess(".users")
			}
		}
	}); 

	document.querySelectorAll("#users").forEach(item => {
		item.addEventListener("click", () => {
			window.scrollTo({
				top: document.querySelector(".get").getBoundingClientRect().top + 80,
				behavior: 'smooth'
			 });
		})
	})

	const legendSelector = ".post fieldset > input";

	const legendInputs = document.querySelectorAll(legendSelector);
	legendInputs.forEach(item => {
		let placeholder = item.getAttribute("placeholder");
		item.addEventListener("focusin", () => {
			item.parentElement.querySelector("legend").textContent = placeholder;
			item.setAttribute("placeholder", "")
		})
		item.addEventListener("focusout", () => {
			item.parentElement.querySelector("legend").textContent = "";
			item.setAttribute("placeholder", placeholder)
		})
	});

	const signupBtns = document.querySelectorAll('#signup');

	signupBtns.forEach((item) => {
		item.addEventListener("click", () => {
			window.scrollTo({
				top: document.querySelector(".post").getBoundingClientRect().top + 80,
				behavior: 'smooth'
			 });
		})
	});

	const uploadBtn = document.querySelector(".post__item");
	const itemName = document.querySelector('.post__itemName');
	const label =document.querySelector('[for="file"]');
	uploadBtn.addEventListener("change", () => {
		if (uploadBtn.files[0].size / 1000000 > 5) {
			alert("The size is too big, try less than 5MB");
			uploadBtn.value = "";
		} else {
			const format = uploadBtn.files[0].name.split(".").at(-1);
			itemName.value = uploadBtn.files[0].name.slice(0, uploadBtn.files[0].name.length - format.length - 1);
			
			label.textContent = "Uploaded"
			label.style.cssText = `
			border: gray;
			color: white;
			background-color: rgba(130, 130, 130, 0.57);
			`;
		}
	})

	async function getToken() {
		const response = await fetch("https://frontend-test-assignment-api.abz.agency/api/v1/token");

		return await response.json()
	}

	getToken()
	function postData() {
		const form = document.querySelector('form')
		form.addEventListener("submit", (e) => {
			e.preventDefault()
			const formData = new FormData(); 
			let id;

			form.querySelectorAll("[type='radio']").forEach((item) => {
				if (item.checked) {
					id = item.value;
				}
			})

			const email = document.querySelector("[name='email']").value;
			const phone = document.querySelector("[name='phone']").value;
			const name = document.querySelector("[name='name']").value;
			const photo = document.querySelector("#file").files[0];

			formData.append('position_id', id); 
			formData.append('name', name); 
			formData.append('email', email); 
			formData.append('phone', phone); 
			formData.append('photo', photo);
			getToken().then(data => {
				fetch("https://frontend-test-assignment-api.abz.agency/api/v1/users", {
					method: "post",
					headers: {
						"Token": data.token
					},
					body: formData
				})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						if (button.getAttribute("id") === "more") {
							window.scrollTo({
								top: document.querySelector(".post").getBoundingClientRect().top,
								behavior: 'smooth'
							 });
							document.querySelector(".users").innerHTML = "";
							currentPage = 1;
							showMore(".users", currentPage)

						} else if (button.getAttribute("id") === "less") {
							button.style.cssText = "background-color: #F4E041; color: black;";
							button.textContent = "Show more";
							button.setAttribute("id", "more");
							document.querySelector(".users").innerHTML = "";
							currentPage = 1;
							
						}
						document.querySelector(".initial").classList.add("hide");
						document.querySelector(".then").classList.remove("hide");
					} else {
						console.log(data.message)
					}
				})
				.catch((e) => {console.log(e)}) 
			})
		});
	}
	postData()

	function validateName() {
		const name = document.querySelector("[name='name']").value;
		const item = document.querySelector("[name='name']");

		if (name.length > 60 || name.length < 2 && name.length ==! 0) {
			item.parentElement.style.border = "1px solid red";
			item.previousElementSibling.style.color = "red";
			item.previousElementSibling.textContent = item.getAttribute("placeholder");
		} else {
			item.parentElement.style.border = "1px solid #D0CFCF";
			item.previousElementSibling.style.color = "";
			item.previousElementSibling.textContent = "";
		}
	}
	
	function validateEmail() {
		const email = document.querySelector("[name='email']").value;
		const item = document.querySelector("[name='email']");
		const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/g;

		if (!regex.test(email) && email.length !== 0) {
			item.parentElement.style.border = "1px solid red";
			item.previousElementSibling.style.color = "red";
			item.previousElementSibling.textContent = item.getAttribute("placeholder");
		} else {
			item.parentElement.style.border = "1px solid #D0CFCF";
			item.previousElementSibling.style.color = "";
			item.previousElementSibling.textContent = "";
		}
	}



	function validatePhone() {
		const phone = document.querySelector("[name='phone']").value;
		const item = document.querySelector("[name='phone']");
		const regex = /^[\+]{0,1}380([0-9]{9})$/g;

		if (!regex.test(phone) && phone.length !== 0) {
			item.parentElement.style.border = "1px solid red";
			item.previousElementSibling.style.color = "red";
			item.previousElementSibling.textContent = item.getAttribute("placeholder");
		} else {
			item.parentElement.style.border = "1px solid #D0CFCF";
			item.previousElementSibling.style.color = "";
			item.previousElementSibling.textContent = "";
		}
	}

	document.querySelector("[name='name']").addEventListener("input", () => {
		validateName()
	})
	document.querySelector("[name='phone']").addEventListener("input", () => {
		validatePhone()
	})
	document.querySelector("[name='email']").addEventListener("input", () => {
		validateEmail()
	})
	


	
}