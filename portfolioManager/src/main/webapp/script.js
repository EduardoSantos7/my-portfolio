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
//google.charts.setOnLoadCallback(drawBackgroundColor);

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

function drawBackgroundColor(marketCapitalData) {
  if (!marketCapitalData) return;
  var data = new google.visualization.arrayToDataTable(marketCapitalData)

  console.log(marketCapitalData)
  data.addRows(marketCapitalData);

  var options = {
    width: 440,
    height: 380,
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Value of Market Capital'
    },
    backgroundColor: 'white'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function addNews(news) {
  let div = document.getElementById("news_div");
  div.innerHTML = ""

  news.forEach(elem => {
    let params = {
      message: elem.data.length < 2000 ? elem.data : elem.data.substring(0, 2000)
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
  div.innerHTML = ""
  
  companies.forEach(company => {
    let params = {
      api_key: 'OmY4Y2VjYjFhMTg1ZWEzMWMwMDRlZGYzYzc1ZDdiMDRm'
    }
    let news = []
    url = 'https://api-v2.intrinio.com/companies/' + company + '/news'
    getNews(url + formatParams(params)).then(news_list => {
      news_list = news_list.news.slice(0, 2)
      news_list.forEach(n => {
        new_obj = {
          title: n.title,
          publication_date: n.publication_date,
          url: n.url,
          data: n.summary,
          img: ''
        }
        console.log("agregue")
        news.push(new_obj)
      })
      return news
    }).then(news => {
      console.log(news)
      addNews(news)
      news = []
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
    refresh();
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
  console.log(spanValue, companies)
  var index = companies.indexOf(spanValue);
  if (index !== -1) companies.splice(index, 1);
  console.log(companies)
  refresh();
}

function addBadge(company) {
  let container = document.getElementById("companiesBox")
  let span = document.createElement("span")
  span.className = `badge badge-${getRandomColor()}`
  span.value = company.ticker
  span.innerHTML = company.name
  span.onclick = () => removeCompany(span.value)

  container.appendChild(span)
}

function getRandomColor() {
  let colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
  return colors[Math.floor(Math.random() * 8)]
}

function getMarketCapital() {
  let data = [["Date", "Market Value"]]
  companies.forEach(company => {
    let params = {
      api_key: 'OmY4Y2VjYjFhMTg1ZWEzMWMwMDRlZGYzYzc1ZDdiMDRm'
    }
    url = 'https://api-v2.intrinio.com/companies/' + company + '/historical_data/marketcap'
    getMarkenCapital(url + formatParams(params)).then(resut => {
      historical_data = resut.historical_data;
      historical_data.forEach(day_data => {
        data.push([day_data['date'], day_data['value']])
      })
    }).then(company_data => {
      console.log(company_data)
      drawBackgroundColor(company_data)
    })
  })
}

function refresh() {
  getCompaniesNews();
  getMarketCapital();
}