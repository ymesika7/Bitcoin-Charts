import React from 'react'
import styled from 'styled-components'

// Pre calculate candle width data for dynamically view
const WIDTH_DATA = { 90: [0.92, 0.13], 
    180 : [0.4231, 0.065], 
    364: [0.175, 0.065], 
    1000: [0.022, 0.013]}

// Enum to pull data 
const BitcoinRates = {"open":0, "low":1, "high":2, "close":3}

const Candle = (props) => {
    const {_key, index, data, currency, currencyFlag, showDays} = props
    // Set a pre calculate ratio between currency <-> viewport
    const currencyToViewport = currencyFlag? 0.00036 : 0.001125;    
    const flag = data[currency[BitcoinRates.open]] < data[currency[BitcoinRates.close]];

    const FixedNumber = (index) => {
        return Math.round(data[currency[index]]).toLocaleString()+(currencyFlag ? '(ILS)' : '(USD)');
    }

    return (
        <CandleContainer className="candle-data" width={WIDTH_DATA[showDays][0]} marginL={index} marginB={Math.abs(data[currency[BitcoinRates.low]]*currencyToViewport)}>
            <Stick width={WIDTH_DATA[showDays][1]} 
                    height={flag ? Math.abs(data[currency[BitcoinRates.high]] - data[currency[BitcoinRates.close]])*currencyToViewport:
                                    Math.abs(data[currency[BitcoinRates.high]] - data[currency[BitcoinRates.open]])*currencyToViewport}/> 
            <CandleBody width={WIDTH_DATA[showDays][0]} up={flag} height={Math.abs(data[currency[BitcoinRates.open]] - data[currency[BitcoinRates.close]])*currencyToViewport}/> 
            <Stick width={WIDTH_DATA[showDays][1]} 
                    height={flag ? Math.abs(data[currency[BitcoinRates.open]] - data[currency[BitcoinRates.low]])*currencyToViewport: 
                                     Math.abs(data[currency[BitcoinRates.close]] - data[currency[BitcoinRates.low]])*currencyToViewport}/>  
            <span className="candle-tooltiptext">
                {`Date: ${_key}`}<br/>
                {`Open: ${FixedNumber(BitcoinRates.open)}`}<br/>
                {`Close: ${FixedNumber(BitcoinRates.close)}`}<br/>
                {`Low: ${FixedNumber(BitcoinRates.low)}`}<br/>
                {`High: ${FixedNumber(BitcoinRates.high)}`}
            </span> 
        </CandleContainer>
    )
}

const CandleContainer = styled.div`
    position:absolute;
    bottom:0;
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    margin-right: ${(p) => `${1.3 + p.marginL*(p.width+0.065)}vw`};
    margin-bottom: ${(p) => `${p.marginB}vh`};
    cursor:pointer;
`

const CandleBody = styled.div`
    width: ${(p) => `${p.width}vw`};
    height: ${(p) => p.height>0.8 ? `${p.height}vh` : '0.8vh'};
    border-radius: 0.2vmax;
    background-color:${(p) => p.up ? '#025802' : '#f70606'};  
`

const Stick= styled(CandleBody)`
    width: ${(p) => `${p.width}vw`};
    height: ${(p) => `${p.height}vh`};
    background-color:#000;
`

export default Candle
