import React, {useEffect, useState, useCallback} from 'react'
import Candle from './Candle'
import styled from 'styled-components'


const CandlestickGraph = (props) => {
    const {data, currency} = props;
    const [bgValues, setBgValues] = useState(); 
    const [dataKeys, setDataKeys] = useState([]);

    const initialComp = useCallback(
        () => {
            setBgValues(props.currencyFlag? [`\u20AA0.00k`,'\u20AA50.00k','\u20AA100.00k','\u20AA150.00k', '\u20AA200.00k'] 
                                                : ['$0.00k','$16.00k','$32.00k','$48.00k', '$64.00k'])             
            //Set require data by user period pick
            const _dataKeys = [];
            if(data) {
                for (let variable in data) {
                    _dataKeys.push(variable)
                    
                    if(_dataKeys.length >= props.showDays)
                        break;
                }
                setDataKeys(_dataKeys);
            }
        },
        [data, props.showDays, props.currencyFlag])

    useEffect(() => {
        initialComp()
    }, [data, initialComp])

    useEffect( () =>{
        initialComp()
    },[props.showDays, currency, data, initialComp])
    
    return (
        <div className="candle-chart-container">
            {/* Draw background lines and Y axis data */}
            { bgValues && [...new Array(5)].map((item,index) => 
                <BgRowItem place={index}> 
                    <BgTextData>
                        {bgValues[index]} 
                    </BgTextData> 
                </BgRowItem>
            )}
            {/* Draw candles */}
            <div className="candle-board">
                { dataKeys && dataKeys.map((key, index) =>
                    <Candle key={index} _key={key} index={index} data={data[key]} currency={currency} currencyFlag={props.currencyFlag} showDays={props.showDays} /> )
            }
            </div>
        </div>
    )
}

const BgBase = styled.div`
    position: absolute;
    bottom: 0;
    margin: 0 1vw;
`

const BgRowItem = styled(BgBase)`
    width: 94vw;
    border-bottom:  ${(p) => p.place > 0 ? '1px solid #b1b0b0': '2px solid #000'};
    margin-bottom: ${(p) => `${p.place*18}vh`};
`

const BgTextData = styled(BgBase)`
    left:0;
    color: #949494;
`

export default CandlestickGraph
