import * as d3 from "d3";
import { useEffect, useState } from "react";

function VerticalAxis({ scale,strokeColor,xPro }) {
  const x = 0;
  const [y1, y2] = scale.range();
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={strokeColor} />
      <g>
        {scale.ticks().map((y) => {
          return (
            <g transform={`translate(0,${scale(y)})`}>
              <line x1="0" y1="0" x2="-5" y2="0" stroke={strokeColor} />
              <text
                x="-8"
                textAnchor="end"
                dominantBaseline="central"
                fontSize="12"
              >
                {y}
              </text>
            </g>
          );
        })}

        <text
            x = "160"
            y = "440">{xPro}
            </text>
      </g>
    </g>
  );
}

function HorizontalAxis({ scale,strokeColor,yPro }) {
    const y = 400;
    const [x1, x2] = scale.range();
    return (
      <g>
        <line x1={x1} y1={y} x2={x2} y2={y} stroke={strokeColor} />
        <g>
          {scale.ticks().map((x) => {
            return (
              <g transform={`translate(${scale(x)}, 410)`}>
                <line x1="0" y1="-5" x2="0" y2="-10" stroke={strokeColor} />
                <text
                  x="6"
                  y = "5"
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize="12"


                >
                  {x}
                </text>
               
              </g>
            );
          })}
            <text
            transform={`rotate(-90)`}
            x = "-230"
            y = "-35">{yPro}</text>
        </g>
      </g>
    );
  }

function Legends({color}) {
    const sp=['setosa', 'versicolor', 'virginica'];
    let i = 0;
    return(
        <g>
            { color.domain().map( (data,i) => {
                return(
                    <g key={i} transform={`translate(400, ${i*30 + 5})`} >
                    <circle cx = '-7' cy='-5' r = '7' fill = {color(sp[i])}/>
                    <text>{data}</text>
                    </g>
                );
                })
                
                }
        </g>
    );
}
 
export default function App() {
  const margin = {
    top: 10,
    bottom: 50,
    left: 50,
    right: 100,
  };
  const contentWidth = 400;
  const contentHeight = 400;
  const strokeColor = "#888";

  const [data, setData] = useState([]);
  const [xProperty, setXpro] = useState('sepalLength');
  const [yProperty, setYpro] = useState('sepalWidth');


  useEffect(() => {
    
    (async () => {
      const request = await fetch("iris.json");
      const data = await request.json();
      setData(data);
    })();
  }, []);


  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (item) => item[xProperty]))
    .range([0, contentWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (item) => item[yProperty]))
    .range([contentHeight, 0])
    .nice();
   
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  console.log();
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  return (
    
    <div>
      <span>xProperty</span>
      <select onChange={e => setXpro(e.target.value)}>
        
        <option value="sepalLength" selected="selected">sepalLength</option>
        <option value="sepalWidth">sepalWidth</option>
        <option value="petalLength">petalLength</option>
        <option value="petalWidth">petalWidth</option>
      </select>

      <span>  yProperty</span>
      <select onChange={e => setYpro(e.target.value)}>
        <option value="sepalLength">sepalLength</option>
        <option value="sepalWidth" selected="selected">sepalWidth</option>
        <option value="petalLength">petalLength</option>
        <option value="petalWidth">petalWidth</option>
      </select>

      <svg
        viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        style={{ border: "solid 1px" }}
      >
        <VerticalAxis scale={yScale} strokeColor={strokeColor} xPro = {xProperty}/>
        <HorizontalAxis scale={xScale} strokeColor={strokeColor} yPro = {yProperty}/>
        <Legends color = {colorScale}/>

        <g>
          {data.map((item, i) => {
        
            return (
              <circle
                key={i}
                cx={xScale(item[xProperty])}
                cy={yScale(item[yProperty])}
                r="5"
                fill={colorScale(item.species)}
                style={{ transitionDuration:"1s",
                         transitionProperty:'all',
                         transitionDelay:"0.2s"}}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}