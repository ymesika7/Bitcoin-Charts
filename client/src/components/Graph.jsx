import React, {useEffect, useState, createRef} from 'react'
import styled from 'styled-components'

const getHeightInViewportHeight = (num, heightOfAxis, minOfAxis) => {
    const pxToDec = heightOfAxis/400;
    return (Math.round((num-minOfAxis) / pxToDec))*100/722; // 722 Viewport size
}

const getDistanceInViewportWidth = (xA, yA, xB, yB) => { 
	var xDiff = xA - xB; 
	var yDiff = yA - yB; 
	return (Math.sqrt(xDiff * xDiff + yDiff * yDiff)*100)/1536; // 1536 Viewport size
}

const slope = (x1 , y1 , x2 , y2) => {
    console.log(x1, y1, x2, y2)
    if (x1 === x2)
        return Number.MAX_VALUE;
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

const Graph = (props) => {
    const {data, currency} = props;
    const [bgValues, setBgValues] = useState();
    const [heightOfAxis, setHeightOfAxis] = useState();
    const [elRefs, setElRefs] = useState([]);
    const [coords, setCoords] = useState();

    useEffect(() => {
        // Calculate background values
        if(data) {
            const min = Math.floor(parseInt(data[currency[1]])/1000)*1000,
                  max = Math.ceil(parseInt(data[currency[2]])/1000)*1000,
                  diff = Math.round((max - min) / 4);
            setBgValues([min, min + diff, min + diff + diff, max - diff, max]) 
            setHeightOfAxis(max - min)
        }
    },[data, currency])

    useEffect(() => {
        // Create array of refs
        setElRefs(elRefs => (
            Array(4).fill().map((_, i) => elRefs[i] || createRef())
          ));
    },[]);
    
    useEffect(() =>{
        if(elRefs.length > 0) {
            const _coords = []
            for(let ref in elRefs){
                if(elRefs[ref].current)
                    _coords.push({x:elRefs[ref].current.offsetLeft, y:elRefs[ref].current.offsetTop})
            }
            setCoords(_coords);
        }
    },[bgValues, elRefs])  

    return (
        <div className="graph-chart-container"> 
            <div className="graph-board">
                {/* Create background grid lines */}
                { [...new Array(4)].map((_, index) => <BgRowItem place={index+1}/>) }
                {/* Create background Y axis data with Circles to indicate bitcoin price */}
                { bgValues &&
                  bgValues.map((item, index) => 
                    <BgTextData place={index}>
                        {props.currencyFlag? '\u20AA': '$'}{item.toLocaleString()}
                    </BgTextData>)}
                { bgValues && currency.map((item, index)=> 
                    <Circle className="graph-data" ref={elRefs[index]} index={index+1} height={getHeightInViewportHeight(Math.floor(parseInt(data[item])),heightOfAxis, bgValues[0])}>
                        <span className="graph-tooltiptext">
                            {item.substr(4) + parseInt(data[item]).toLocaleString()}
                        </span>
                    </Circle>)
                }
                {/* Create connection lines between the circles */}
                { bgValues && coords && coords.length > 0 && 
                  [...new Array(3)].map((_, index) =>
                    <DrawLine index={index+1} 
                        height={getHeightInViewportHeight(Math.floor(parseInt(data[currency[index]])),heightOfAxis, bgValues[0])} 
                        deg={slope(coords[index].x, coords[index].y, coords[index+1].x, coords[index+1].y)} 
                        width={getDistanceInViewportWidth(coords[index].x, coords[index].y, coords[index+1].x, coords[index+1].y)} />)
                }
            </div>
        </div>
    )
}

const BgBase = styled.div`
    position: absolute;
    bottom: 0;
    margin-bottom: ${(p) => `${p.place*13.85}vh`};
`
const BgRowItem = styled(BgBase)`
    width:100%;
    border-top: 1px solid #b1b0b0; 
`

const BgTextData = styled(BgBase)`
    margin-left: -2vw;
    color: #949494;
`

const Circle = styled.div`
    position: absolute;
    bottom: 0;
    width:1.5vw;
    height:1.5vw;
    background-color:#000;
    border-radius:50%;

    margin-bottom: ${(p) => `${p.height}vh`};
    margin-left:${(p) => `${p.index*7.48}vw`};
    z-index:1;

    &:hover {
        visibility: visible;
        background-color:#faf6f6;
    }
`

const DrawLine = styled.div`
    width: ${(p) => `${p.width}vw`};
    height:4px;
    position: absolute;
    bottom: 0;
    margin-bottom: ${(p) => `${p.height+0.8}vh`};
    margin-left:${(p) => `${p.index*7.48+0.7}vw`};
    background-color: #000;
    transform-origin: 0% 0%;
    transform: ${(p) => `rotate(${p.deg}deg)`};
` 

export default Graph
