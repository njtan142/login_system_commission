import React, { useEffect, useState } from 'react';
import styled from 'styled-components';


export default function ClockView() {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container>
      {value && value.toDateString()}
      <Time>{value && value.getHours().toString().length === 1? "0" + value.getHours(): value.getHours()} : {value && value.getMinutes().toString().length === 1? "0" + value.getMinutes(): value.getMinutes()} : {value && value.getSeconds().toString().length === 1? "0" + value.getSeconds(): value.getSeconds()}</Time>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  time{
    height: 150px;
  }
  font-size: 1.5em;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;

  @media (max-width: 768px) {
        box-sizing: border-box;
    }
`;

const Time = styled.div`
`;