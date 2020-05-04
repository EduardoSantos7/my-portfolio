// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This list contains the companies that will be ask use to ask for news, prices, etc.
let companies = []

google.charts.load('current', { 'packages': ['corechart', 'line'] });
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawBackgroundColor);

/** Creates a chart and adds it to the page. */
function drawChart() {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Animal');
  data.addColumn('number', 'Count');
  data.addRows([
    ['Lions', 10],
    ['Tigers', 5],
    ['Bears', 15]
  ]);

  const options = {
    'title': 'Zoo Animals',
    'width': 500,
    'height': 400
  };

  const chart = new google.visualization.PieChart(
    document.getElementById('chart-container'));
  chart.draw(data, options);
}

function drawBackgroundColor() {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', 'Portfolio');

  data.addRows([
    [0, 0], [1, 10], [2, 23], [3, 17], [4, 18], [5, 9],
    [6, 11], [7, 27], [8, 33], [9, 40], [10, 32], [11, 35],
    [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
    [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
    [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
    [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
    [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
    [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
    [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
    [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
    [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
    [66, 70], [67, 72], [68, 75], [69, 80]
  ]);

  var options = {
    width: 440,
    height: 380,
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Value of Portfolio'
    },
    backgroundColor: 'white'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function addNews(news) {
  let div = document.getElementById("news_div");

  news = news.slice(0, 2)
  news.forEach(elem => {
    let params = {
      message: elem.data
    }
    getSentiment("/sentiment" + formatParams(params)).then(sentiment => {
      console.log("card" + sentiment)
      let card = createCard(elem.title, elem.img, elem.data, elem.url, sentiment)
      div.appendChild(card)
    })
  });
}

function getCompaniesNews() {
  let div = document.getElementById("news_div");
  let news = []
  div.innerHTML = ""

  companies.forEach(company => {
    let params = {
      api_key: 'OmY4Y2VjYjFhMTg1ZWEzMWMwMDRlZGYzYzc1ZDdiMDRm'
    }
    url = 'https://api-v2.intrinio.com/companies/' + company + '/news'
    getNews(url + formatParams(params)).then(news_list => {
      news_list = news_list.news.slice(0, 3)
      news_list.forEach(n => {
        new_obj = {
          title: n.title,
          publication_date: n.publication_date,
          url: n.url,
          data: n.summary,
          img: ''
        }
        news.push(new_obj)
      })
      return news
    }).then(news => {
      console.log(news)
      addNews(news)
    })
  })
}

function createCard(title, img, data, url, sentiment) {
  im = img
  card = document.createElement('div')
  card.className = "card"
  img = document.createElement('img')
  img.className = "card-img-top"
  img.src = im
  cardBody = document.createElement('div')
  cardBody.className = "card-body"
  a = document.createElement('a')
  cardTitle = document.createElement('h5')
  cardTitle.className = "card-title"
  cardTitle.innerHTML = title
  a.href = url
  cardText = document.createElement('div')
  cardText.className = "card-text"
  cardText.innerHTML = data
  badge = document.createElement('span')

  if (sentiment > 0) {
    badge.className = "badge badge-success"
  }
  else {
    badge.className = "badge badge-danger"
  }
  badge.innerHTML = sentiment

  a.appendChild(cardTitle)
  card.appendChild(img)
  cardBody.appendChild(a)
  cardBody.appendChild(cardText)
  cardBody.appendChild(badge)
  card.appendChild(cardBody)

  return card
}

function formatParams(params) {
  return "?" + Object
    .keys(params)
    .map(function (key) {
      return key + "=" + encodeURIComponent(params[key])
    })
    .join("&")
}

function AddCompany() {
  let company = document.getElementById("companyInput").value;
  
  // Validate the input
  if( !company){
    alert("No company provided");
    return;
  }

  let params = {
    api_key: 'OmY4Y2VjYjFhMTg1ZWEzMWMwMDRlZGYzYzc1ZDdiMDRm',
    page_size: 1,
    query: company
  }
  url = 'https://api-v2.intrinio.com/companies/search'
  getCompanyIDdata(url + formatParams(params)).then(companyIDdata => {
    if (companyIDdata.companies.length == 0) {
      alert(`${company} was not found.`);
      return;
    }
    // Add the company ticker to the current company list
    companies.push(companyIDdata.companies[0].ticker)
    addBadge(companyIDdata.companies[0])
    getCompaniesNews();
  })

}

function removeCompany(spanValue) {
  let container = document.getElementById("companiesBox")
  let spans = container.getElementsByTagName("span")
  let span;

  for(let i = 0; i < spans.length; i++){
    span = spans[i]
    if (span.value === spanValue) container.removeChild(span) 
  }
  companies = companies.filter(function (value) {
    return value !== spanValue;
  });
  console.log(companies)
  getCompaniesNews();
}

function addBadge(company) {
  let container = document.getElementById("companiesBox")
  let span = document.createElement("span")
  span.className = `badge badge-${getRandomColor()}`
  span.value = company.ticket
  span.innerHTML = company.name
  span.onclick = () => removeCompany(span.value)

  container.appendChild(span)
}

function getRandomColor() {
  let colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
  return colors[Math.floor(Math.random() * 8)]
}