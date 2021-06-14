import axios from 'axios';
import fs from 'fs';

const getData = () => {
    const headers = {
    'Content-Type': 'application/json'
    };
    
    axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=ILS&apikey=4AF4LXVO77QRQL0H`)
        .then(function (response) {
            // handle success
            fs.writeFile('btcData.json', JSON.stringify(response.data["Time Series (Digital Currency Daily)"]), (err) => console.log(err));
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

export default getData;