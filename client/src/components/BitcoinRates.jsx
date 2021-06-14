import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Graph from './Graph'
import CandlestickGraph from './CandlestickGraph'

const ILS_TYPE = ['1a. open (ILS)', '3a. low (ILS)', '2a. high (ILS)', '4a. close (ILS)'] // By API scheme
const USD_TYPE = ['1b. open (USD)', '3b. low (USD)', '2b. high (USD)', '4b. close (USD)'] // By API scheme

const BitcoinRates = () => {
    const [date, setDate] = useState();
    const [byDateData, setByDateData] = useState();
    const [allData, setAllData] = useState();
    const [days, setDay] = useState(90);
    const [screen, setScreen] = useState(true); // Which screen user want to see
    const [currency, setCurrency] = useState(false);

    useEffect(() => {
        // Make a server call for all the data received from API
        const callServer = async () => 
            await axios.get(`/btcData`).then((response) => setAllData(response.data));
        callServer();
    },[])

    useEffect( () =>{
        // Make a server call for the require date
        const callServer = async () => 
            await axios.get(`/btcData/${date}`).then((response) => setByDateData(response.data));
        if(date) callServer();
    },[date, currency])
            
    return (
        <> 
            <header> Bitcoin Chart</header>
            <div className='floating-buttons'>
                <button onClick={()=> setScreen(!screen)}>{screen? 'By Day': 'By Period'}</button> 
                <button onClick={()=> setCurrency(!currency)}>{currency? 'ILS to USD' : 'USD to ILS' }</button> 
                {screen && <> <button onClick={(e)=> setDay(90)} >3M</button> <button onClick={(e)=> setDay(180)} >6M</button>
                        <button onClick={(e)=> setDay(364)} >1Y</button><button onClick={(e)=> setDay(1000)} >3Y</button> </>}
            </div>
            <div className="container" >
                { screen? <CandlestickGraph data={allData} currency={currency? ILS_TYPE : USD_TYPE} currencyFlag={currency} showDays={days}/> : 
                    <> 
                        <Graph data={byDateData} currency={currency? ILS_TYPE : USD_TYPE} currencyFlag={currency} />
                            <label class='input-date'>
                                Please Select {''}
                                <input type='date' min="2018-09-16" max={new Date().toISOString().slice(0, -14)} onChange={(e) => setDate(e.target.value)}/>
                            </label>
                    </>
                }
            </div>
        </>
    )
}

export default BitcoinRates
