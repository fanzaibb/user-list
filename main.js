const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const User_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('.data-panel')
const data = []
const searchForm = document.getElementById('search')
const searchInput = document.getElementById('search-input')
const eachPage = 20
const pagination = document.querySelector('.pagination')
let paginationData = []

//Get data from API 
axios
	.get(User_URL)
	.then((response) => {
    data.push(...response.data.results)
    // displayData(data)已有getPageData
    getTotalPages(data)
    getPageData(1, data)
	})
  .catch((err) => console.log(err))

//Listen to button
dataPanel.addEventListener('click', event => {
  console.log(event.target)
    if(event.target.matches('.btn')) {
      console.log(event.target.dataset.id)
      showUser(event.target.dataset.id)
    }
})

//listen to search bar
searchForm.addEventListener('submit', event => {e
  event.preventDefault()
  let input = searchInput.value.toLowerCase()
  console.log(input)
  let results =  data.filter(
    user => user.name.toLowerCase().includes(input)
  )
  getTotalPages(results)
  getPageData(1, results)
})

//Listen to Pagination
pagination.addEventListener('click', event => {
  if (event.target.tagName === "A") {
    getPageData(event.target.dataset.page) //dataset可以錨定到標籤上data-__:的值
  }
})

//display data
function displayData (data) {
	let htmlContent = ''
	data.forEach(function(item, index) {
		htmlContent += `
			<div class='col-2 m-3 bg-light p-3 border'>
				<div class='card'>
					<img class='card-img-top border border-secondary' src='${item.avatar}' alt='A fake user photo'>
        </div>
        <h6 class='font-weight-bold pt-2'>${item.name} ${item.surname}</h6>
        <div class='button-group'>
          <button type='button' class='btn btn-info' data-toggle="modal" data-target='#show-user-modal' data-id='${item.id}'>Info</button>
          <!--<button type='button' class='btn btn-warning'>Like</button>--!>
        </div>
      </div>
			`
	})
	dataPanel.innerHTML = htmlContent
}

//show details of per item
function showUser(id) {
	const showName = document.getElementById('show-user-title')
	const showImage = document.getElementById('show-user-image')
	const showDate = document.getElementById('show-user-date')
	const showMail = document.getElementById('show-user-mail')
	const showDetail = document.getElementById('show-user-detail')

	let userData = User_URL+id

	axios
	.get(userData)
	.then((response) => {
    const pickOne = response.data
    console.log(response.data)

		showName.innerHTML = `${pickOne.name} ${pickOne.surname}`
    showImage.innerHTML = `<img src="${pickOne.avatar}" class="img-fluid" alt="Responsive image">`
    showMail.innerHTML = ` 
      <h6>Contact info:</h6>
      <h6>  ${pickOne.email}</h6>`
    showDetail.innerHTML = `
    <h6>From:</h6>
    <h6>  ${pickOne.region}</h6>`
    showDate.innerHTML = `
    <h6>Created since:</h6>
    <h6>  ${pickOne.created_at}</h6>`
	})
  .catch((err) => console.log(err))
}

//輸出相應數量的頁籤
function getTotalPages(data) {
  let perPage = Math.ceil(data.length/eachPage) || 1
  let htmlContent = ''
  for (i = 0 ; i < perPage; i++) {
    htmlContent +=`
      <li class="page-item"><a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a></li>
    `
  }
  pagination.innerHTML = htmlContent

}

//取出特定頁面的資料
function getPageData (pageNum, data) {
  paginationData = data || paginationData
  // console.log(data)
  // console.log(paginationData)
  let offset = (pageNum - 1) * eachPage//要取的數值區間
  let pageData = paginationData.slice(offset, offset + eachPage)
  displayData(pageData)
}
