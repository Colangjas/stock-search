fetch("../barchart-stocks.json")
.then(response => {
   return response.json();
})
.then(stocks => populateStocks(stocks));



function populateStocks(stocks){

    const container = document.querySelector('#root > table > tbody');
    
    for (let i = 0; i < stocks.length; i++){
    
        if(stocks[i].price < 71.52){
            listItem(stocks[i].symbol, stocks[i].price);   
        }
    }
    function listItem(symbol, price){

    
        let tr = document.createElement('tr');
        let tdS = document.createElement('td');
        tdS.setAttribute('id', symbol);
        tdS.style.textAlign = 'right'

        let tdP = document.createElement('td');
        tdP.setAttribute('id', price);
        tdP.textContent = '$'+price;
        
        let a = document.createElement('a'); 
        a.innerText = symbol;
        a.href = 'https://ca.finance.yahoo.com/quote/'+symbol+'/key-statistics';
        a.target = '_blank';
        
        tdS.appendChild(a);
        tr.appendChild(tdS);
        tr.appendChild(tdP);
        container.appendChild(tr);
    }

    function getStats(symbol, price){

    
        let li = document.createElement('li');
        let a = document.createElement('a'); 
        a.innerText = symbol+' - $'+price;
        a.href = 'https://ca.finance.yahoo.com/quote/'+symbol+'/key-statistics';
        a.target = '_blank';
    
        li.appendChild(a);
        container.appendChild(li);
    }
}



